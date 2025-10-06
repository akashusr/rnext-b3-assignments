import React from "react";
import PaymentBreadcrumb from "@/components/payment/PaymentBreadcrumb";
import PaymentContainer from "@/components/payment/PaymentContainer";

// Accept search params to know if coming from details (single product) or cart
const Page = async ({ searchParams }) => {
  const {
    productId = null,
    qty = null,
    from = null,
    cartIds = null,
  } = searchParams || {};
  return (
    <>
      <PaymentBreadcrumb />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentContainer
          productId={productId}
          qty={qty}
          from={from}
          cartIds={cartIds}
        />
      </div>
    </>
  );
};

export default Page;
