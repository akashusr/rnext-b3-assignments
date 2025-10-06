import ImgHero from "../../assets/images/hero.png";

export default function HeroImg() {
  return (
    <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
      <img src={ImgHero} alt="hero image" />
    </div>
  );
}
