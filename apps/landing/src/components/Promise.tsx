import { Brain, Dumbbell, HeartHandshake, Wallet } from "lucide-react";

const pillars = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Mental Health",
    desc: "Your capacity to think clearly, handle stress, and show up as the person you want to be. Gaming can help — or hurt. We make sure it helps.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    gradient: "from-purple-500/50",
    hoverBorder: "hover:border-purple-400/20",
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "Physical Health",
    desc: "Your body matters too. Posture, movement, sleep, nutrition — the stuff gamers forget about until it catches up with them. We talk about it.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    gradient: "from-sky-500/50",
    hoverBorder: "hover:border-sky-400/20",
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Emotional Health",
    desc: "The quality of your experiences matters. Positive feelings, healthy relationships, managing frustration — not just in-game, but in life.",
    color: "text-un-gold",
    bg: "bg-un-gold/10",
    gradient: "from-un-gold/50",
    hoverBorder: "hover:border-un-gold/20",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Financial Health",
    desc: "Making smart decisions with your money. Whether it's gaming budgets, avoiding predatory microtransactions, or building real-world skills.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    gradient: "from-emerald-500/50",
    hoverBorder: "hover:border-emerald-400/20",
  },
];

export default function Promise() {
  return (
    <section id="promise" className="py-28 md:py-32 bg-un-darker relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-20" />
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10">
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
              className={`bg-un-card border border-un-card-border rounded-xl p-6 relative overflow-hidden card-glow transition-all ${pillar.hoverBorder}`}
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
