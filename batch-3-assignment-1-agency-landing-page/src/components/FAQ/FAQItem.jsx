import IconChevron from "../UI/Icons/IconChevron";

export default function FAQItem({ question, answer, isActive, index }) {
  return (
    <>
      <h3 id={`accordion-flush-heading-${index}`}>
        <button
          type="button"
          className={`flex w-full items-center justify-between border-b border-gray-200 py-5 text-left font-medium dark:border-gray-700 ${isActive ? "bg-white text-gray-900 dark:bg-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          data-accordion-target="#accordion-flush-body-1"
          aria-expanded={isActive}
          aria-controls={`accordion-flush-body-${index}`}
        >
          <span>{question}</span>
          <IconChevron
            className={`h-6 w-6 shrink-0 ${isActive && "rotate-180"}`}
          />
        </button>
      </h3>
      <div
        id={`accordion-flush-body-${index}`}
        className={isActive ? "" : "hidden"}
        aria-labelledby={`accordion-flush-heading-${index}`}
      >
        <div className="border-b border-gray-200 py-5 dark:border-gray-700">
          {answer}
        </div>
      </div>
    </>
  );
}
