import { NextResponse } from "next/server";
import { dbConnect } from "@/mongo";
import { BookingModel } from "@/models/BookingModel";
import { ProductModel } from "@/models/productModel";
import { UserModel } from "@/models/UserModel";

// GET /api/invoice/:id
// Returns a simple JSON invoice representation for now (can be turned into PDF later)
export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { error: "Missing invoice id" },
        { status: 400 }
      );
    }
    const booking = await BookingModel.findById(id)
      .populate(
        "product",
        "product_name product_price_per_kg product_image owner_id"
      )
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .exec();
    if (!booking) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    // Basic invoice payload
    const invoice = {
      invoiceId: booking._id.toString(),
      date: booking.createdAt,
      status: booking.status,
      buyer: booking.buyer
        ? {
            id: booking.buyer._id?.toString?.(),
            name: booking.buyer.name,
            email: booking.buyer.email,
          }
        : undefined,
      farmer: booking.farmer
        ? {
            id: booking.farmer._id?.toString?.(),
            name: booking.farmer.name,
            email: booking.farmer.email,
          }
        : undefined,
      product: booking.product
        ? {
            id: booking.product._id.toString(),
            name: booking.product.product_name,
            unitPrice: booking.product.product_price_per_kg,
            image: booking.product.product_image,
          }
        : undefined,
      quantityKg: booking.quantityKg,
      unitPrice: booking.unitPrice,
      totalPrice: booking.totalPrice,
      notes: booking.notes || "",
    };
    return NextResponse.json(invoice);
  } catch (e) {
    console.error("Invoice generation failed", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
