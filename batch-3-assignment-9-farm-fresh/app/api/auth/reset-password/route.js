import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password required" },
        { status: 400 }
      );
    }
    await dbConnect();
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log(
        "[RESET-PASSWORD][DEBUG] incoming token(raw)=",
        token,
        "hash=",
        hash
      );
    }
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      if (process.env.EMAIL_DEBUG === "1") {
        // eslint-disable-next-line no-console
        console.log("[RESET-PASSWORD][DEBUG] No matching user for hash", hash);

        // Let's check if there's a user with this email but different token/expiry
        const anyUser = await User.findOne({ email: { $exists: true } }).select(
          "+resetPasswordToken +resetPasswordExpires email"
        );
        if (anyUser) {
          // eslint-disable-next-line no-console
          console.log(
            "[RESET-PASSWORD][DEBUG] Found user with email:",
            anyUser.email
          );
          // eslint-disable-next-line no-console
          console.log(
            "[RESET-PASSWORD][DEBUG] Stored hash:",
            anyUser.resetPasswordToken
          );
          // eslint-disable-next-line no-console
          console.log(
            "[RESET-PASSWORD][DEBUG] Expires:",
            anyUser.resetPasswordExpires
          );
          // eslint-disable-next-line no-console
          console.log("[RESET-PASSWORD][DEBUG] Current time:", new Date());
          // eslint-disable-next-line no-console
          console.log(
            "[RESET-PASSWORD][DEBUG] Token expired:",
            new Date() > anyUser.resetPasswordExpires
          );
        }
      }
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Ensure role default if somehow absent
    if (!user.role) user.role = "customer";
    await user.save();
    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log(
        "[RESET-PASSWORD][DEBUG] password updated for user",
        user._id.toString()
      );
    }

    return NextResponse.json({ message: "Password reset successful" });
  } catch (e) {
    console.error("Reset password error", e);
    return NextResponse.json(
      { error: "Unable to reset password" },
      { status: 500 }
    );
  }
}

// Optional GET: validate token (for debugging / preflight)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const wantDebug =
      searchParams.get("debug") === "1" && process.env.EMAIL_DEBUG === "1";
    if (!token) {
      return NextResponse.json(
        { valid: false, reason: "missing token" },
        { status: 400 }
      );
    }
    await dbConnect();
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    if (process.env.EMAIL_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.log("[RESET-PASSWORD][DEBUG][GET] raw=", token, "hash=", hash);
    }
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("_id resetPasswordExpires");
    if (!user) {
      return NextResponse.json(
        wantDebug ? { valid: false, hash } : { valid: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      wantDebug
        ? {
            valid: true,
            user: user._id.toString(),
            expires: user.resetPasswordExpires?.toISOString(),
            hash,
          }
        : { valid: true }
    );
  } catch (e) {
    return NextResponse.json(
      { valid: false, error: "server" },
      { status: 500 }
    );
  }
}
