import Button from "../UI/Button";

export default function Trial() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-gray-900 dark:text-white">
            Start your free trial today
          </h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
            Try Landwind Platform for 30 days. No credit card required.
          </p>
          <Button type="primary">Free trial for 30 days</Button>
        </div>
      </div>
    </section>
  );
}
