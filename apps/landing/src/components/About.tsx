import { BookOpen, Map, Gamepad2, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-28 md:py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-20 md:gap-24 items-center">
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
              for not knowing something.
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
