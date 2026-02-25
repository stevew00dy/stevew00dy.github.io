import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Sherpa from "./components/Sherpa";
import Guides from "./components/Guides";
import Tools from "./components/Tools";
import Why from "./components/Why";
import Values from "./components/Values";
import Promise from "./components/Promise";
import Community from "./components/Community";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <div className="min-h-screen bg-un-dark text-un-text">
      <Navbar />
      <Hero />
      <About />
      <Sherpa />
      <Guides />
      <Tools />
      <Why />
      <Values />
      <Promise />
      <Community />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
