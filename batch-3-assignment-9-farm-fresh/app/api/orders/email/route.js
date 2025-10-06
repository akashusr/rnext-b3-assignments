import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { BookingModel } from "@/models/BookingModel";
import { ProductModel } from "@/models/productModel";
import { User } from "@/models/UserModel";
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const { bookingId, bookingIds } = await req.json();
    if (!bookingId && (!Array.isArray(bookingIds) || !bookingIds.length)) {
      return new Response(JSON.stringify({ error: "Missing bookingId(s)" }), {
        status: 400,
      });
    }
    await dbConnect();

    const ids = bookingId ? [bookingId] : bookingIds;
    const objectIds = ids
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    if (!objectIds.length) {
      return new Response(JSON.stringify({ error: "Invalid id(s)" }), {
        status: 400,
      });
    }

    // Fetch bookings and products
    const bookings = await BookingModel.find({ _id: { $in: objectIds } })
      .populate("product", "product_name product_price_per_kg product_image")
      .lean();

    if (!bookings.length) {
      return new Response(JSON.stringify({ error: "No bookings found" }), {
        status: 404,
      });
    }

    // Ensure all bookings belong to the logged in user (buyer)
    const userId = session.user.id || session.user._id;
    const allOwned = bookings.every((b) => String(b.buyer) === String(userId));
    if (!allOwned) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const user = await User.findById(userId).select("email").lean();
    if (!user?.email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
      });
    }

    // Shape bookings for email helper
    const shaped = bookings.map((b) => ({
      id: b._id.toString(),
      product: b.product
        ? {
            product_name: b.product.product_name,
          }
        : {},
      quantityKg: b.quantityKg,
      unitPrice: b.unitPrice,
      totalPrice: b.totalPrice,
      notes: b.notes,
      createdAt:
        b.createdAt?.toISOString?.() || new Date(b.createdAt).toISOString(),
    }));

    const result = await sendOrderConfirmationEmail({
      to: user.email,
      bookings: shaped,
    });

    return new Response(JSON.stringify({ ok: true, result }), { status: 200 });
  } catch (e) {
    console.error("Order email error", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal error" }),
      { status: 500 }
    );
  }
}
