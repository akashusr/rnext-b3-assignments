"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartProvider";
import { getProductsByIds } from "@/actions/bulkProductsAction";
import OrderSummary from "@/components/payment/OrderSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import { useRouter } from "next/navigation";
import { getProductById } from "@/actions/productsAction";
import { processPayment, processCartPayment } from "@/actions/buyActions";

const PaymentContainer = ({ productId, qty, from, cartIds }) => {
  // Include status so we can distinguish loading vs unauthenticated
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); // {id, name, image, pricePerKg, quantityKg}
  const [address, setAddress] = useState("");
  const mountedRef = useRef(false);

  // Load items: if productId provided, single-item checkout; else use cart
  useEffect(() => {
    // Prevent premature redirect while session status still loading
    if (status === "loading") {
      if (!mountedRef.current) setLoading(true);
      return;
    }
    if (status === "unauthenticated") {
      // Only redirect once (avoid flicker) & preserve callback
      const cb =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/payment";
      router.replace(`/login?callbackUrl=${encodeURIComponent(cb)}`);
      return;
    }
    // Authenticated
    const load = async () => {
      try {
        setLoading(true);
        let list = [];
        const selectedCartIds = cartIds
          ? decodeURIComponent(cartIds)
              .split(/[,]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : null;

        if (cart && cart.length > 0) {
          const cartSource = selectedCartIds
            ? cart.filter((id) => selectedCartIds.includes(id))
            : cart;
          if (cartSource.length) {
            try {
              const prods = await getProductsByIds(cartSource);
              list = list.concat(
                prods.map((p) => ({
                  id: p.id,
                  name: p.product_name,
                  image: p.product_image,
                  pricePerKg: Number(p.product_price_per_kg),
                  quantityKg: 1,
                  owner_id: p.owner_id,
                  stock: p.product_stock,
                  source: "cart",
                }))
              );
            } catch (e) {
              console.warn("Failed loading cart products", e?.message);
            }
          }
        }
        if (productId && qty) {
          try {
            const p = await getProductById(productId);
            if (!list.find((i) => i.id === p.id)) {
              list.push({
                id: p.id,
                name: p.product_name,
                image: p.product_image,
                pricePerKg: Number(p.product_price_per_kg),
                quantityKg: Number(qty),
                owner_id: p.owner_id,
                stock: p.product_stock,
                source: from || "single",
              });
            }
          } catch (e) {
            console.warn("Failed loading single product", e?.message);
          }
        }
        setItems(list);
        setAddress(session?.user?.address || "");
      } finally {
        setLoading(false);
        mountedRef.current = true;
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    productId,
    qty,
    cart,
    cartIds,
    from,
    session?.user?.address,
    router,
  ]);

  const pricing = useMemo(() => {
    const subtotal = items.reduce(
      (sum, it) => sum + it.pricePerKg * it.quantityKg,
      0
    );
    const deliveryFee = items.length > 0 ? 50 : 0;
    const serviceFee = items.length > 0 ? 25 : 0;
    const total = subtotal + deliveryFee + serviceFee;
    return { subtotal, deliveryFee, serviceFee, total };
  }, [items]);

  const submitPayment = async (paymentMethod, extra) => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    if (items.length === 0) return;
    // If single product checkout
    if (items.length === 1 && productId && items[0].id === productId) {
      const first = items[0];
      if (String(first.owner_id) === String(session.user.id)) {
        alert("You cannot buy your own product.");
        return;
      }
      if (first.quantityKg <= 0 || first.quantityKg > Number(first.stock)) {
        alert("Invalid quantity or insufficient stock.");
        return;
      }
      try {
        const res = await processPayment({
          productId: first.id,
          buyerId: session.user.id,
          quantityKg: first.quantityKg,
          deliveryAddress: address,
          paymentMethod: paymentMethod || "card",
        });
        if (!res?.ok) throw new Error(res?.error || "Payment failed");
        const bookingId = res?.data?.id;
        if (!bookingId) throw new Error("Booking id missing in response");
        // Send invoice email before redirect (fire & await to ensure single send)
        try {
          await fetch("/api/orders/invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
        } catch (err) {
          console.warn("Invoice email failed (single)", err?.message);
        }
        router.push(`/success?bookingId=${bookingId}`);
      } catch (e) {
        console.error("Single payment error", e);
        alert(e?.message || "Payment failed. Please try again.");
      }
      return;
    }
    // Multi-item cart checkout
    const payload = items.map((it) => ({
      productId: it.id,
      quantityKg: it.quantityKg,
    }));
    // Basic client-side validation
    for (const it of items) {
      if (String(it.owner_id) === String(session.user.id)) {
        alert("One of the items is your own product: " + it.name);
        return;
      }
      if (it.quantityKg <= 0 || it.quantityKg > Number(it.stock)) {
        alert("Invalid quantity for " + it.name);
        return;
      }
    }
    try {
      const res = await processCartPayment({
        items: payload,
        buyerId: session.user.id,
        deliveryAddress: address,
        paymentMethod: paymentMethod || "card",
      });
      if (!res?.ok) throw new Error(res?.error || "Payment failed");
      const successIds = res?.data?.bookingIds || [];
      if (!Array.isArray(successIds) || successIds.length === 0) {
        alert("No items could be processed.");
        return;
      }
      // Send invoice email for all bookings
      try {
        await fetch("/api/orders/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingIds: successIds }),
        });
      } catch (err) {
        console.warn("Invoice email failed (cart)", err?.message);
      }
      const qs = encodeURIComponent(successIds.join(","));
      router.push(`/success?bookingIds=${qs}`);
    } catch (e) {
      console.error("Cart payment error", e);
      alert(e?.message || "Payment failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <OrderSummary
        items={items}
        pricing={pricing}
        address={address}
        onEditAddress={setAddress}
        onEditItem={(id, updates) =>
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
          )
        }
        onRemoveItem={(id) =>
          setItems((prev) => prev.filter((it) => it.id !== id))
        }
      />
      <PaymentForm
        total={pricing.total}
        onSubmit={(method, data) => submitPayment(method, data)}
      />
    </div>
  );
};

export default PaymentContainer;
