"use client";
import { faDownload, faHome, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

const SuccessAction = () => {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const bookingIdsParam = params.get("bookingIds");
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState(null);

  // Direct download using GET endpoint (no email sending from success page)
  const downloadPdf = useCallback(async () => {
    if (downloading) return;
    setMessage(null);
    setDownloading(true);
    try {
      const query = bookingIdsParam
        ? `bookingIds=${encodeURIComponent(bookingIdsParam)}`
        : bookingId
        ? `bookingId=${encodeURIComponent(bookingId)}`
        : null;
      if (!query) {
        setMessage("Missing booking id(s)");
        return;
      }
      const res = await fetch(`/api/orders/invoice?${query}`, {
        method: "GET",
      });
      if (!res.ok) {
        let err = "Failed to download";
        try {
          const data = await res.json();
          err = data?.error || err;
        } catch {}
        throw new Error(err);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage("Downloaded");
    } catch (e) {
      console.error(e);
      setMessage(e.message);
    } finally {
      setDownloading(false);
    }
  }, [bookingId, bookingIdsParam, downloading]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={downloadPdf}
        disabled={downloading}
        className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
      >
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        {downloading ? "Downloading..." : "Download PDF"}
      </button>
      <a
        href="/orders"
        className="flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition"
      >
        <FontAwesomeIcon icon={faList} className="mr-2" />
        View All Orders
      </a>
      <a
        href="/"
        className="flex items-center justify-center px-8 py-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition"
      >
        <FontAwesomeIcon icon={faHome} className="mr-2" />
        Back to Home
      </a>
      {message && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 sm:mt-0">
          {message}
        </div>
      )}
    </div>
  );
};

export default SuccessAction;
