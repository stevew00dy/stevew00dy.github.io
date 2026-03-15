import Navbar from "../components/Navbar";
import BasicTraining from "../components/BasicTraining";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-un-dark text-un-text">
      <Navbar />
      <main className="pt-[72px]">
        <BasicTraining />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
