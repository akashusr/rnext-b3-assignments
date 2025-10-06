import Header from "../../components/header/Header";
import MarqueeBanner from "../../components/MarqueeBanner";

export default function LanguageLayout({ children, params }) {
  const lang = params?.lang;
  return (

        <div className="bg-gray-50 text-black">
          <Header lang={lang} />
          <MarqueeBanner lang={lang} />
          {children}
        </div>
      
   
  );
}
