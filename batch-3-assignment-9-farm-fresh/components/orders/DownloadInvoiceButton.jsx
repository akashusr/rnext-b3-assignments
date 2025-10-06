"use client";
import React, { useState } from "react";

export default function DownloadInvoiceButton({ bookingId }) {
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/invoice?bookingId=${bookingId}`);
      if (!res.ok) throw new Error("Failed to generate invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${bookingId.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(e.message || "Download failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 text-white rounded-lg font-medium transition"
    >
      <i className="fas fa-download mr-2" />
      {loading ? "Preparing..." : "Download"}
    </button>
  );
}
