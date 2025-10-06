import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { BookingModel } from "@/models/BookingModel";
import { ProductModel } from "@/models/productModel";
import { User } from "@/models/UserModel";
import mongoose from "mongoose";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

// Build company meta from env (fallback defaults)
function buildCompany() {
  return {
    name: process.env.COMPANY_NAME || "FarmFresh",
    tagline: process.env.COMPANY_TAGLINE || "Fresh Produce Marketplace",
    address:
      process.env.COMPANY_ADDRESS || "123 Green Valley Road, Dhaka, Bangladesh",
    phone: process.env.COMPANY_PHONE || "+8801XXXXXXXXX",
    email: process.env.COMPANY_EMAIL || "support@farmfresh.local",
    website: process.env.COMPANY_WEBSITE || "https://farmfresh.local",
    regNo: process.env.COMPANY_REG_NO || "REG-00012345",
  };
}

// Generate a better formatted, multi-page PDF invoice with enriched metadata
async function generateInvoice({ bookings, user, company }) {
  const pdfDoc = await PDFDocument.create();
  const A4 = [595.28, 841.89]; // width, height
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  const tableColDefs = [
    { key: "product", label: "Product", width: 240, align: "left" },
    { key: "qty", label: "Qty (kg)", width: 70, align: "right" },
    { key: "unit", label: "Unit Price", width: 100, align: "right" },
    { key: "line", label: "Line Total", width: 100, align: "right" },
  ];
  const rowHeight = 18;
  const headerHeight = 24;
  const footerHeight = 30;

  // helpers
  const currency = (n) => `Tk ${Number(n || 0).toFixed(2)}`;
  const invoiceDate = new Date();
  const invoiceId = `INV-${
    bookings[0]?._id?.toString().slice(-8) || "XXXXXX"
  }-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(invoiceDate.getDate()).padStart(2, "0")}`;

  let page = pdfDoc.addPage(A4);
  let { width, height } = page.getSize();
  let y; // current cursor
  let pageNumber = 1;

  const textWidth = (t, size = 12, bold = false) =>
    (bold ? fontBold : font).widthOfTextAtSize(String(t), size);

  const drawText = (
    text,
    {
      x = margin,
      y: customY,
      size = 11,
      bold = false,
      color = rgb(0, 0, 0),
    } = {}
  ) => {
    const targetY = customY !== undefined ? customY : y;
    page.drawText(String(text), {
      x,
      y: targetY,
      size,
      font: bold ? fontBold : font,
      color,
    });
  };

  const newPage = () => {
    page = pdfDoc.addPage(A4);
    ({ width, height } = page.getSize());
    pageNumber += 1;
    drawHeader();
    drawTableHeader();
  };

  const drawHeader = () => {
    y = height - margin;
    // Company Block (left)
    drawText(company.name, { size: 22, bold: true, y });
    y -= 18;
    if (company.tagline) {
      drawText(company.tagline, { size: 10, y });
      y -= 12;
    }
    // address may wrap
    if (company.address) {
      wrapText(company.address, 200, 10).forEach((line) => {
        drawText(line, { size: 10, y });
        y -= 12;
      });
    }
    if (company.phone) {
      drawText(`Phone: ${company.phone}`, { size: 10, y });
      y -= 12;
    }
    if (company.email) {
      drawText(`Email: ${company.email}`, { size: 10, y });
      y -= 12;
    }
    if (company.website) {
      drawText(company.website, { size: 10, y });
      y -= 12;
    }
    if (company.regNo) {
      drawText(`Reg No: ${company.regNo}`, { size: 10, y });
      y -= 12;
    }

    // Invoice meta (right)
    const metaX = width - margin - 200;
    const topY = height - margin;
    drawText("INVOICE", { x: metaX, y: topY, size: 20, bold: true });
    drawText(`Invoice No: ${invoiceId}`, { x: metaX, y: topY - 24, size: 11 });
    drawText(`Date: ${invoiceDate.toLocaleDateString()}`, {
      x: metaX,
      y: topY - 38,
      size: 11,
    });

    // Customer Block
    const custY = y - 24;
    drawText("Bill To:", { y: custY, bold: true });
    let cy = custY - 14;
    const customerLines = [
      user?.name || "Customer",
      user?.email,
      user?.phone && `Phone: ${user.phone}`,
      user?.address,
    ].filter(Boolean);
    customerLines.forEach((line) => {
      drawText(line, { y: cy, size: 10 });
      cy -= 12;
    });
    y = cy - 12; // space after customer block

    // Orders quick summary list (first page header section)
    drawText("Order Information:", { y, bold: true });
    y -= 14;
    bookings.slice(0, 8).forEach((b) => {
      const orderLine = `#${b._id.toString().slice(-6).toUpperCase()} • ${
        b.status
      } • ${new Date(b.createdAt).toLocaleDateString()}`;
      drawText(orderLine, { y, size: 9, color: rgb(0.2, 0.2, 0.2) });
      y -= 11;
    });
    if (bookings.length > 8) {
      drawText(`+ ${bookings.length - 8} more orders`, { y, size: 9 });
      y -= 12;
    }
    y -= 6; // gap before table header
  };

  const drawTableHeader = () => {
    const headerY = y;
    let xCursor = margin;
    // background bar
    page.drawRectangle({
      x: margin - 2,
      y: headerY - headerHeight + 4,
      width: width - margin * 2 + 4,
      height: headerHeight,
      color: rgb(0.95, 0.95, 0.95),
    });

    tableColDefs.forEach((col) => {
      const labelX =
        col.align === "right"
          ? xCursor + col.width - textWidth(col.label, 11, true) - 4
          : xCursor + 4;
      drawText(col.label, { x: labelX, y: headerY - 12, bold: true, size: 11 });
      xCursor += col.width;
    });
    // baseline
    page.drawLine({
      start: { x: margin - 2, y: headerY - headerHeight + 4 },
      end: { x: width - margin + 2, y: headerY - headerHeight + 4 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y = headerY - headerHeight - 2;
  };

  const ensureSpaceForRow = (rowNeededHeight = rowHeight) => {
    if (y - rowNeededHeight - footerHeight < margin) {
      drawFooter();
      newPage();
    }
  };

  const wrapText = (text, maxWidth, size = 10, bold = false) => {
    if (!text) return [""];
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = "";
    words.forEach((w) => {
      const test = current ? current + " " + w : w;
      if (textWidth(test, size, bold) > maxWidth - 8) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  const drawRow = ({ product, qty, unit, line }) => {
    const colData = [
      { value: product, col: tableColDefs[0] },
      { value: qty, col: tableColDefs[1] },
      { value: unit, col: tableColDefs[2] },
      { value: line, col: tableColDefs[3] },
    ];
    // Determine row height based on wrapped product name
    const productLines = wrapText(
      colData[0].value,
      tableColDefs[0].width,
      10,
      false
    );
    const rowLines = Math.max(productLines.length, 1);
    const thisRowHeight = rowLines * 12 + 6; // dynamic height

    ensureSpaceForRow(thisRowHeight);

    // optional horizontal guide lines
    page.drawLine({
      start: { x: margin - 2, y: y + 2 },
      end: { x: width - margin + 2, y: y + 2 },
      thickness: 0.3,
      color: rgb(0.9, 0.9, 0.9),
    });

    // Draw each column
    let xCursor = margin;
    colData.forEach((cell, idx) => {
      const { col } = cell;
      let linesToDraw;
      if (idx === 0) {
        linesToDraw = productLines;
      } else {
        linesToDraw = [String(cell.value ?? "")];
      }
      linesToDraw.forEach((lineText, lineIndex) => {
        const lineY =
          y - 14 - lineIndex * 12 + (thisRowHeight - rowLines * 12) / 2;
        const drawX =
          col.align === "right"
            ? xCursor + col.width - textWidth(lineText, 10, false) - 6
            : xCursor + 6;
        drawText(lineText, { x: drawX, y: lineY, size: 10 });
      });
      xCursor += col.width;
    });

    y -= thisRowHeight;
  };

  const drawFooter = () => {
    const footerY = margin - 20;
    page.drawLine({
      start: { x: margin - 2, y: footerY + 12 },
      end: { x: width - margin + 2, y: footerY + 12 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    drawText(`Page ${pageNumber}`, {
      x: width - margin - textWidth(`Page ${pageNumber}`, 9) - 2,
      y: footerY + 2,
      size: 9,
    });
    drawText("Thank you for shopping with FarmFresh!", {
      x: margin,
      y: footerY + 2,
      size: 9,
    });
  };

  const drawSummary = ({ subtotal, deliveryFee, serviceFee, total }) => {
    // vertical gap after last table row
    y -= 8;
    const boxWidth = 230;
    const boxHeight = 96;
    const requiredHeight = boxHeight + 60; // box + notes + breathing space
    // If not enough space on current page, jump to new page BEFORE drawing summary
    if (y - requiredHeight < margin + footerHeight) {
      drawFooter();
      newPage();
      y -= 10; // slight offset below table header
    }

    const boxX = width - margin - boxWidth;
    const boxY = y - boxHeight; // sit directly below current y

    // Draw subtle divider line above summary (spanning content width)
    page.drawLine({
      start: { x: margin - 2, y: y + 2 },
      end: { x: width - margin + 2, y: y + 2 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    // Box background
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    const lines = [
      ["Subtotal", currency(subtotal)],
      ["Delivery Fee", currency(deliveryFee)],
      ["Service Fee", currency(serviceFee)],
      ["Total Paid", currency(total), true],
    ];
    let lineY = boxY + boxHeight - 24;
    lines.forEach(([label, val, bold]) => {
      drawText(label, { x: boxX + 12, y: lineY, size: 10, bold });
      drawText(val, {
        x: boxX + boxWidth - textWidth(val, 10, bold) - 12,
        y: lineY,
        size: 10,
        bold,
      });
      lineY -= 18;
    });
    y = boxY - 30; // leave space below summary for notes
  };

  // START RENDERING
  drawHeader();
  drawTableHeader();

  let subtotal = 0;
  // Draw each booking row
  bookings.forEach((b) => {
    const lineTotal = Number(b.unitPrice || 0) * Number(b.quantityKg || 0);
    subtotal += lineTotal;
    const farmerName =
      b.farmer?.farmDetails?.farmName || b.farmer?.name || undefined;
    drawRow({
      product:
        `${b.product?.product_name || "-"}$` +
        (farmerName ? ` (Farmer: ${farmerName})` : "").replace("$", ""),
      qty: b.quantityKg,
      unit: currency(b.unitPrice),
      line: currency(lineTotal),
    });
  });

  const deliveryFee = 50;
  const serviceFee = 25;
  const total = subtotal + deliveryFee + serviceFee;

  drawSummary({ subtotal, deliveryFee, serviceFee, total });
  ensureSpaceForRow(40);
  drawText("If you have any questions, contact our support team.", {
    size: 9,
    y: y,
  });
  y -= 14;
  drawText(
    "This is a system generated invoice and does not require a signature.",
    {
      size: 8,
      y: y,
      color: rgb(0.4, 0.4, 0.4),
    }
  );

  drawFooter();

  return await pdfDoc.save();
}

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

    const bookings = await BookingModel.find({ _id: { $in: objectIds } })
      .populate("product", "product_name product_price_per_kg product_image")
      .populate("farmer", "name farmDetails.farmName")
      .lean();

    if (!bookings.length) {
      return new Response(JSON.stringify({ error: "No bookings found" }), {
        status: 404,
      });
    }

    const userId = session.user.id || session.user._id;
    const allOwned = bookings.every((b) => String(b.buyer) === String(userId));
    if (!allOwned) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const user = await User.findById(userId)
      .select("email name address phone")
      .lean();
    if (!user?.email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
      });
    }

    // Generate PDF
    const pdfBytes = await generateInvoice({
      bookings,
      user,
      company: buildCompany(),
    });

    // Encode base64 for transport & attach inline via existing email function (extend)
    // For now we embed a simple note in the HTML and send separate sendgrid send with attachment logic if configured
    // We'll call sendgrid directly here for attachment support to avoid changing mailer exports drastically.
    // Reuse mailer sendEmail capability by crafting message manually (duplicated minimal logic to keep isolation).

    const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;
    if (!SENDGRID_API_KEY || !EMAIL_FROM) {
      console.warn("Email config missing, returning PDF only");
      return new Response(
        JSON.stringify({ pdf: Buffer.from(pdfBytes).toString("base64") }),
        { status: 200 }
      );
    }

    // dynamic import to avoid top-level cost if not used
    const sgMail = (await import("@sendgrid/mail")).default;
    sgMail.setApiKey(SENDGRID_API_KEY);

    const totalQty = bookings.reduce(
      (s, b) => s + Number(b.quantityKg || 0),
      0
    );
    const currency = (n) => `৳${Number(n || 0).toFixed(2)}`;
    const single = bookings.length === 1;
    const code = bookings[0]._id.toString().slice(-6);
    const subject = single
      ? `Your FarmFresh Order Receipt (#${code})`
      : `Your FarmFresh Order Receipts (${bookings.length} Orders)`;

    const rowsHtml = bookings
      .map((b) => {
        const unit = b.unitPrice || b.product?.product_price_per_kg || 0;
        const line = Number(unit) * Number(b.quantityKg || 0);
        return `<tr>
          <td style="padding:6px 10px;border:1px solid #e5e7eb;">${
            b.product?.product_name || "-"
          }</td>
          <td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:center;">${
            b.quantityKg
          } kg</td>
          <td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:right;">${currency(
            unit
          )}</td>
          <td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:right;">${currency(
            line
          )}</td>
        </tr>`;
      })
      .join("");

    const subtotal = bookings.reduce(
      (sum, b) =>
        sum +
        Number(b.unitPrice || b.product?.product_price_per_kg || 0) *
          Number(b.quantityKg || 0),
      0
    );
    const deliveryFee = 50;
    const serviceFee = 25;
    const total = subtotal + deliveryFee + serviceFee;
    const placed = new Date(bookings[0].createdAt).toLocaleString();

    const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827;font-size:14px;line-height:1.5;">
      <h1 style="font-size:20px;margin:0 0 4px;font-weight:600;">Order Confirmation</h1>
      <p style="margin:0 0 16px;">Thank you for your purchase on <strong>FarmFresh</strong>. Below ${
        single
          ? "are the details of your order"
          : "are the details of your orders"
      }.</p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;font-size:13px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #e5e7eb;">Qty</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Unit Price</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Line Total</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div style="margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;margin:2px 0;"> <span>Subtotal:</span> <strong>${currency(
          subtotal
        )}</strong></div>
        <div style="display:flex;justify-content:space-between;margin:2px 0;"> <span>Delivery Fee:</span> <strong>${currency(
          deliveryFee
        )}</strong></div>
        <div style="display:flex;justify-content:space-between;margin:2px 0;"> <span>Service Fee:</span> <strong>${currency(
          serviceFee
        )}</strong></div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #e5e7eb;padding-top:6px;margin-top:6px;"> <span>Total Paid:</span> <strong>${currency(
          total
        )}</strong></div>
      </div>
      <p style="font-size:12px;margin:0 0 12px;color:#374151;">Placed: ${placed}</p>
      <p style="margin:0 0 18px;">Your PDF receipt is attached to this email for your records.</p>
      <p style="font-size:12px;color:#6b7280;margin:0 0 24px;">If you have any questions, just reply to this email.</p>
      <p style="font-size:12px;color:#9ca3af;margin:0;">&copy; ${new Date().getFullYear()} FarmFresh</p>
    </div>`;

    const attachment = Buffer.from(pdfBytes).toString("base64");

    const msg = {
      to: user.email,
      from: EMAIL_FROM,
      subject,
      text: "Your FarmFresh PDF invoice is attached.",
      html,
      attachments: [
        {
          content: attachment,
          filename: "invoice.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    const res = await sgMail.send(msg);

    return new Response(
      JSON.stringify({
        ok: true,
        pdf: attachment,
        messageId: res?.[0]?.headers?.["x-message-id"] || null,
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error("Invoice email error", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal error" }),
      { status: 500 }
    );
  }
}

// GET /api/orders/invoice?bookingId=... or ?bookingIds=id1,id2
// Streams the PDF directly (no email) so the browser can download it.
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const rawIds = searchParams.get("bookingIds");
    let ids = [];
    if (bookingId) ids = [bookingId];
    else if (rawIds)
      ids = rawIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (!ids.length) {
      return new Response(JSON.stringify({ error: "Missing bookingId(s)" }), {
        status: 400,
      });
    }

    await dbConnect();
    const objectIds = ids
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    if (!objectIds.length) {
      return new Response(JSON.stringify({ error: "Invalid id(s)" }), {
        status: 400,
      });
    }

    const bookings = await BookingModel.find({ _id: { $in: objectIds } })
      .populate("product", "product_name product_price_per_kg product_image")
      .populate("farmer", "name farmDetails.farmName")
      .lean();

    if (!bookings.length) {
      return new Response(JSON.stringify({ error: "No bookings found" }), {
        status: 404,
      });
    }

    const userId = session.user.id || session.user._id;
    const allOwned = bookings.every((b) => String(b.buyer) === String(userId));
    if (!allOwned) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const user = await User.findById(userId)
      .select("email name address phone")
      .lean();
    if (!user?.email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
      });
    }

    const pdfBytes = await generateInvoice({
      bookings,
      user,
      company: buildCompany(),
    });
    const single = bookings.length === 1;
    const filename = single
      ? `invoice-${bookings[0]._id.toString().slice(-8)}.pdf`
      : `invoices-${bookings.length}-orders.pdf`;

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Invoice GET error", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal error" }),
      {
        status: 500,
      }
    );
  }
}
