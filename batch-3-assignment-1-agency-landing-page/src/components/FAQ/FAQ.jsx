import FAQItem from "./FAQItem";

export default function FAQ() {
  const faqList = [
    {
      id: "c9758e68-4e87-4e8a-a8d2-02211dc05cc2",
      isActive: true,
      question: "Can I use Landwind in open-source projects?",
      answer: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Landwind is an open-source library of interactive components built
            on top of Tailwind CSS including buttons, dropdowns, modals,
            navbars, and more.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to{" "}
            <a
              href="#"
              className="text-purple-600 hover:underline dark:text-purple-500"
            >
              get started
            </a>{" "}
            and start developing websites even faster with components on top of
            Tailwind CSS.
          </p>
        </>
      ),
    },
    {
      id: "818aa963-b9dd-44c0-a0d9-bb1cf60e3ab9",
      question: "Is there a Figma file available?",
      answer: (
        <>
          {" "}
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Landwind is first conceptualized and designed using the Figma
            software so everything you see in the library has a design
            equivalent in our Figma file.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the{" "}
            <a
              href="#"
              className="text-purple-600 hover:underline dark:text-purple-500"
            >
              Figma design system
            </a>
            based on the utility classNamees from Tailwind CSS and components
            from Landwind.
          </p>
        </>
      ),
    },
    {
      id: "4bbfa903-6d43-4efc-a395-e5f34d46eaf3",
      question: "What are the differences between Landwind and Tailwind UI?",
      answer: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            The main difference is that the core components from Landwind are
            open source under the MIT license, whereas Tailwind UI is a paid
            product. Another difference is that Landwind relies on smaller and
            standalone components, whereas Tailwind UI offers sections of pages.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            However, we actually recommend using both Landwind, Landwind Pro,
            and even Tailwind UI as there is no technical reason stopping you
            from using the best of two worlds.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Learn more about these technologies:
          </p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="text-purple-600 hover:underline dark:text-purple-500"
              >
                Landwind Pro
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-purple-600 hover:underline dark:text-purple-500"
              >
                Tailwind UI
              </a>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "42cd764c-0929-4a23-876f-7f3bfa9edd83",
      question: "What about browser support?",
      answer: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            The main difference is that the core components from Landwind are
            open source under the MIT license, whereas Tailwind UI is a paid
            product. Another difference is that Landwind relies on smaller and
            standalone components, whereas Tailwind UI offers sections of pages.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            However, we actually recommend using both Landwind, Landwind Pro,
            and even Tailwind UI as there is no technical reason stopping you
            from using the best of two worlds.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Learn more about these technologies:
          </p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="text-purple-600 hover:underline dark:text-purple-500"
              >
                Landwind Pro
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-purple-600 hover:underline dark:text-purple-500"
              >
                Tailwind UI
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 lg:px-6 lg:pb-24">
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 lg:mb-8 lg:text-3xl dark:text-white">
          Frequently asked questions
        </h2>
        <div className="mx-auto max-w-screen-md">
          <div
            id="accordion-flush"
            data-accordion="collapse"
            data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            data-inactive-classes="text-gray-500 dark:text-gray-400"
          >
            {faqList.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isActive={faq?.isActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
