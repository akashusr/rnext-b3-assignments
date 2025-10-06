import { NextResponse } from "next/server";
import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";
import { ProductModel } from "@/models/productModel";

export const dynamic = "force-dynamic"; // ensure fresh counts on each request

export async function GET() {
  try {
    await dbConnect();

    const [farmers, customers, products] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "customer" }),
      ProductModel.countDocuments({ publish: true }),
    ]);

    return NextResponse.json({ farmers, customers, products });
  } catch (e) {
    console.error("/api/stats error", e);
    return NextResponse.json(
      { message: "Failed to load statistics" },
      { status: 500 }
    );
  }
}
