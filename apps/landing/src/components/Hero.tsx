import { Compass, Youtube, ChevronDown } from "lucide-react";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center star-field hero-glow pt-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/sc-hero-bg.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-un-dark/60 via-transparent to-un-dark" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
        <div className="float-animation mb-8">
          <Logo className="w-32 h-32 mx-auto" />
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight mb-2">
          <span className="gradient-text">UNDISPUTED</span>
          <br />
          <span className="text-un-text">NOOBS</span>
        </h1>

        <p className="text-un-gold font-display text-sm tracking-[0.3em] uppercase mb-10">
          Your Sherpa to the 'Verse
        </p>

        <p className="text-xl md:text-2xl text-un-muted max-w-2xl mx-auto mb-4 leading-relaxed">
          <span className="text-un-text font-semibold">
            Calm guides with simple breakdowns
          </span>
          —no hype, no noise—for people who just want help.
        </p>

        <p className="text-base text-un-muted/60 max-w-lg mx-auto mb-10">
          Led by{" "}
          <span className="text-un-accent font-semibold">Sherpa Steve</span>.
          Built for new players. Backed by a community of 10,000+.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#about"
            className="inline-flex items-center gap-2 bg-un-accent text-un-dark font-bold px-8 py-3.5 rounded-xl hover:bg-un-accent-light transition-all text-lg"
          >
            <Compass className="w-5 h-5" />
            Start Here
          </a>
          <a
            href="https://www.youtube.com/@undisputednoobs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-un-card-border text-un-text font-semibold px-8 py-3.5 rounded-xl hover:border-un-accent/50 hover:text-un-accent transition-all text-lg"
          >
            <Youtube className="w-5 h-5" />
            Watch on YouTube
          </a>
        </div>

        <a
          href="#sherpa"
          className="inline-block mt-16 text-un-muted hover:text-un-accent transition-colors"
        >
          <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
        </a>
      </div>
    </section>
  );
}
