import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Analytics from "./components/Analytics";

function LangdingPage() {
  return (
    <div className="min-h-screen sm:px-20 bg-white ">
      <Header />
      <Hero />
      <Features />
      <Analytics />
      <Footer />
    </div>
  );
}

export default LangdingPage;
