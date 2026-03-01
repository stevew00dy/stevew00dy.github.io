import {
  Rocket,
  BookOpen,
  Gamepad2,
  Shield,
  Compass,
  Map,
  Youtube,
  ExternalLink,
} from "lucide-react";

const guides = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Getting Started",
    desc: "Step-by-step beginner guides for Star Citizen. Everything you need to know, in order.",
    tag: "Beginner",
    url: "https://youtu.be/BGgyFafah58",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Completing the Tutorial",
    desc: "A full walkthrough of the new player tutorial.",
    tag: "New Player",
    url: "https://youtu.be/iAf2ksECBK4",
  },
  {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Setting Up HOSAS",
    desc: "Dual stick setup from scratch. How to configure it, what works, and how to make it feel right.",
    tag: "Setup",
    url: "https://youtu.be/6Ce2onBBzDU",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Ship Loadout Manager",
    desc: "How to use the loadout manager to kit out your ships properly — weapons, components, the lot.",
    tag: "Gear",
    url: "https://youtu.be/rcS7hvazP3I",
  },
  {
    icon: <Compass className="w-8 h-8" />,
    title: "Your First 1M aUEC",
    desc: "How to earn your first million in-game. Practical methods, no grind exploits, just solid gameplay.",
    tag: "Earning",
    url: "https://youtu.be/rShruH9luIE",
  },
  {
    icon: <Map className="w-8 h-8" />,
    title: "Full Beginner Playlist",
    desc: "The complete collection. Every beginner guide in one place, step by step, at your own pace.",
    tag: "Playlist",
    url: "https://youtube.com/playlist?list=PLOe_qfzz-rXCqlt_4NeXWwtDXRNY0IWiT",
  },
];

export default function Guides() {
  return (
    <section id="guides" className="py-24 bg-un-darker relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Video <span className="gradient-text">guides</span>
          </h2>
          <p className="text-un-muted max-w-2xl mx-auto mb-2">
            No filler. No 10-minute intros. No mid-roll ads — just one at the
            start, then an uninterrupted experience. We value your time, not
            waste it.
          </p>
        </div>

        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-un-accent/10 text-un-accent border border-un-accent/20 px-4 py-1.5 rounded-full text-sm font-semibold">
            <Rocket className="w-4 h-4" />
            Currently featuring: Star Citizen
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <a
              key={guide.title}
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-un-accent group-hover:text-un-accent-light transition-colors">
                  {guide.icon}
                </div>
                <span className="text-xs font-semibold text-un-accent bg-un-accent/10 px-2.5 py-1 rounded-full">
                  {guide.tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-un-accent transition-colors">
                {guide.title}
              </h3>
              <p className="text-un-muted text-sm leading-relaxed">
                {guide.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-un-accent/60 mt-3 group-hover:text-un-accent transition-colors">
                <Youtube className="w-3.5 h-3.5" />
                Watch on YouTube
              </span>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@undisputednoobs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-un-accent hover:text-un-accent-light font-semibold transition-colors"
          >
            Browse all guides on YouTube
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
