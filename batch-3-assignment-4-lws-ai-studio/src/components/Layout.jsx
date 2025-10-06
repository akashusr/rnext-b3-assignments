import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Glow */}
      <div className="fixed -bottom-1/4 -right-0 ">
        <div className="h-96 w-96 bg-gradient-to-r from-pink-600 to-indigo-400 rotate-90 rounded-full blur-[180px] "></div>
      </div>

      {children}
    </div>
  );
};

export default Layout;
