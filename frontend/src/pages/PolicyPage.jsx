import React from "react";
import Footer from "../components/Layout/Footer";
import Policy from "../components/Policy/Policy";
import Meta from "../components/Layout/Meta";
import Header from "../components/Layout/Header"

const PolicyPage = () => {
  return (
    <div>
      <Meta title="Chính sách 4D Market" />
      <Header/>
      <Policy />
      <Footer />
    </div>
  );
};

export default PolicyPage;
