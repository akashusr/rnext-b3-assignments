import LwsLogo from "./icons/LwsLogo.jsx"
const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <LwsLogo />
            <p className="text-gray-600 mb-4">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
