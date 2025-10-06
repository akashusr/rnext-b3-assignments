import FooterContent from "./FooterContent";
import FooterNav from "./FooterNav";
import FooterSocialList from "./FooterSocialList";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl p-4 py-6 md:p-8 lg:p-10 lg:py-16">
        <FooterNav />
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
        <div className="text-center">
          <FooterContent />
          <FooterSocialList />
        </div>
      </div>
    </footer>
  );
}
