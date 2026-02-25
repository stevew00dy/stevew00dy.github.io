import { User, Coffee, ExternalLink, Users } from "lucide-react";

export default function Sherpa() {
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
