import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import mongoClientPromise from "./mongoClientPromise";
import { User } from "./models/UserModel";
import bcrypt from "bcryptjs";
import { dbConnect } from "./mongo.js";

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens?.access_token,
      accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
      refreshToken: refreshedTokens?.refresh_token,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(mongoClientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Ensure MongoDB is connected before querying
          await dbConnect();

          const user = await User.findOne({ email: credentials.email }).exec();

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isMatch) {
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
              };
            } else {
              throw new Error("Email or password mismatch.");
            }
          } else {
            throw new Error("User not found.");
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    /**
     * Auto-link Google OAuth account to an existing credentials (email/password) user
     * so users can seamlessly switch to Google sign in without the OAuthAccountNotLinked error.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email }).exec();
          if (existingUser) {
            // Ensure the OAuth account is linked to the existing credentials user
            const client = await mongoClientPromise;
            const accountsCol = client.db().collection("accounts");

            const alreadyLinked = await accountsCol.findOne({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });

            if (!alreadyLinked) {
              await accountsCol.insertOne({
                userId: existingUser._id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at:
                  account.expires_at ||
                  (account.expires_in
                    ? Math.floor(Date.now() / 1000) + account.expires_in
                    : null),
                refresh_token: account.refresh_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              });
            }

            // Make sure downstream callbacks (jwt/session) use the existing user id
            user.id = existingUser._id.toString();

            // If the existing user is a farmer but missing required farm details, redirect to profile in edit mode
            if (existingUser.role === "farmer") {
              const fd = existingUser.farmDetails || {};
              const missing = [];
              if (!fd.farmName) missing.push("farmName");
              if (!fd.specialization) missing.push("specialization");
              if (fd.farmSize === undefined || fd.farmSize === null)
                missing.push("farmSize");
              if (missing.length > 0) {
                // Return a redirect URL (NextAuth allows returning string from signIn callback)
                return `/profile?edit=1&completeFarmer=1&missing=${encodeURIComponent(
                  missing.join(",")
                )}`;
              }
            }
          }
        } catch (e) {
          console.error("Auto-link google account failed:", e.message || e);
          // Even if linking fails, allow sign-in to proceed; fallback to default behaviour
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // console.log(`JWT token: ${JSON.stringify(token)}`);
      // console.log(`JWT Account: ${JSON.stringify(account)}`);

      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      } else if (user) {
        return {
          ...token,
          user,
        };
      }

      // For OAuth: Handle token expiration and refresh
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        // console.log(
        //   `Token still valid, expires at ${new Date(token.accessTokenExpires)}`
        // );
        return token;
      }

      if (token.refreshToken) {
        // console.log(`Token expired at ${new Date(Date.now())}, refreshing...`);
        return refreshAccessToken(token);
      }

      // Ensure role is present on token.user (esp. for OAuth users)
      try {
        if (token?.user?.email && !token?.user?.role) {
          await dbConnect();
          const existing = await User.findOne({ email: token.user.email })
            .select("role name email")
            .lean();
          if (existing) {
            token.user = {
              ...token.user,
              role: existing?.role || "customer",
              name: existing.name ?? token.user.name,
              email: existing.email ?? token.user.email,
            };
          }
        }
      } catch (e) {
        console.error("JWT role enrichment failed:", e);
      }

      // For credentials or already-enriched oauth: return the token with user info
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.refreshToken = token.refreshToken;
        session.expires = new Date(token.accessTokenExpires).toISOString();
        session.accessToken = token.accessToken;
        session.error = token?.error;
      }

      // Always refresh lightweight user fields (image, role, name) so UI (e.g., navbar) reflects latest changes
      try {
        await dbConnect();
        let dbUser = null;
        if (session?.user?.id) {
          dbUser = await User.findById(session.user.id)
            .select("image role name")
            .lean();
        } else if (session?.user?.email) {
          dbUser = await User.findOne({ email: session.user.email })
            .select("_id image role name")
            .lean();
          if (dbUser && !session.user.id)
            session.user.id = dbUser._id.toString();
        }
        if (dbUser) {
          session.user.image = dbUser.image || session.user.image || null;
          session.user.role = dbUser.role || session.user.role || "customer";
          session.user.name = dbUser.name || session.user.name;
        }
      } catch (e) {
        console.error("Session enrichment failed:", e.message);
      }

      // console.log(`Returning Session ${JSON.stringify(session)}`);
      return session;
    },
  },
  trustHost: true, // Add this to trust the host
  secret: process.env.NEXTAUTH_SECRET,
});
