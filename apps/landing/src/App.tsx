import { useState } from "react";
import {
  Compass,
  Users,
  BookOpen,
  Youtube,
  ChevronDown,
  Shield,
  Rocket,
  Map,
  Gamepad2,
  Heart,
  Star,
  ExternalLink,
  User,
  Brain,
  Dumbbell,
  HeartHandshake,
  Wallet,
  Crosshair,
  Timer,
  Wrench,
  TrendingUp,
  Hammer,
  Menu,
  X,
  Coffee,
  Lightbulb,
} from "lucide-react";
import Logo from "./components/Logo";

const NAV_LINKS: [string, string][] = [
  ["Sherpa Steve", "#sherpa"],
  ["Guides", "#guides"],
  ["Tools", "#tools"],
  ["Our Mission", "#why"],
  ["Values", "#values"],
  ["Our Promise", "#promise"],
  ["Community", "#community"],
];

const TOOL_LINKS: { title: string; url: string; external?: boolean }[] = [
  { title: "Armour Tracker", url: "/armor-tracker/" },
  { title: "Exec Hangar Tracker", url: "/exec-hangar-tracker/" },
  { title: "Wikelo Tracker", url: "/wikelo-tracker/" },
  { title: "Erkul Games", url: "https://www.erkul.games/", external: true },
  { title: "UEX Corp", url: "https://uexcorp.space/", external: true },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-un-darker/80 backdrop-blur-md border-b border-un-card-border">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <Logo className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-wide text-un-text group-hover:text-un-accent transition-colors leading-tight">
              UNDISPUTED NOOBS
            </span>
            <span className="text-[10px] text-un-muted tracking-widest uppercase leading-tight">
              Led by Sherpa Steve
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([label, href]) =>
            label === "Tools" ? (
              <div key={label} className="relative group">
                <a
                  href={href}
                  className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium inline-flex items-center gap-1"
                >
                  {label}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </a>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="bg-un-darker/95 backdrop-blur-md border border-un-card-border rounded-xl py-2 min-w-[200px] shadow-xl">
                    {TOOL_LINKS.map((tool) => (
                      <a
                        key={tool.title}
                        href={tool.url}
                        {...(tool.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-center justify-between px-4 py-2 text-sm text-un-muted hover:text-un-accent hover:bg-un-card-border/30 transition-colors"
                      >
                        {tool.title}
                        {tool.external && <ExternalLink className="w-3 h-3 opacity-40" />}
                      </a>
                    ))}
                    <div className="border-t border-un-card-border my-1" />
                    <a
                      href="#tools"
                      className="flex items-center px-4 py-2 text-sm text-un-accent/70 hover:text-un-accent transition-colors font-medium"
                    >
                      View all tools
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={label}
                href={href}
                className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium"
              >
                {label}
              </a>
            )
          )}
          <a
            href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-1.5 rounded-lg bg-un-accent text-un-darker text-sm font-bold hover:bg-un-accent/90 transition-colors"
          >
            Play Star Citizen
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-un-muted hover:text-un-accent transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-un-card-border bg-un-darker/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map(([label, href]) => (
              <div key={label}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium py-2 block"
                >
                  {label}
                </a>
                {label === "Tools" && (
                  <div className="flex flex-col pl-4 gap-0.5 mb-1">
                    {TOOL_LINKS.map((tool) => (
                      <a
                        key={tool.title}
                        href={tool.url}
                        {...(tool.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between text-xs text-un-muted/70 hover:text-un-accent transition-colors py-1.5"
                      >
                        {tool.title}
                        {tool.external && <ExternalLink className="w-3 h-3 opacity-40" />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 rounded-lg bg-un-accent text-un-darker text-sm font-bold hover:bg-un-accent/90 transition-colors text-center"
            >
              Play Star Citizen
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center star-field hero-glow pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-un-dark" />
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

function Why() {
  return (
    <section id="why" className="py-24 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-4">
            Our Mission
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            Why does any of this <span className="gradient-text">matter</span>?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 mb-16">
          <p className="text-un-muted text-lg leading-relaxed">
            People game to escape. After a long day, a tough week, a rough
            patch — you load up a game to decompress, to feel something
            different, to have a moment that's{" "}
            <span className="text-un-text font-semibold">yours</span>.
          </p>
          <p className="text-un-muted text-lg leading-relaxed">
            But somewhere along the way, gaming culture turned toxic.
            Chat full of noise. Communities that punish questions. Content
            creators screaming over every clip. You escape real life — and land
            in an environment that's{" "}
            <span className="text-un-text font-semibold">
              somehow worse
            </span>
            .
          </p>
          <p className="text-un-muted text-lg leading-relaxed">
            That's what Undisputed Noobs was built to fight.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-un-card border border-un-card-border rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent" />
            <h3 className="font-display font-bold text-lg text-red-400 mb-5">
              We are not
            </h3>
            <ul className="space-y-3 text-un-muted">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 shrink-0">—</span>
                <span>Loud, obnoxious, over-produced content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 shrink-0">—</span>
                <span>Clickbait or attention farming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 shrink-0">—</span>
                <span>Long intros, constant ads or misdirection</span>
              </li>
            </ul>
          </div>

          <div className="bg-un-card border border-un-card-border rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-un-accent/50 via-un-accent/20 to-transparent" />
            <h3 className="font-display font-bold text-lg text-un-accent mb-5">
              We are
            </h3>
            <ul className="space-y-3 text-un-muted">
              <li className="flex items-start gap-2">
                <span className="text-un-accent mt-1 shrink-0">+</span>
                <span>Calm guides that get straight to the point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-un-accent mt-1 shrink-0">+</span>
                <span>A community where no question is a stupid one</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-un-accent mt-1 shrink-0">+</span>
                <span>One ad, then uninterrupted — your time is yours</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

function Sherpa() {
  return (
    <section id="sherpa" className="py-24 bg-un-darker relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-un-card border border-un-card-border rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-un-accent/5 rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-un-blue border-2 border-un-accent/30 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-un-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl leading-tight">
                      <span className="gradient-text">Sherpa Steve</span>
                    </h3>
                    <p className="text-un-gold font-display text-xs tracking-widest uppercase">
                      Lead Guide · Undisputed Noobs
                    </p>
                  </div>
                </div>
                <p className="text-un-muted leading-relaxed mb-4">
                  Former head of Legion Esports (London) and associate
                  lecturer in esports at university level.
                </p>
                <p className="text-un-muted leading-relaxed mb-4">
                  900+ videos. Thousands of players helped. Still a noob at
                  heart — and that's the point. I remember what it's like to
                  be completely lost, overwhelmed, and too afraid to ask a
                  question.
                </p>
                <p className="text-un-muted leading-relaxed">
                  I make guides for the person I used to be. No assumptions.
                  No jargon. No hype. Just calm, clear, step-by-step help.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <a
                href="https://paypal.me/stevewoody"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-un-card border border-un-card-border rounded-xl flex items-center gap-3 px-4 py-3 hover:border-un-gold/50 transition-all group"
              >
                <Coffee className="w-5 h-5 text-un-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold group-hover:text-un-gold transition-colors">Buy Me a Coffee</p>
                  <p className="text-[10px] text-un-muted">Support the project</p>
                </div>
                <ExternalLink className="w-3 h-3 text-un-muted ml-auto shrink-0" />
              </a>
              <a
                href="https://robertsspaceindustries.com/citizens/stevewoody"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-un-card border border-un-card-border rounded-xl flex items-center gap-3 px-4 py-3 hover:border-sky-400/50 transition-all group"
              >
                <Users className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold group-hover:text-sky-400 transition-colors">Request a Sherpa</p>
                  <p className="text-[10px] text-un-muted">Add @stevewoody for a guided run</p>
                </div>
                <ExternalLink className="w-3 h-3 text-un-muted ml-auto shrink-0" />
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-4">
              Meet Your Guide
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              Every expert was once a{" "}
              <span className="gradient-text">noob</span>
            </h2>
            <p className="text-un-muted text-lg leading-relaxed mb-6">
              Sherpa Steve is the lead guide of the uNoob community.
              Whether it's a live sherpa session, a YouTube tutorial, or just
              answering questions in the comments — the approach is always the same:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Calm",
                  desc: "No shouting, no clickbait energy. Just a steady voice that helps you think clearly.",
                },
                {
                  title: "Simple",
                  desc: "Broken down into steps anyone can follow. If it's confusing, that's my problem — not yours.",
                },
                {
                  title: "Patient",
                  desc: "No question is too basic. You're not dumb for not knowing. You just haven't been shown yet.",
                },
              ].map((trait) => (
                <div key={trait.title} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-un-accent mt-2 shrink-0" />
                  <div>
                    <span className="text-un-text font-semibold">
                      {trait.title}
                    </span>
                    <span className="text-un-muted"> — {trait.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section id="values" className="py-24 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-un-gold font-display text-sm tracking-widest uppercase mb-4">
            The uNoob Code
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Three values. Non-negotiable.
          </h2>
          <p className="text-un-muted max-w-2xl mx-auto">
            This isn't a suggestion box. These are the values every member lives
            by. They're what makes this community a place worth being in — and
            what keeps the toxicity out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}values-triangles.png`}
              alt="Be Respectful, Stay Positive, Have Fun"
              className="w-full max-w-md mx-auto"
              draggable={false}
            />
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-purple-400">
                  Be Respectful
                </h3>
              </div>
              <p className="text-un-muted leading-relaxed pl-13">
                Respect for yourself and for others. Disagreements happen, but
                they're never a reason for toxicity. We create a healthy
                environment by understanding one another — not tearing each
                other down.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-yellow-400">
                  Stay Positive
                </h3>
              </div>
              <p className="text-un-muted leading-relaxed pl-13">
                How you show up when things go wrong matters more than when
                things go right. We choose to be contented, hopeful, and
                encouraging — especially when it's hard.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-sky-400">
                  Have Fun
                </h3>
              </div>
              <p className="text-un-muted leading-relaxed pl-13">
                This is a game. Life is for living. If gaming stops being fun,
                something's wrong — and it's usually the environment, not the
                game. We protect the fun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Promise() {
  const pillars = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Mental Health",
      desc: "Your capacity to think clearly, handle stress, and show up as the person you want to be. Gaming can help — or hurt. We make sure it helps.",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
      gradient: "from-purple-500/50",
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Physical Health",
      desc: "Your body matters too. Posture, movement, sleep, nutrition — the stuff gamers forget about until it catches up with them. We talk about it.",
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
      gradient: "from-sky-500/50",
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Emotional Health",
      desc: "The quality of your experiences matters. Positive feelings, healthy relationships, managing frustration — not just in-game, but in life.",
      color: "text-un-gold",
      bg: "bg-un-gold/10",
      border: "border-un-gold/20",
      gradient: "from-un-gold/50",
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Financial Health",
      desc: "Making smart decisions with your money. Whether it's gaming budgets, avoiding predatory microtransactions, or building real-world skills.",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      gradient: "from-emerald-500/50",
    },
  ];

  return (
    <section id="promise" className="py-24 bg-un-darker relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-un-gold font-display text-sm tracking-widest uppercase mb-4">
            Our Promise
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            It's bigger than <span className="gradient-text">gaming</span>
          </h2>
          <p className="text-un-muted max-w-2xl mx-auto text-lg">
            We deliver education focused on four pillars so our members can
            build valuable skills and improve their quality of life through{" "}
            <span className="text-un-text font-semibold">
              balanced wellbeing
            </span>
            .
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`bg-un-card border border-un-card-border rounded-xl p-6 relative overflow-hidden card-glow transition-all hover:${pillar.border}`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.gradient} to-transparent`}
              />
              <div
                className={`w-14 h-14 rounded-xl ${pillar.bg} flex items-center justify-center mb-5`}
              >
                <div className={pillar.color}>{pillar.icon}</div>
              </div>
              <h3 className={`font-display font-bold text-lg mb-3 ${pillar.color}`}>
                {pillar.title}
              </h3>
              <p className="text-un-muted text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-un-muted leading-relaxed mb-4">
            Gaming is where we start. But the skills, the mindset, the
            community — that carries over into everything else. We're not
            just helping you get better at games.
          </p>
          <p className="text-un-text font-semibold text-lg">
            We're helping you get better at life.
          </p>
        </div>
      </div>
    </section>
  );
}

function Guides() {
  const guides = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Getting Started",
      desc: "Step-by-step beginner guides for Star Citizen 4.0. Everything you need to know, in order.",
      tag: "Beginner",
      url: "https://youtu.be/BGgyFafah58",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Completing the Tutorial",
      desc: "A full walkthrough of the new player tutorial. No skipping ahead, no assumptions.",
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

  return (
    <section id="guides" className="py-24 bg-un-darker relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-4">
          <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-4">
            Start Here
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Guides that actually <span className="gradient-text">help</span>
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

function Tools() {
  const tools = [
    {
      icon: <Crosshair className="w-8 h-8" />,
      title: "Rare Armour Tracker",
      desc: "Track and find every rare armour set in Star Citizen. Locations, screenshots, and checklist.",
      tag: "uNoob",
      url: "/armor-tracker/",
      color: "text-purple-400",
      tagBg: "bg-purple-400/10 text-purple-400",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Exec Hangar Tracker",
      desc: "Executive Hangar timer, compboard checklist, supervisor keycards, vault door, and ship rewards.",
      tag: "uNoob",
      url: "/exec-hangar-tracker/",
      color: "text-un-accent",
      tagBg: "bg-un-accent/10 text-un-accent",
    },
    {
      icon: <Hammer className="w-8 h-8" />,
      title: "Wikelo Tracker",
      desc: "Track Wikelo contracts, manage your inventory, and craft rewards. All materials and recipes in one place.",
      tag: "uNoob",
      url: "/wikelo-tracker/",
      color: "text-amber-400",
      tagBg: "bg-amber-400/10 text-amber-400",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Erkul Games",
      desc: "Ship loadout builder and DPS calculator. The go-to tool for fitting out your ships.",
      tag: "Community",
      url: "https://www.erkul.games/",
      color: "text-sky-400",
      tagBg: "bg-sky-400/10 text-sky-400",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "UEX Corp",
      desc: "Live trade prices, mining data, refining calculators, and commodity routes across the 'verse.",
      tag: "Community",
      url: "https://uexcorp.space/",
      color: "text-emerald-400",
      tagBg: "bg-emerald-400/10 text-emerald-400",
    },
  ];

  return (
    <section id="tools" className="py-24 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-un-gold font-display text-sm tracking-widest uppercase mb-4">
            Star Citizen Tools
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Tools that save you <span className="gradient-text">time</span>
          </h2>
          <p className="text-un-muted max-w-2xl mx-auto">
            Our own trackers plus the best community tools out there.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${tool.color} group-hover:opacity-80 transition-opacity`}>
                  {tool.icon}
                </div>
                <span className={`text-xs font-semibold ${tool.tagBg} px-2.5 py-1 rounded-full`}>
                  {tool.tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-un-accent transition-colors">
                {tool.title}
              </h3>
              <p className="text-un-muted text-sm leading-relaxed flex-1">
                {tool.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-un-accent/60 mt-3 group-hover:text-un-accent transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Open Tool
              </span>
            </a>
          ))}

          <a
            href="https://robertsspaceindustries.com/citizens/stevewoody"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-dashed border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-gold/50 group flex flex-col items-center justify-center text-center"
          >
            <Lightbulb className="w-8 h-8 text-un-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display font-bold text-lg mb-2 group-hover:text-un-gold transition-colors">
              Got an App Idea?
            </h3>
            <p className="text-un-muted text-sm leading-relaxed">
              Message me on RSI and let me know what tool would help you out.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-un-gold/60 mt-3 group-hover:text-un-gold transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              @stevewoody on RSI
            </span>
          </a>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          <a
            href="https://www.ueepathfinders.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-un-accent/50 via-un-gold/30 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-un-accent shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-un-accent transition-colors">
                  UEE Pathfinders
                </h3>
                <p className="text-un-muted text-sm">
                  Hardcore mil-sim. Structured ops, anti-piracy, fleet strikes.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-un-accent/10 text-un-accent border border-un-accent/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-un-accent/20 transition-all">
                Enlist
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          <a
            href="https://x.com/CosmicCoal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-sky-400/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/50 via-sky-400/20 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-sky-400 shrink-0">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-sky-400 transition-colors">
                  Cosmic Coalition
                </h3>
                <p className="text-un-muted text-sm">
                  Casual org. Chill sessions, group play, no pressure.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-sky-400/10 text-sky-400 border border-sky-400/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-sky-400/20 transition-all">
                Follow
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          <a
            href="https://www.facebook.com/groups/623473311006319"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-blue-400/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-blue-400/20 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-blue-400 shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-blue-400 transition-colors">
                  Star Citizen Facebook Group
                </h3>
                <p className="text-un-muted text-sm">
                  Community group. News, discussions, and meetups.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-blue-400/20 transition-all">
                Join
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Community() {
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

function Footer() {
  return (
    <footer className="border-t border-un-card-border bg-un-darker py-10">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Logo className="w-7 h-7" />
          <span className="font-display font-bold text-sm tracking-wide text-un-muted">
            UNDISPUTED NOOBS
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <a href="/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Home</a>
          <a href="/armor-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Armour Tracker</a>
          <a href="/exec-hangar-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Exec Hangar Tracker</a>
          <a href="/wikelo-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Wikelo Tracker</a>
          <a href="https://www.youtube.com/@undisputednoobs" target="_blank" rel="noopener noreferrer" className="text-xs text-un-muted hover:text-un-accent transition-colors">YouTube</a>
          <a
            href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-un-muted hover:text-un-accent transition-colors"
          >
            Join Star Citizen (+50k aUEC)
          </a>
        </div>

        <p className="text-[10px] text-un-muted/50">
          &copy; {new Date().getFullYear()} Undisputed Noobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-4">
              Who We Are
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              Our <span className="gradient-text">community</span> is at the
              core of everything we do.
            </h2>
            <p className="text-un-muted text-lg leading-relaxed mb-6">
              We focus on our members by{" "}
              <span className="text-un-text font-semibold">
                adding value rather than extracting it
              </span>
              .
            </p>
            <p className="text-un-muted leading-relaxed mb-6">
              Undisputed Noobs — or{" "}
              <span className="text-un-accent font-semibold">uNoob</span> as
              the community calls it — is a place where new players are
              welcomed, questions are encouraged, and nobody gets laughed at
              for not knowing something. That's not how we roll.
            </p>
            <p className="text-un-muted leading-relaxed">
              Whether you're loading up a game for the first time or you've
              been playing for years, this is your space.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                label: "Guides & Tutorials",
                desc: "Step-by-step walkthroughs",
              },
              {
                icon: <Map className="w-6 h-6" />,
                label: "Sherpa Sessions",
                desc: "Guided runs with Steve",
              },
              {
                icon: <Gamepad2 className="w-6 h-6" />,
                label: "New Player Focus",
                desc: "Built for beginners",
              },
              {
                icon: <Users className="w-6 h-6" />,
                label: "uNoob Community",
                desc: "10K+ members strong",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30"
              >
                <div className="text-un-accent mb-3">{item.icon}</div>
                <h3 className="font-semibold text-un-text mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-un-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
    </div>
  );
}
