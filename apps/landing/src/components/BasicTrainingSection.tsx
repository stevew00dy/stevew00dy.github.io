import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function BasicTrainingSection() {
  return (
    <section id="basic-training" className="py-28 md:py-32 bg-un-darker relative overflow-visible">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10">
        <Link
          to="/training"
          className="relative flex flex-col md:flex-row md:items-center gap-10 md:gap-12 p-10 md:p-12 md:pr-[560px] lg:pr-[680px] bg-un-card/50 border border-un-card-border rounded-2xl hover:border-un-accent/40 transition-all group overflow-visible"
        >
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-un-accent font-display text-xs tracking-widest uppercase mb-3">New Player</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">
              Basic <span className="gradient-text">Training</span>
            </h2>
            <p className="text-un-muted text-sm md:text-base mb-6 max-w-md">
              Step-by-step lessons. Game package, spawn, tutorial, and what's next. Track progress and earn badges.
            </p>
            <span className="inline-flex items-center gap-2 bg-un-accent text-un-dark font-bold px-6 py-3 rounded-xl group-hover:bg-un-accent-light transition-colors">
              Start Basic Training
              <ChevronRight className="w-5 h-5" />
            </span>
          </div>

          {/* Image — overflows the card vertically */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[540px] lg:w-[660px] translate-x-4">
            <img
              src="/lesson-thumbnails/basic-training-stack.png"
              alt="Basic Training — lessons, progress, and lesson view"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300 drop-shadow-2xl"
            />
          </div>

          {/* Mobile: inline image */}
          <div className="md:hidden w-full">
            <img
              src="/lesson-thumbnails/basic-training-stack.png"
              alt="Basic Training — lessons, progress, and lesson view"
              className="w-full h-auto"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
