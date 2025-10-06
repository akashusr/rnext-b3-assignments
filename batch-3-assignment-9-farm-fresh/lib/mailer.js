import sgMail from "@sendgrid/mail";

function getBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.APP_BASE_URL ||
    "http://localhost:3000"
  );
}

export async function sendPasswordResetEmail({ to, token }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = (process.env.EMAIL_FROM || "").trim();
  const baseUrl = getBaseUrl();
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(
    token
  )}`;

  const subject = "FarmFresh Password Reset";
  const text = `You requested a password reset.\n\nReset link (valid 1 hour): ${resetUrl}\n\nIf you did not request this, ignore this email.`;
  const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p><p><small>This link is valid for 1 hour. If you did not request this, ignore this email.</small></p>`;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[DEV EMAIL OUTPUT - SENDGRID DISABLED]\nTo:",
        to,
        "\nSubject:",
        subject,
        "\nLink:",
        resetUrl
      );
      return { dev: true, reason: "missing_api_key" };
    }
    throw new Error("SENDGRID_API_KEY missing in production");
  }

  if (!from) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WARN] EMAIL_FROM missing. Console fallback.");
      console.log(
        "[DEV EMAIL OUTPUT - MISSING FROM]\nTo:",
        to,
        "\nSubject:",
        subject,
        "\nLink:",
        resetUrl
      );
      return { dev: true, reason: "missing_from" };
    }
    throw new Error("EMAIL_FROM missing");
  }

  // Log configuration status
  if (process.env.EMAIL_DEBUG === "1") {
    console.log("[EMAIL DEBUG] Configuration check:");
    console.log("- API Key present:", !!apiKey);
    console.log("- From address:", from);
    console.log("- Base URL:", baseUrl);
  }

  // SendGrid accepts either plain or Name <email>
  const plain = /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/;
  const named = /^[^<>]+<[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>$/;
  if (!plain.test(from) && !named.test(from)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[WARN] Invalid EMAIL_FROM format. Console fallback. Got:",
        from
      );
      console.log(
        "[DEV EMAIL OUTPUT - INVALID FROM]\nTo:",
        to,
        "\nSubject:",
        subject,
        "\nLink:",
        resetUrl
      );
      return { dev: true, reason: "invalid_from" };
    }
    throw new Error("Invalid EMAIL_FROM format");
  }

  sgMail.setApiKey(apiKey);
  try {
    const msg = { to, from, subject, text, html };
    const start = Date.now();
    const res = await sgMail.send(msg);
    const elapsed = Date.now() - start;
    if (process.env.EMAIL_DEBUG === "1") {
      console.log("[SENDGRID SENT]", {
        to,
        from,
        elapsedMs: elapsed,
        statusCode: res?.[0]?.statusCode,
        messageId: res?.[0]?.headers?.["x-message-id"],
      });
    }
    return {
      id: res?.[0]?.headers?.["x-message-id"] || null,
      statusCode: res?.[0]?.statusCode,
    };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      const body = e?.response?.body;
      console.error("[SENDGRID ERROR]", body || e.message);
      if (body?.errors) {
        body.errors.forEach((err) =>
          console.error("[SENDGRID ERROR DETAIL]", err)
        );
      }
      console.error("[SENDGRID DEBUG CONTEXT]", { to, from });
    }
    throw e;
  }
}

export function emailConfigured() {
  return Boolean(process.env.SENDGRID_API_KEY);
}

// Generic helper to send an email. Falls back to console in dev when not configured.
async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = (process.env.EMAIL_FROM || "").trim();
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[DEV EMAIL OUTPUT] -> Missing config, printing instead:\nTo:",
        to,
        "\nSubject:",
        subject,
        "\nText:\n",
        text
      );
      return { dev: true };
    }
    throw new Error("Email not configured");
  }
  sgMail.setApiKey(apiKey);
  const msg = { to, from, subject, text, html };
  const res = await sgMail.send(msg);
  return {
    id: res?.[0]?.headers?.["x-message-id"] || null,
    statusCode: res?.[0]?.statusCode,
  };
}

// Send order confirmation / receipt with one or multiple bookings
// bookings: [{ id, product: { product_name }, quantityKg, unitPrice, totalPrice, notes, createdAt }]
export async function sendOrderConfirmationEmail({ to, bookings = [] }) {
  if (!bookings.length)
    throw new Error("No bookings provided for receipt email");
  const currency = (n) => `৳${Number(n || 0).toFixed(2)}`;
  const single = bookings.length === 1;
  const subject = single
    ? `Your FarmFresh Order Receipt (#${bookings[0].id.slice(-6)})`
    : `Your FarmFresh Receipts (${bookings.length} Orders)`;
  const createdAt = (iso) =>
    iso ? new Date(iso).toLocaleString(undefined, { hour12: true }) : "-";
  const subtotal = bookings.reduce(
    (sum, b) => sum + Number(b.unitPrice || 0) * Number(b.quantityKg || 0),
    0
  );
  const deliveryFee = 50; // Simple flat fee (same as UI)
  const serviceFee = 25;
  const total = subtotal + deliveryFee + serviceFee;

  const rowsHtml = bookings
    .map(
      (b) => `<tr>
        <td style="padding:6px 8px;border:1px solid #e5e7eb;">${
          b.product?.product_name || "-"
        }</td>
        <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:center;">${
          b.quantityKg
        } kg</td>
        <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">${currency(
          b.unitPrice
        )}</td>
        <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">${currency(
          b.unitPrice * b.quantityKg
        )}</td>
      </tr>`
    )
    .join("");

  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;max-width:640px;margin:0 auto;font-size:14px;color:#111827;">
    <h1 style="font-size:20px;margin-bottom:4px;">$${
      single ? "Order Confirmation" : "Order Confirmations"
    }</h1>
    <p style="margin:0 0 16px;color:#374151;">Thank you for your purchase on FarmFresh. Below ${
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
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;line-height:1.6;">
        <span>Subtotal:</span><strong>${currency(subtotal)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;line-height:1.6;">
        <span>Delivery Fee:</span><strong>${currency(deliveryFee)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;line-height:1.6;">
        <span>Service Fee:</span><strong>${currency(serviceFee)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:4px;margin-top:4px;">
        <span>Total Paid:</span><strong>${currency(total)}</strong>
      </div>
    </div>
    <p style="font-size:12px;color:#6b7280;margin-top:24px;">Placed: ${createdAt(
      bookings[0].createdAt
    )}<br/>If you have any questions, just reply to this email.</p>
    <p style="font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} FarmFresh</p>
  </div>`;

  const text = `FarmFresh Receipt\n\nItems:\n${bookings
    .map(
      (b) =>
        `- ${b.product?.product_name || "-"} x ${b.quantityKg}kg @ ৳${
          b.unitPrice
        } = ৳${(b.unitPrice * b.quantityKg).toFixed(2)}`
    )
    .join("\n")}\n\nSubtotal: ${currency(subtotal)}\nDelivery Fee: ${currency(
    deliveryFee
  )}\nService Fee: ${currency(serviceFee)}\nTotal Paid: ${currency(
    total
  )}\n\nThank you for your order!`;

  return sendEmail({ to, subject, text, html });
}
