import React from "react";
import PricingFeatureItem from "./PricingFeatureItem";

export default function PricingTextFeatureItem({ label }) {
  return (
    <PricingFeatureItem>
      <span>{label}</span>
    </PricingFeatureItem>
  );
}
