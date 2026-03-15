import { Shield, Star, Heart } from "lucide-react";
import Pyramid from "./Pyramid";

export default function Values() {
  return (
    <section id="values" className="py-28 md:py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
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
            <Pyramid className="w-full max-w-md" />
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
