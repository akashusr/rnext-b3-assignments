"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import FooterLinks from "./FooterLinks";
const categories = [
  "Programming",
  "Data Science",
  "Technology",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Productivity"
].map(name => ({
  id: crypto.randomUUID(),
  name
}));

const Sidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategory = category => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  }, [selectedCategories]);

  return (
    <div className="lg:w-1/3 mt-10 lg:mt-0">
      <div className="sticky top-20">
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">
            Discover more of what matters to you
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategory(category.name)}
                className={`${
                  selectedCategories.includes(category.name) &&
                  "bg-green-200 font-medium"
                } px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <FooterLinks />
      </div>
    </div>
  );
};

export default Sidebar;
