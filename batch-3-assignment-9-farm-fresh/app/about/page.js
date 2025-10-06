import AboutHero from "@/components/about/AboutHero";
import Contact from "@/components/about/Contact";
import MissionVision from "@/components/about/MissionVision";
import Stats from "@/components/about/Stats";
import Team from "@/components/about/Team";
import Values from "@/components/about/Values";
import React from "react";

const page = () => {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <Values />
      <Stats />
      <Team />
      <Contact />
    </>
  );
};

export default page;
