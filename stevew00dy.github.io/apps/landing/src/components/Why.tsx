export default function Why() {
  return (
    <section id="why" className="py-28 md:py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
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
