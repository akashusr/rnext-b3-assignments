import { useState } from "react";
import AnnouncementBar from "../AnnouncementBar";
import Header from "../Header";
import Products from "../Products";
import CartAndSummary from "../CartAndSummary";
import Cart from "../Cart";
import OrderSummary from "../OrderSummary";
import Newsletter from "../Newsletter";
import Footer from "../Footer";
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <AnnouncementBar />
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Products searchQuery={searchQuery} />
          <CartAndSummary>
            <Cart />
            <OrderSummary />
          </CartAndSummary>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
};

export default HomePage;
