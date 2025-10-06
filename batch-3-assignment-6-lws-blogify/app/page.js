import SortingDropDown from "../components/SortingDropdown";
import Article from "@/components/Article";
import data from "@/data/data.json";
export default function Home({ searchParams }) {
  const categoryParam = searchParams.category || "";
  const sortParam = searchParams.sort || "latest";
  const selectedCategories = categoryParam.split(",").filter(c => c !== "");

  const filteredArticles =
    selectedCategories.length > 0
      ? data.filter(article => selectedCategories.includes(article.category))
      : data;

  let sortedArticles = [...filteredArticles];

  if (sortParam === "latest") {
    sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortParam === "oldest") {
    sortedArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
  }
  return (
    <div className="lg:w-2/3 lg:pr-12">
      <SortingDropDown />
      {sortedArticles.length > 0
        ? sortedArticles.map(blog => (
            <Article key={crypto.randomUUID()} blog={blog} />
          ))
        : "No articles found"}
    </div>
  );
}
