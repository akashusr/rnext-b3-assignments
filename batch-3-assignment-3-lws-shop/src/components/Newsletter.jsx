import Button from "./Button";
const Newsletter = () => {
  return (
    <section className="bg-black text-white py-12 px-4 md:px-8 mt-12">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          STAY UP TO DATE ABOUT
          <br />
          OUR LATEST OFFERS
        </h2>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow bg-white text-black rounded-md px-4 py-3"
          />
          <Button styles="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
