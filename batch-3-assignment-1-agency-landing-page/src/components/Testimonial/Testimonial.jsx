import IconQuote from "../UI/Icons/IconQuote";
import TestimonialAuthor from "./TestimonialAuthor";
import TestimonialText from "./TestimonialText";

export default function Testimonial() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-24">
        <figure className="mx-auto max-w-screen-md">
          <IconQuote className="mx-auto mb-3 h-12 text-gray-400 dark:text-gray-600" />
          <TestimonialText />
          <TestimonialAuthor />
        </figure>
      </div>
    </section>
  );
}
