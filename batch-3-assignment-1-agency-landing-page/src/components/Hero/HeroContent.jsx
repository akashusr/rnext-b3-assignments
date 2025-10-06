import Button from "../UI/Button";
import IconFigma from "../UI/Icons/IconFigma";
import IconGitHub from "../UI/Icons/IconGitHub";

export default function HeroContent() {
  return (
    <div className="mr-auto place-self-center lg:col-span-7">
      <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
        Building digital <br />
        products &amp; brands.
      </h1>
      <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400">
        This free and open-source landing page template was built using the
        utility classes from{" "}
        <a href="#" className="hover:underline">
          Tailwind CSS
        </a>{" "}
        and based on the components from the Flowbite Library and the Blocks
        System.
      </p>
      <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <Button type="outline" to="#">
          <IconGitHub className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          View on GitHub
        </Button>
        <Button type="secondary" to="#">
          <IconFigma className="mr-2 h-4 w-4" />
          Get Figma file
        </Button>
      </div>
    </div>
  );
}
