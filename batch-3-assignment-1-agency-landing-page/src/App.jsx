import Brand from "./components/Brand";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Service from "./components/Service";
import Stats from "./components/Stats";
import Testimonial from "./components/Testimonial";
import Trial from "./components/Trial";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Brand />
      <Service />
      <Stats />
      <Testimonial />
      <Pricing />
      <FAQ />
      <Trial />
      <Footer />
    </>
  );
}
