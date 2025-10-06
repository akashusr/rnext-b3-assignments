import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const { searchParams } = new URL(req.url);
    const wantDebug =
      searchParams.get("debug") === "1" && process.env.EMAIL_DEBUG === "1";
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );
    if (!user) {
      // Do not reveal whether user exists
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const updateResult = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hash,
          resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 60),
        },
      }
    );

    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log(
        "[FORGOT-PASSWORD][DEBUG] user=",
        user._id.toString(),
        "email=",
        user.email,
        "stored hash=",
        hash,
        "expires=",
        new Date(Date.now() + 1000 * 60 * 60).toISOString()
      );
    }

    const sendResult = await sendPasswordResetEmail({ to: user.email, token });

    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log("[FORGOT-PASSWORD][DEBUG] Send result:", sendResult);
    }

    const responseBody = {
      message: "If that email exists, a reset link has been sent.",
    };
    if (wantDebug) {
      responseBody.debug = {
        rawToken: token,
        hash,
        modifiedCount: updateResult?.modifiedCount,
        acknowledged: updateResult?.acknowledged,
      };
    }
    const headers = new Headers();

    if (sendResult?.dev) {
      headers.set("x-email-dev-fallback", sendResult.reason || "true");
      if (process.env.EMAIL_DEBUG === "1") {
        responseBody.debug = {
          reason: sendResult.reason,
          note: "Email not actually sent (dev fallback). Check server console for reset link.",
        };
      }
    }

    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log("[FORGOT-PASSWORD][DEBUG] token (raw):", token);
    }
    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log("[FORGOT-PASSWORD][DEBUG] update result:", updateResult);
    }

    return NextResponse.json(responseBody, { headers });
  } catch (e) {
    console.error("Forgot password error", e);
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
