import { Youtube } from "lucide-react";
import Logo from "./Logo";

export default function Community() {
  return (
    <section id="community" className="py-24 relative">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <Logo className="w-20 h-20 mx-auto mb-6 opacity-80" />
        <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-4">
          Join the uNoob Crew
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
          This is what a <span className="gradient-text">good community</span> looks like
        </h2>
        <p className="text-un-muted text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Subscribe, watch, and be part of a community that proves gaming
          content doesn't have to be loud, toxic, or clickbait. Just calm,
          helpful guides from someone who actually wants you to succeed.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { num: "10K+", label: "Subscribers" },
            { num: "900+", label: "Video Guides" },
            { num: "1M+", label: "Views" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-un-card border border-un-card-border rounded-xl p-6"
            >
              <p className="font-display font-bold text-2xl gradient-text mb-1">
                {stat.num}
              </p>
              <p className="text-sm text-un-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <a
          href="https://www.youtube.com/@undisputednoobs?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-red-700 transition-all text-lg"
        >
          <Youtube className="w-5 h-5" />
          Subscribe on YouTube
        </a>
      </div>
    </section>
  );
}
