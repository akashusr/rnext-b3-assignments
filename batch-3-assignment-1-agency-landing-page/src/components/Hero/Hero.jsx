import React from "react";
import HeroContent from "./HeroContent";
import HeroImg from "./HeroImg";

export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 pt-20 pb-8 lg:grid-cols-12 lg:gap-8 lg:py-16 lg:pt-28 xl:gap-0">
        <HeroContent />
        <HeroImg />
      </div>
    </section>
  );
}
