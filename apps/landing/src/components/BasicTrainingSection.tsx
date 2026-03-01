import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function BasicTrainingSection() {
  return (
    <section id="basic-training" className="py-16 bg-un-darker relative">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <Link
          to="/training"
          className="flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10 bg-un-card/50 border border-un-card-border rounded-2xl hover:border-un-accent/40 transition-all group"
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

          {/* Image — full 3-screenshot stack */}
          <div className="shrink-0 w-full md:w-[520px] lg:w-[600px]">
            <img
              src="/lesson-thumbnails/basic-training-stack.png"
              alt="Basic Training — lessons, progress, and lesson view"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
