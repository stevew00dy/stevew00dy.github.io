import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { useSearchParams, Link } from "react-router-dom";
import {
  Rocket,
  Crosshair,
  Briefcase,
  Home,
  ExternalLink,
  Link as LinkIcon,
  Play,
  Check,
  Compass,
  Lock,
  Award,
  Trophy,
  User,
  Users,
  Shield,
  GraduationCap,
  Star,
  Swords,
  ChevronRight,
  EyeOff,
  Factory,
  Zap,
  Radio,
} from "lucide-react";
import {
  getPathLessonOrder,
  getLessonsInOrder,
  getEarnedBadges,
  getBadgeProgress,
  BADGES,
  BASIC_TRAINING_CATEGORIES,
  LEARNING_PATHS,
  loadProgress,
  saveProgress,
  getTotalLessonCount,
  type Lesson,
  type Badge,
} from "../data/basicTraining";

/** Pill-arrow path for AC: Main menu → Game Modes → Arena Commander → Offline → Free Flight */
function ArenaCommanderPath() {
  const steps = ["Main menu", "Game Modes", "Arena Commander", "Offline", "Free Flight"];
  return (
    <div className="w-full flex flex-wrap items-center gap-2 py-1">
      {steps.map((label, i) => (
        <span key={label} className="contents">
          <span className={`px-4 py-2 rounded-lg border border-un-accent text-[#c4c8d0] text-sm font-medium shrink-0 ${i === steps.length - 1 ? "bg-un-accent/20 text-un-accent-light" : "bg-un-card-border/50"}`}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-un-accent shrink-0" />
          )}
        </span>
      ))}
    </div>
  );
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  Rocket: <Rocket className="w-4 h-4" />,
  Swords: <Swords className="w-4 h-4" />,
  Crosshair: <Crosshair className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
};

function BadgeIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = className ?? "w-6 h-6";
  switch (icon) {
    case "Shield": return <Shield className={cls} />;
    case "Rocket": return <Rocket className={cls} />;
    case "Swords": return <Swords className={cls} />;
    case "Crosshair": return <Crosshair className={cls} />;
    case "Briefcase": return <Briefcase className={cls} />;
    case "GraduationCap": return <GraduationCap className={cls} />;
    default: return <Trophy className={cls} />;
  }
}

const CHECKLIST_KEY = "undisputed-noobs-basic-training-checklist";

/** HUD image with numbered overlays linking to key elements below. Positions: 1=Mode, 2=Speed, 3=TVI, 4=Boost, 5=G-meter */
function HudKeyElementsImage({ src, base, onHover, onImageClick }: { src: string; base: string; onHover?: (id: number | null) => void; onImageClick?: (src: string, alt: string) => void }) {
  const imgSrc = base === "/" ? src : base.replace(/\/$/, "") + src;
  const alt = "In-game HUD showing mode, speed, TVI, G-meter, and boost bar";
  const overlays: { n: number; left: string; top: string }[] = [
    { n: 1, left: "17%", top: "24%" },
    { n: 2, left: "28%", top: "48%" },
    { n: 3, left: "52%", top: "53%" },
    { n: 4, left: "73%", top: "48%" },
    { n: 5, left: "88%", top: "12%" },   // Countermeasures
    { n: 6, left: "92%", top: "63%" },   // G-meter
  ];
  return (
    <div className="relative rounded-xl overflow-hidden border border-un-card-border bg-un-darker mx-auto w-full sm:max-w-[75%]">
      <button
        type="button"
        onClick={() => onImageClick?.(src, alt)}
        className="block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-un-accent rounded-xl overflow-hidden"
        aria-label="View image larger"
        title="Click to view larger"
      >
        <img src={imgSrc} alt={alt} className="w-full h-auto object-contain" />
      </button>
      {overlays.map(({ n, left, top }) => (
        <a
          key={n}
          href={`#hud-${n}`}
          className="absolute w-8 h-8 rounded-full bg-un-accent/90 text-un-dark font-bold text-sm flex items-center justify-center border-2 border-un-accent transition-colors cursor-pointer hover:bg-transparent hover:text-un-accent hover:border-un-accent"
          style={{ left, top, transform: "translate(-50%, -50%)" }}
          aria-label={`Jump to element ${n}`}
          onMouseEnter={() => onHover?.(n)}
          onMouseLeave={() => onHover?.(null)}
        >
          {n}
        </a>
      ))}
    </div>
  );
}

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;
  const colors = [
    "#00b4d8", "#48cae4", "#10b981", "#34d399", "#f0a500", "#ffc847",
    "#e8edf5", "#8892a4", "#a855f7",
  ];
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      startVelocity: 70,
      decay: 0.92,
      zIndex: 9000,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      startVelocity: 70,
      decay: 0.92,
      zIndex: 9000,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

function BadgeEarnedPopup({ badge, onDismiss }: { badge: Badge; onDismiss: () => void }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      fireConfetti();
    }
  }, []);

  return createPortal(
    <>
      {/* Backdrop: behind confetti */}
      <div
        className="fixed inset-0 z-[8000] bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      {/* Confetti layer: z-9000 */}
      {/* Card: in front of confetti */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="badge-earned-title"
      >
        <div
          className="relative bg-un-card border-2 border-un-accent/50 rounded-2xl p-5 sm:p-8 max-w-md w-full mx-2 shadow-[0_0_60px_rgba(0,180,216,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-un-accent/20 flex items-center justify-center mb-4 ring-4 ring-un-accent/30">
            <BadgeIcon icon={badge.icon} className="w-10 h-10 text-un-accent" />
          </div>
          <p className="text-un-accent font-display text-sm tracking-widest uppercase mb-2">Badge earned</p>
          <h2 id="badge-earned-title" className="font-display font-bold text-2xl text-un-text mb-2">
            {badge.name}
          </h2>
          <p className="text-un-muted text-sm leading-relaxed mb-6">{badge.flavour}</p>
          <button
            type="button"
            onClick={onDismiss}
            className="px-6 py-3 rounded-xl bg-un-accent text-un-dark font-bold hover:bg-un-accent-light transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
    </>,
    document.body
  );
}

function loadChecklistState(id: string): Set<number> {
  try {
    const raw = localStorage.getItem(`${CHECKLIST_KEY}-${id}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveChecklistState(id: string, checked: Set<number>): void {
  try {
    localStorage.setItem(`${CHECKLIST_KEY}-${id}`, JSON.stringify([...checked]));
  } catch {
    // ignore
  }
}

function ChecklistBlock({
  id,
  items,
}: {
  id: string;
  items: string[];
}) {
  const [checked, setChecked] = useState<Set<number>>(() => loadChecklistState(id));
  useEffect(() => {
    setChecked(loadChecklistState(id));
  }, [id]);

  const toggle = useCallback((index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      saveChecklistState(id, next);
      return next;
    });
  }, [id]);

  return (
    <div className="rounded-xl border border-un-card-border bg-un-card/30 px-4 py-3">
      <ul className="space-y-3 list-none m-0 p-0">
        {items.map((item, j) => {
          const isChecked = checked.has(j);
          return (
            <li key={j} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggle(j)}
                className={`shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  isChecked
                    ? "bg-un-accent border-un-accent text-un-darker"
                    : "border-un-muted hover:border-un-accent/50"
                }`}
                aria-label={isChecked ? `Uncheck: ${item}` : `Check: ${item}`}
                aria-pressed={isChecked}
              >
                {isChecked ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
              </button>
              <span className={`text-sm ${isChecked ? "text-un-muted line-through" : "text-un-text-secondary"}`}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const YOUTUBE_ID_REGEXES = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
];

function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  for (const re of YOUTUBE_ID_REGEXES) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Thumbnail for a YouTube lesson video. Uses hqdefault (480×360) so it works for all videos. */
function getYouTubeThumbnailUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

interface LessonContentProps {
  lesson: Lesson;
  step: number;
  totalSteps: number;
  categoryTitle: string;
  categoryIcon: string;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  showCompleteButton?: boolean;
}

/** Guilds and professions from CitizenCon 2954 — used for prof-0 custom layout. */
const GUILDS_AND_PROFESSIONS: { guild: string; professions: string[] }[] = [
  { guild: "Academy of Science", professions: ["Hunter", "Farmer", "Crafter", "Search & Rescue", "Researcher", "Explorer"] },
  { guild: "United Resource Workers", professions: ["Repair Technician", "Breakdown Engineer", "Fuel Gatherer", "Salvager", "Miner", "Builder", "Refiner", "Crafter"] },
  { guild: "Mercenary Guild", professions: ["Soldier (FPS)", "Bounty Hunter", "Combat Pilot", "Operative (FPS)"] },
  { guild: "Interstellar Transport Guild", professions: ["Trader", "Transporter", "Recovery Expert", "Hauler", "Courier"] },
  { guild: "Imperial Sports Federation", professions: ["Industrial Athlete", "Parkour Athlete", "Racing Driver", "Racing Pilot", "Marksman"] },
  { guild: "The Council", professions: ["Operative", "Pirate / Shipjacker", "Crafter (Illegal)", "Violent Criminal (Ship)", "Smuggler", "Violent Criminal (FPS)", "Organised Criminal", "Racing"] },
];

function LessonContent({
  lesson,
  step,
  totalSteps,
  categoryTitle,
  categoryIcon,
  isCompleted,
  onToggleComplete,
  showCompleteButton = true,
}: LessonContentProps) {
  const [videoRevealed, setVideoRevealed] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [hoveredHudId, setHoveredHudId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  useEffect(() => {
    setThumbError(false);
    setVideoRevealed(false);
  }, [lesson.id]);
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);
  const openLightbox = (src: string, alt: string) => {
    const fullSrc = src.startsWith("http") ? src : (base === "/" ? src : base.replace(/\/$/, "") + src);
    setLightbox({ src: fullSrc, alt });
  };
  const embedUrl = lesson.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : null;
  const rawThumb = lesson.imageUrl ?? (lesson.videoUrl ? getYouTubeThumbnailUrl(lesson.videoUrl) : null);
  const thumbUrl = rawThumb ? (base === "/" ? rawThumb : base.replace(/\/$/, "") + rawThumb) : null;
  const showThumb = thumbUrl && !thumbError;
  const isProfessionsIntro = lesson.id === "prof-0";
  const isFirstNextWithPathCards = lesson.id === "first-next" && lesson.resources?.some((r) => r.icon);
  const checkpointIdx = lesson.text?.indexOf("Checkpoint:");
  const checkpointText = checkpointIdx != null && checkpointIdx >= 0 ? lesson.text!.slice(checkpointIdx).trim() : null;

  return (
    <>
    <div className="h-full flex flex-col min-w-0">
      <div className="mb-4 min-w-0">
        <div className="min-w-0">
          <p className="text-un-muted text-sm truncate sm:whitespace-normal">
            Step {step} of {totalSteps} · {categoryTitle}
          </p>
          <h2 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-un-text mt-0.5 break-words">
            {lesson.title}
          </h2>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto">
        {/* Custom layout for professions intro */}
        {isProfessionsIntro ? (
          <>
            {showThumb && (
              <button
                type="button"
                onClick={() => openLightbox(thumbUrl!, "Star Citizen 1.0 — six guilds and professions (CitizenCon 2954)")}
                className="w-full rounded-xl overflow-hidden border border-un-card-border bg-un-darker mb-6 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-un-accent"
                title="Click to view larger"
              >
                <img
                  src={thumbUrl!}
                  alt="Star Citizen 1.0 — six guilds and professions (CitizenCon 2954)"
                  className="w-full h-auto object-contain"
                  onError={() => setThumbError(true)}
                />
              </button>
            )}
            <p className="text-un-muted text-sm leading-relaxed">
              Star Citizen 1.0 organises work into six guilds. Each guild has a set of jobs — the roles and missions you can take.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GUILDS_AND_PROFESSIONS.map(({ guild, professions }) => (
                <div
                  key={guild}
                  className="rounded-xl border border-un-card-border bg-un-card/50 p-4 hover:border-un-accent/30 transition-colors"
                >
                  <h3 className="font-display font-bold text-un-text text-sm mb-2">{guild}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {professions.map((p) => (
                      <li
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-un-card-border/60 text-un-muted text-xs"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-un-muted text-sm leading-relaxed">
              Not every job has full gameplay or missions yet. This section lists each profession under its guild, with detailed lessons on mining, refining, and trading. For the rest, check contracts in-game and community guides.
            </p>
            <div
              role="status"
              className="rounded-xl border-2 border-un-accent/40 bg-un-accent/10 px-4 py-3 text-sm leading-relaxed text-un-text shadow-[0_0_20px_rgba(16,185,129,0.08)]"
            >
              <p className="font-semibold text-un-accent mb-1">Checkpoint</p>
              <p className="text-un-text-secondary">
                You know the six guilds and the jobs they offer, and that this section covers each profession.
              </p>
            </div>
          </>
        ) : (
          <>
        {/* Video / thumbnail area */}
        {embedUrl && !videoRevealed && (
          <div className="w-full md:max-w-[75%] mx-auto relative rounded-xl overflow-hidden border border-un-card-border aspect-video bg-un-darker flex items-center justify-center group">
            {showThumb && (
              <>
                <img
                  src={thumbUrl!}
                  alt={`Lesson thumbnail: ${lesson.title}`}
                  className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                  onError={() => setThumbError(true)}
                  onClick={() => openLightbox(thumbUrl!, lesson.title)}
                  title="Click to view larger"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openLightbox(thumbUrl!, lesson.title); }}
                  className="absolute top-2 right-2 z-20 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium hover:bg-black/80 cursor-zoom-in"
                  aria-label="View image larger"
                >
                  View larger
                </button>
              </>
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setVideoRevealed(true); }}
              className="absolute inset-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-un-accent cursor-pointer z-10 pointer-events-none"
              aria-label="Play video"
              tabIndex={-1}
            >
              <span className="pointer-events-auto w-14 h-14 rounded-full bg-un-accent/90 flex items-center justify-center shadow-lg group-hover:bg-un-accent transition-colors">
                <Play className="w-7 h-7 text-un-darker ml-0.5" fill="currentColor" />
              </span>
            </button>
          </div>
        )}
        {embedUrl && videoRevealed && (
          <div className="w-full md:max-w-[75%] mx-auto relative rounded-xl overflow-hidden border border-un-card-border aspect-video bg-un-darker">
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}
        {!embedUrl && showThumb && (
          <button
            type="button"
            onClick={() => openLightbox(thumbUrl!, lesson.title)}
            className={`mx-auto rounded-xl overflow-hidden border border-un-card-border bg-un-darker block cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-un-accent ${["flying-11", "flying-ac"].includes(lesson.id) ? "max-w-[900px] w-full" : "w-full md:max-w-[75%] aspect-video"}`}
            title="Click to view larger"
          >
            <img src={thumbUrl!} alt={`Lesson image: ${lesson.title}`} className={["flying-11", "flying-ac"].includes(lesson.id) ? "w-full h-auto" : "w-full h-full object-cover"} onError={() => setThumbError(true)} />
          </button>
        )}
        {!embedUrl && lesson.videoUrl && (
          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-un-accent hover:text-un-accent-light text-sm font-medium cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Watch video
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {lesson.text && (() => {
          const idx = lesson.text.indexOf("Checkpoint:");
          const hasCheckpoint = idx >= 0;
          const main = hasCheckpoint ? lesson.text.slice(0, idx).trim() : lesson.text;
          const checkpoint = hasCheckpoint ? lesson.text.slice(idx).trim() : null;
          const tableBlock = /\[TABLE\]\n([\s\S]*?)\n\[END_TABLE\]/;
          const checklistBlock = /\[CHECKLIST\]\n([\s\S]*?)\n\[END_CHECKLIST\]/;
          const hudKeyItemsBlock = /\[HUD_KEY_ITEMS\]\n([\s\S]*?)\n\[END_HUD_KEY_ITEMS\]/;
          const componentTypesBlock = /\[COMPONENT_TYPES\]/;
          const gradeScaleBlock = /\[GRADE_SCALE\]/;
          const weaponTypesBlock = /\[WEAPON_TYPES\]/;
          const shipSizesBlock = /\[SHIP_SIZES\]/;
          const imageBlock = /\[IMAGE:([^\]]+)\]/g;
          type Segment = { type: "text"; content: string } | { type: "image"; src: string; alt: string } | { type: "table"; headers: string[]; rows: string[][] } | { type: "checklist"; items: string[] } | { type: "hudKeyItems"; items: { id: number; text: string }[] } | { type: "componentTypes" } | { type: "gradeScale" } | { type: "weaponTypes" } | { type: "shipSizes" };
          const parseBlocks = (text: string): Segment[] => {
            const tableMatch = text.match(tableBlock);
            const checklistMatch = text.match(checklistBlock);
            const hudMatch = text.match(hudKeyItemsBlock);
            const componentTypesMatch = text.match(componentTypesBlock);
            const gradeScaleMatch = text.match(gradeScaleBlock);
            const weaponTypesMatch = text.match(weaponTypesBlock);
            const shipSizesMatch = text.match(shipSizesBlock);
            const firstBlock = [
              tableMatch && { i: tableMatch.index!, len: tableMatch[0].length, type: "table" as const, match: tableMatch },
              checklistMatch && { i: checklistMatch.index!, len: checklistMatch[0].length, type: "checklist" as const, match: checklistMatch },
              hudMatch && { i: hudMatch.index!, len: hudMatch[0].length, type: "hudKeyItems" as const, match: hudMatch },
              componentTypesMatch && { i: componentTypesMatch.index!, len: componentTypesMatch[0].length, type: "componentTypes" as const, match: componentTypesMatch },
              gradeScaleMatch && { i: gradeScaleMatch.index!, len: gradeScaleMatch[0].length, type: "gradeScale" as const, match: gradeScaleMatch },
              weaponTypesMatch && { i: weaponTypesMatch.index!, len: weaponTypesMatch[0].length, type: "weaponTypes" as const, match: weaponTypesMatch },
              shipSizesMatch && { i: shipSizesMatch.index!, len: shipSizesMatch[0].length, type: "shipSizes" as const, match: shipSizesMatch },
            ].filter(Boolean).sort((a, b) => a!.i - b!.i)[0];
            if (!firstBlock) return [{ type: "text", content: text }];
            const { i, len, type, match } = firstBlock!;
            const before = text.slice(0, i).trim();
            const after = text.slice(i + len).trim();
            const segments: Segment[] = [];
            if (before) segments.push(...parseBlocks(before));
            if (type === "table") {
              const tableLines = match![1].trim().split("\n").filter(Boolean);
              const headers = tableLines[0]?.split("|").map((c) => c.trim()) ?? [];
              const rows = tableLines.slice(1).map((line) => line.split("|").map((c) => c.trim()));
              segments.push({ type: "table", headers, rows });
            } else if (type === "hudKeyItems") {
              const lines = match![1].trim().split("\n").filter(Boolean);
              const items = lines.map((line) => {
                const pipeIdx = line.indexOf("|");
                const id = pipeIdx >= 0 ? parseInt(line.slice(0, pipeIdx).trim(), 10) : 0;
                const text = pipeIdx >= 0 ? line.slice(pipeIdx + 1).trim() : line;
                return { id, text };
              }).filter((item) => item.id > 0);
              segments.push({ type: "hudKeyItems", items });
            } else if (type === "componentTypes") {
              segments.push({ type: "componentTypes" });
            } else if (type === "gradeScale") {
              segments.push({ type: "gradeScale" });
            } else if (type === "weaponTypes") {
              segments.push({ type: "weaponTypes" });
            } else if (type === "shipSizes") {
              segments.push({ type: "shipSizes" });
            } else {
              const items = match![1].trim().split("\n").map((line) => line.replace(/^[☐\s]+/, "").trim()).filter(Boolean);
              segments.push({ type: "checklist", items });
            }
            if (after) segments.push(...parseBlocks(after));
            return segments;
          };
          const sectionBlock = /\[SECTION\]([^\[]+)\[\/SECTION\]/g;
          const parseTextWithImages = (text: string): ({ type: "text"; content: string } | { type: "section"; content: string } | { type: "image"; src: string; alt: string; maxWidth?: string })[] => {
            const processText = (t: string) => {
              const out: { type: "text"; content: string } | { type: "section"; content: string }[] = [];
              let lastIdx = 0;
              let m;
              sectionBlock.lastIndex = 0;
              while ((m = sectionBlock.exec(t)) !== null) {
                if (m.index > lastIdx) {
                  const before = t.slice(lastIdx, m.index).trim();
                  if (before) out.push({ type: "text", content: before });
                }
                out.push({ type: "section", content: m[1].trim() });
                lastIdx = m.index + m[0].length;
              }
              if (lastIdx < t.length) {
                const after = t.slice(lastIdx).trim();
                if (after) out.push({ type: "text", content: after });
              }
              return out;
            };
            const result: ({ type: "text"; content: string } | { type: "section"; content: string } | { type: "image"; src: string; alt: string; maxWidth?: string })[] = [];
            let lastIndex = 0;
            let match;
            imageBlock.lastIndex = 0;
            while ((match = imageBlock.exec(text)) !== null) {
              if (match.index > lastIndex) {
                const before = text.slice(lastIndex, match.index).trim();
                if (before) result.push(...processText(before));
              }
              const imageContent = match[1];
              const parts = imageContent.split("|").map((s) => s.trim());
              const [src, alt = "", maxWidth] = parts;
              result.push({ type: "image", src, alt, maxWidth: maxWidth || undefined });
              lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
              const after = text.slice(lastIndex).trim();
              if (after) result.push(...processText(after));
            }
            if (result.length === 0 && text.trim()) {
              result.push(...processText(text));
            }
            return result;
          };
          const rawSegments = main ? parseBlocks(main) : [];
          const segments: Segment[] = [];
          for (const seg of rawSegments) {
            if (seg.type === "text") {
              segments.push(...parseTextWithImages(seg.content));
            } else {
              segments.push(seg);
            }
          }
          return (
            <>
              {segments.length > 0 && (
                <div className="text-[#c4c8d0] text-base leading-loose space-y-5 w-full min-w-0 break-words">
                  {segments.map((seg, i) =>
                    seg.type === "text" ? (
                      <div key={i} className="whitespace-pre-line">
                        {seg.content}
                      </div>
                    ) : seg.type === "section" ? (
                      <h3 key={i} className="font-semibold text-un-accent text-sm uppercase tracking-wider mt-6 mb-2 first:mt-0">
                        {seg.content}
                      </h3>
                    ) : seg.type === "image" ? (
                      seg.src.includes("arena-commander-path") ? (
                        <div key={i} className="w-full">
                          <ArenaCommanderPath />
                        </div>
                      ) :                       seg.src.includes("hud-key-elements") ? (
                        <div key={i} className="w-full">
                          <HudKeyElementsImage src={seg.src} base={base} onHover={setHoveredHudId} onImageClick={openLightbox} />
                        </div>
                      ) : (
                        <button
                          key={i}
                          type="button"
                          onClick={() => openLightbox(seg.src, seg.alt)}
                          className={`rounded-xl overflow-hidden border border-un-card-border bg-un-darker block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-un-accent ${seg.maxWidth ? "mx-auto" : ""}`}
                          style={seg.maxWidth ? { maxWidth: seg.maxWidth } : undefined}
                          title="Click to view larger"
                        >
                          <img src={base === "/" ? seg.src : base.replace(/\/$/, "") + seg.src} alt={seg.alt} className="w-full h-auto object-contain" />
                        </button>
                      )
                    ) : seg.type === "hudKeyItems" ? (
                      <div key={i} className="space-y-3 px-1">
                        {seg.items.map((item) => (
                          <div
                            key={item.id}
                            id={`hud-${item.id}`}
                            className={`scroll-mt-24 rounded-lg px-3 py-2 transition-colors ${
                              hoveredHudId === item.id ? "bg-un-accent/15 ring-1 ring-un-accent/50 ring-inset" : ""
                            }`}
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-un-accent/20 text-un-accent text-sm font-bold mr-2 align-middle">
                              {item.id}
                            </span>
                            <span className="align-middle">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : seg.type === "componentTypes" ? (
                      <div key={i} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                          { label: "Military", icon: Swords, color: "text-red-400", bg: "bg-red-500/10" },
                          { label: "Stealth", icon: EyeOff, color: "text-violet-400", bg: "bg-violet-500/10" },
                          { label: "Industrial", icon: Factory, color: "text-amber-400", bg: "bg-amber-500/10" },
                          { label: "Civilian", icon: Users, color: "text-sky-400", bg: "bg-sky-500/10" },
                          { label: "Competition", icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        ].map(({ label, icon: Icon, color, bg }) => (
                          <div
                            key={label}
                            className="rounded-xl border border-un-card-border bg-un-card/60 hover:border-un-accent/40 hover:bg-un-card/80 p-4 flex flex-col items-center gap-2 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} ${bg}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-un-text text-sm">{label}</span>
                          </div>
                        ))}
                      </div>
                    ) : seg.type === "gradeScale" ? (
                      <div key={i} className="rounded-xl border border-un-card-border bg-un-card/40 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-un-muted text-xs shrink-0">Best</span>
                          <div className="flex-1 flex items-center gap-0.5 h-8 rounded-lg overflow-hidden bg-un-darker border border-un-card-border">
                            {(["A", "B", "C", "D"] as const).map((grade) => (
                              <div
                                key={grade}
                                className={`flex-1 h-full flex items-center justify-center text-sm font-semibold ${
                                  grade === "A" ? "bg-emerald-500/20 text-emerald-400" : grade === "B" ? "bg-emerald-500/10 text-emerald-300/90" : grade === "C" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {grade}
                              </div>
                            ))}
                          </div>
                          <span className="text-un-muted text-xs shrink-0">Worst</span>
                        </div>
                      </div>
                    ) : seg.type === "shipSizes" ? (
                      <div key={i} className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <div
                            key={n}
                            className="rounded-xl border border-un-card-border bg-un-card/60 hover:border-un-accent/40 p-3 flex flex-col items-center gap-1 transition-colors"
                          >
                            <span className="text-un-muted text-xs">Size</span>
                            <span className="font-semibold text-un-text text-lg tabular-nums">{n}</span>
                          </div>
                        ))}
                      </div>
                    ) : seg.type === "weaponTypes" ? (
                      <div key={i} className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Laser", icon: Zap, color: "text-red-400", bg: "bg-red-500/10" },
                          { label: "Distortion", icon: Radio, color: "text-blue-400", bg: "bg-blue-500/10" },
                          { label: "Ballistic", icon: Crosshair, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                        ].map(({ label, icon: Icon, color, bg }) => (
                          <div
                            key={label}
                            className="rounded-xl border border-un-card-border bg-un-card/60 hover:border-un-accent/40 hover:bg-un-card/80 p-4 flex flex-col items-center gap-2 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} ${bg}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-un-text text-sm">{label}</span>
                          </div>
                        ))}
                      </div>
                    ) : seg.type === "checklist" ? (
                      <ChecklistBlock key={i} id={`${lesson.id}-checklist-${i}`} items={seg.items} />
                    ) : (
                      <div key={i} className="overflow-x-auto rounded-lg border border-un-card-border -mx-1 sm:mx-0">
                        <table className="w-full min-w-[280px] text-left text-sm">
                          <thead>
                            <tr className="border-b border-un-card-border bg-un-card-border/30">
                              {seg.headers.map((h, j) => (
                                <th key={j} className={`px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-un-text-secondary align-middle text-xs sm:text-sm ${h === "Image" ? "text-center" : ""}`}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {seg.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-un-card-border/70 last:border-0">
                                {row.map((cell, j) => {
                                  const header = seg.headers[j];
                                  const isGuide = header === "Guide";
                                  const isImage = (cell.startsWith("/") || cell.startsWith("http")) && !isGuide;
                                  const isGuideUrl = isGuide && cell && (cell.startsWith("http") || cell.startsWith("https"));
                                  return (
                                    <td key={j} className={`px-2 sm:px-3 py-1.5 sm:py-2 text-un-muted align-middle text-xs sm:text-sm ${header === "Image" ? "text-center" : ""}`}>
                                      {isGuideUrl ? (
                                        <a href={cell} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-un-accent/20 text-un-accent hover:bg-un-accent/30 transition-colors" aria-label={`Watch ${row[0] ?? "location"} guide`}>
                                          <Play className="w-4 h-4" fill="currentColor" />
                                        </a>
                                      ) : isImage ? (
                                        <button
                                          type="button"
                                          onClick={() => openLightbox(cell, row[0] ?? "")}
                                          className="rounded-lg overflow-hidden w-24 h-14 sm:w-32 sm:h-20 mx-auto block cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-un-accent"
                                          aria-label="View image larger"
                                          title="Click to view larger"
                                        >
                                          <img src={cell} alt={row[0] ?? ""} className="rounded-lg object-contain w-full h-full" />
                                        </button>
                                      ) : (
                                        cell || "—"
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              )}
              {checkpoint && !isFirstNextWithPathCards && (
                <div
                  role="status"
                  className="rounded-xl border-2 border-un-accent/40 bg-un-accent/10 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base leading-relaxed text-[#c4c8d0] shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                >
                  <p className="font-semibold text-un-accent mb-1.5">Checkpoint</p>
                  <p className="whitespace-pre-line">{checkpoint.replace(/^Checkpoint:\s*/, "")}</p>
                </div>
              )}
            </>
          );
        })()}
          </>
        )}
        {lesson.resources && lesson.resources.length > 0 && (
          <div
            className={
              lesson.resources.some((r) => r.icon)
                ? "grid grid-cols-1 sm:grid-cols-3 gap-5"
                : "flex flex-wrap gap-2"
            }
          >
            {lesson.resources.map((r) =>
              r.icon ? (
                <Link
                  key={r.url}
                  to={r.url}
                  onClick={() => onToggleComplete(lesson.id)}
                  className="group flex flex-col items-center text-center p-8 rounded-xl border-2 border-un-card-border bg-un-card/80 hover:bg-un-accent/10 hover:border-un-accent/40 transition-all cursor-pointer relative shadow-sm hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]"
                >
                  <div className="w-16 h-16 rounded-xl bg-un-accent/15 group-hover:bg-un-accent/25 flex items-center justify-center mb-4 transition-colors">
                    <BadgeIcon icon={r.icon} className="w-8 h-8 text-un-accent" />
                  </div>
                  <p className="font-display font-bold text-lg text-un-text group-hover:text-un-accent transition-colors">
                    {r.label}
                  </p>
                  {r.description && (
                    <p className="text-un-muted text-sm mt-2 leading-relaxed">{r.description}</p>
                  )}
                  <ChevronRight className="absolute top-5 right-5 w-5 h-5 text-un-muted group-hover:text-un-accent opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <a
                  key={r.url}
                  href={r.url}
                  {...(r.url.startsWith("http") || r.url.startsWith("https")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 bg-un-card-border/50 hover:bg-un-accent/10 text-un-muted hover:text-un-accent border border-un-card-border hover:border-un-accent/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {r.label}
                  {(r.url.startsWith("http") || r.url.startsWith("https")) && (
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  )}
                </a>
              )
            )}
          </div>
        )}
        {isFirstNextWithPathCards && checkpointText && (
          <div
            role="status"
            className="rounded-xl border-2 border-un-accent/40 bg-un-accent/10 px-5 py-4 text-base leading-relaxed text-[#c4c8d0] shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          >
            <p className="font-semibold text-un-accent mb-1.5">Checkpoint</p>
            <p className="whitespace-pre-line">{checkpointText.replace(/^Checkpoint:\s*/, "")}</p>
          </div>
        )}
      </div>
      {showCompleteButton && (
        <div className="shrink-0 pt-4 mt-4 border-t border-un-card-border">
          <button
            type="button"
            onClick={() => onToggleComplete(lesson.id)}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors cursor-pointer ${
              isCompleted
                ? "bg-un-success/20 border-un-success text-un-success"
                : "bg-un-success/20 border-un-success text-un-success hover:bg-un-success/30 hover:border-un-success-light"
            }`}
          >
            {isCompleted ? <Check className="w-4 h-4" /> : null}
            {isCompleted ? "Complete" : "Mark complete"}
          </button>
        </div>
      )}
    </div>
    {lightbox &&
      createPortal(
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-3 sm:p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image enlarged — click outside to close"
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-[95vw] sm:max-w-[90vw] max-h-[80vh] sm:max-h-[85vh] w-auto h-auto object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
            loading="eager"
            decoding="async"
          />
          <p className="text-white/70 text-sm mt-2 cursor-zoom-out">Click outside to close</p>
        </div>,
        document.body
      )}
  </>
  );
}

const VALID_PATH_IDS = ["getting-started", "flying", "fps", "professions", "dogfighting"];

const PATH_ICONS: Record<string, React.ReactNode> = {
  "getting-started": <Home className="w-5 h-5" />,
  flying: <Rocket className="w-5 h-5" />,
  dogfighting: <Swords className="w-5 h-5" />,
  fps: <Crosshair className="w-5 h-5" />,
  professions: <Briefcase className="w-5 h-5" />,
};

export default function BasicTraining() {
  const [searchParams] = useSearchParams();
  const pathParam = searchParams.get("path");
  const saved = loadProgress();
  const [viewMode, setViewMode] = useState<"learn" | "profile">("learn");
  const [selectedPathId, setSelectedPathId] = useState<string | null>(() => {
    if (pathParam && VALID_PATH_IDS.includes(pathParam)) return pathParam;
    if (saved.selectedPathId && VALID_PATH_IDS.includes(saved.selectedPathId)) return saved.selectedPathId;
    return null;
  });

  useEffect(() => {
    if (pathParam && VALID_PATH_IDS.includes(pathParam)) {
      setSelectedPathId(pathParam);
    }
  }, [pathParam]);

  const pathOrder = selectedPathId ? getPathLessonOrder(selectedPathId) : [];
  const ordered = selectedPathId ? getLessonsInOrder(selectedPathId) : [];
  const pathLessonCount = pathOrder.length;

  const [completedIds, setCompletedIds] = useState<string[]>(() => saved.completedIds);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    () => saved.selectedLessonId ?? ordered[0]?.lesson.id ?? null
  );
  const [badgeJustEarned, setBadgeJustEarned] = useState<Badge | null>(null);
  const earnedBadges = getEarnedBadges(completedIds);
  const pathCompletedCount = pathOrder.filter((id) => completedIds.includes(id)).length;

  useEffect(() => {
    saveProgress({
      completedIds,
      selectedPathId: selectedPathId ?? undefined,
      selectedLessonId: selectedLessonId ?? undefined,
    });
  }, [completedIds, selectedPathId, selectedLessonId]);

  useEffect(() => {
    if (!selectedPathId) return;
    if (!pathOrder.includes(selectedLessonId ?? "")) {
      setSelectedLessonId(ordered[0]?.lesson.id ?? null);
    }
  }, [selectedPathId, pathOrder, ordered, selectedLessonId]);

  const toggleComplete = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const isCompleting = !prev.includes(id);
      const next = isCompleting ? [...prev, id] : prev.filter((x) => x !== id);
      const prevEarned = getEarnedBadges(prev);
      const nextEarned = getEarnedBadges(next);
      if (nextEarned.length > prevEarned.length) {
        const newBadge = nextEarned.find((b) => !prevEarned.some((p) => p.id === b.id));
        if (newBadge) {
          setBadgeJustEarned(newBadge);
        }
      }
      return next;
    });
    // When marking complete, advance to the next lesson in the series
    const wasCompleted = completedIds.includes(id);
    if (!wasCompleted) {
      const idx = ordered.findIndex((o) => o.lesson.id === id);
      if (idx >= 0 && idx < ordered.length - 1) {
        setSelectedLessonId(ordered[idx + 1].lesson.id);
      }
    }
  }, [ordered, completedIds]);

  const selectedItem = ordered.find((x) => x.lesson.id === selectedLessonId);

  return (
    <section id="basic-training" className="py-12 sm:py-24 relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* ========== SECTION 1: NAVIGATION ========== */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-un-text">
              Basic <span className="gradient-text">Training</span>
            </h2>
            <p className="text-un-muted text-sm mt-1">
              Short lessons so you survive, fly, and play with confidence — at your own pace.
            </p>
          </div>

          {/* Path tabs: horizontal scroll on mobile so all tabs are reachable without wrapping */}
          <div className="w-full lg:w-auto -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-2 min-w-max lg:min-w-0 lg:flex-wrap">
              {LEARNING_PATHS.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => {
                    setSelectedPathId(path.id);
                    setViewMode("learn");
                  }}
                  className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer shrink-0 min-w-0 touch-manipulation ${
                    viewMode === "learn" && selectedPathId === path.id
                      ? "bg-un-accent/20 text-un-accent border-un-accent/40"
                      : "bg-un-card border-un-card-border text-un-muted hover:text-un-text"
                  }`}
                >
                  <span className="shrink-0">{PATH_ICONS[path.id] ?? <Rocket className="w-4 h-4" />}</span>
                  <span className="flex items-center gap-1.5 min-w-0 flex-wrap justify-center">
                    {path.name}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setViewMode("profile")}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer shrink-0 touch-manipulation ${
                  viewMode === "profile"
                    ? "bg-un-accent/20 text-un-accent border-un-accent/40"
                    : "bg-un-card border-un-card-border text-un-muted hover:text-un-text"
                }`}
              >
                <span className="shrink-0"><User className="w-5 h-5" /></span>
                Profile
              </button>
            </div>
          </div>
        </div>

        {/* ========== SECTION 2: PROGRESS (only when a path is selected) ========== */}
        {selectedPathId != null && (
        <div className="bg-un-card border border-un-card-border rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5 text-un-accent shrink-0" />
                <span className="text-sm font-medium text-un-text">
                  {LEARNING_PATHS.find((p) => p.id === selectedPathId)?.name ?? "Progress"}
                </span>
              </div>
              {selectedPathId === "professions" ? (
                <p className="text-un-muted text-sm">
                  FYI — reference only. No completion tracking for professions at this time.
                </p>
              ) : (
                <>
                  <div className="h-2.5 bg-un-card-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-un-accent rounded-full transition-all duration-300"
                      style={{
                        width: `${pathLessonCount ? (pathCompletedCount / pathLessonCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-un-muted text-sm mt-1.5">
                    {pathCompletedCount} of {pathLessonCount} lessons complete
                  </p>
                </>
              )}
            </div>

            {/* Badges count */}
            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-un-card-border pt-4 md:pt-0 md:pl-6">
              <Award className="w-5 h-5 text-un-muted" />
              <span className="text-sm font-medium text-un-text">
                {earnedBadges.length} of {BADGES.length} badges
              </span>
            </div>
          </div>
        </div>
        )}

        {/* Badge earned popup with confetti — dismissing returns to profile */}
        {badgeJustEarned && (
          <BadgeEarnedPopup
            badge={badgeJustEarned}
            onDismiss={() => {
              setBadgeJustEarned(null);
              setViewMode("profile");
            }}
          />
        )}

        {/* ========== MAIN CONTENT: PROFILE VIEW ========== */}
        {viewMode === "profile" && (() => {
          const totalLessons = getTotalLessonCount();
          const totalCompleted = completedIds.length;
          const badgeProgress = getBadgeProgress(completedIds);
          const categoryBadges = badgeProgress.filter((bp) => bp.badge.categoryId !== null);
          const graduateBadge = badgeProgress.find((bp) => bp.badge.categoryId === null);
          return (
            <div className="space-y-8 mb-8">
              {/* Overall stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-un-card border border-un-card-border rounded-xl p-5 text-center">
                  <p className="text-3xl font-mono font-bold text-un-accent">{totalCompleted}</p>
                  <p className="text-un-muted text-sm mt-1">Lessons complete</p>
                </div>
                <div className="bg-un-card border border-un-card-border rounded-xl p-5 text-center">
                  <p className="text-3xl font-mono font-bold text-un-text">{totalLessons}</p>
                  <p className="text-un-muted text-sm mt-1">Total lessons</p>
                </div>
                <div className="bg-un-card border border-un-card-border rounded-xl p-5 text-center">
                  <p className="text-3xl font-mono font-bold text-un-text">{earnedBadges.length}</p>
                  <p className="text-un-muted text-sm mt-1">{earnedBadges.length === 1 ? "Badge earned" : "Badges earned"}</p>
                </div>
              </div>

              {/* Category badges */}
              <div>
                <h3 className="font-display font-bold text-lg text-un-text mb-4">Your progress</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryBadges.map((bp) => {
                    const pct = bp.total ? Math.round((bp.completed / bp.total) * 100) : 0;
                    const pathId =
                      bp.badge.pathId ??
                      LEARNING_PATHS.find((p) =>
                        p.lessonIds.some((lid) =>
                          BASIC_TRAINING_CATEGORIES.find((c) => c.id === bp.badge.categoryId)?.lessons.some((l) => l.id === lid)
                        )
                      )?.id;

                    return (
                      <button
                        key={bp.badge.id}
                        type="button"
                        onClick={() => {
                          if (pathId) {
                            setSelectedPathId(pathId);
                            setViewMode("learn");
                          }
                        }}
                        className={`text-left rounded-xl border p-5 transition-all hover:scale-[1.01] cursor-pointer ${
                          bp.earned
                            ? "bg-un-accent/10 border-un-accent/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            : "bg-un-card border-un-card-border hover:border-un-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                              bp.earned
                                ? "bg-un-accent/20"
                                : "bg-un-card-border"
                            }`}
                          >
                            <BadgeIcon
                              icon={bp.badge.icon}
                              className={`w-7 h-7 ${bp.earned ? "text-un-accent" : "text-un-muted"}`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-display font-bold text-un-text">{bp.badge.name}</p>
                              {bp.earned && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-un-accent/20 text-un-accent text-xs font-semibold">
                                  <Star className="w-3 h-3" fill="currentColor" /> Earned
                                </span>
                              )}
                            </div>
                            {bp.earned ? (
                              <p className="text-un-muted text-sm mt-1">{bp.badge.flavour}</p>
                            ) : (
                              <p className="text-un-muted text-sm mt-1">
                                {bp.remaining === 1
                                  ? "1 lesson to go"
                                  : `${bp.remaining} lessons to go`}
                              </p>
                            )}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-mono text-un-muted">
                                  {bp.completed}/{bp.total}
                                </span>
                                <span className="text-xs font-mono text-un-muted">{pct}%</span>
                              </div>
                              <div className="h-2 bg-un-card-border rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    bp.earned ? "bg-un-accent" : "bg-un-accent/60"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Graduate badge — special treatment */}
              {graduateBadge && (
                <div className="flex justify-center">
                  <div
                    className={`max-w-lg w-full rounded-2xl border-2 p-8 text-center transition-all ${
                      graduateBadge.earned
                        ? "bg-un-accent/10 border-un-accent/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                        : "bg-un-card border-un-card-border"
                    }`}
                  >
                    <div
                      className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                        graduateBadge.earned
                          ? "bg-un-accent/20"
                          : "bg-un-card-border"
                      }`}
                    >
                      {graduateBadge.earned ? (
                        <GraduationCap className="w-10 h-10 text-un-accent" />
                      ) : (
                        <Lock className="w-8 h-8 text-un-muted" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl text-un-text">
                      {graduateBadge.badge.name}
                    </h3>
                    {graduateBadge.earned ? (
                      <p className="text-un-muted text-sm mt-2 max-w-sm mx-auto">
                        {graduateBadge.badge.flavour}
                      </p>
                    ) : (
                      <>
                        <p className="text-un-muted text-sm mt-2">
                          Complete all {graduateBadge.total} lessons to earn this.
                        </p>
                        <p className="text-un-muted/70 text-xs mt-1">
                          {graduateBadge.remaining} remaining
                        </p>
                        <div className="mt-4 max-w-xs mx-auto">
                          <div className="h-2 bg-un-card-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-un-accent/50 rounded-full transition-all duration-500"
                              style={{
                                width: `${graduateBadge.total ? Math.round((graduateBadge.completed / graduateBadge.total) * 100) : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========== MAIN CONTENT: LEARN VIEW ========== */}
        {viewMode === "learn" && selectedPathId === null && (
          <div className="min-h-[420px]">
            <p className="text-un-muted text-sm mb-6">
              Choose a path below. You can switch anytime.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEARNING_PATHS.map((path) => {
                const isPathComplete = path.lessonIds.every((id) => completedIds.includes(id));
                return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setSelectedPathId(path.id)}
                  className={`flex flex-col items-center text-center rounded-xl border p-5 transition-all cursor-pointer group ${
                    isPathComplete
                      ? "border-un-accent/50 bg-un-accent/10 hover:border-un-accent/70 hover:bg-un-accent/15"
                      : "border-un-card-border bg-un-card/80 hover:border-un-accent/40 hover:bg-un-card"
                  }`}
                >
                  <span className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isPathComplete ? "bg-un-accent/20 text-un-accent" : "bg-un-card-border text-un-muted group-hover:text-un-accent"
                  }`}>
                    {PATH_ICONS[path.id] ?? <Rocket className="w-6 h-6" />}
                  </span>
                  <h3 className="font-display font-bold text-un-text">{path.name}</h3>
                  <p className="text-un-muted text-sm mt-1 line-clamp-2">{path.description}</p>
                  <span className="inline-flex items-center gap-1 text-un-accent text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "learn" && selectedPathId != null && (
          LEARNING_PATHS.find((p) => p.id === selectedPathId)?.comingSoon ? (
            <div className="bg-un-card border border-un-card-border rounded-xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-2xl font-display font-bold text-un-text">Coming soon</p>
              <p className="text-un-muted mt-2 max-w-md">
                {LEARNING_PATHS.find((p) => p.id === selectedPathId)?.name} content is in the works. For now, focus on Getting started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 min-h-[480px]">
            <aside className="lg:w-80 shrink-0 order-2 lg:order-1">
              <nav
                className="bg-un-card border border-un-card-border rounded-xl overflow-hidden"
                aria-label="Lesson list"
              >
                <ul className="divide-y divide-un-card-border">
                  {(() => {
                    const path = LEARNING_PATHS.find((p) => p.id === selectedPathId);
                    const orderedById = new Map(ordered.map((o) => [o.lesson.id, o]));
                    const rows: React.ReactNode[] = [];

                    if (path?.sections) {
                      path.sections.forEach((section) => {
                        rows.push(
                          <li
                            key={`sec-${section.id}`}
                            className="px-4 py-2 bg-un-card-border/30 border-b border-un-card-border"
                          >
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 text-un-muted">
                                {CATEGORY_ICONS[path.id === "professions" ? "Briefcase" : path.id] ?? (
                                  <Briefcase className="w-4 h-4" />
                                )}
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wide text-un-muted">
                                {section.name}
                              </span>
                            </div>
                          </li>
                        );
                        section.lessonIds.forEach((lessonId) => {
                          const item = orderedById.get(lessonId);
                          if (!item) return;
                          const isSelected = selectedLessonId === item.lesson.id;
                          const done = selectedPathId !== "professions" && completedIds.includes(item.lesson.id);
                          rows.push(
                            <li key={item.lesson.id}>
                              <button
                                type="button"
                                onClick={() => setSelectedLessonId(item.lesson.id)}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors hover:bg-un-card-border/50 cursor-pointer ${
                                  isSelected
                                    ? "bg-un-accent/10 border-l-4 border-un-accent"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-semibold border ${
                                    done
                                      ? "bg-un-success/20 border-un-success text-un-success"
                                      : isSelected
                                        ? "bg-un-accent/10 border-un-accent/40 text-un-accent"
                                        : "bg-un-card-border border-un-card-border text-un-muted"
                                  }`}
                                >
                                  {done ? <Check className="w-3.5 h-3.5" /> : item.step}
                                </span>
                                <span className={`min-w-0 flex-1 truncate text-sm font-medium ${
                                  done ? "text-un-muted" : "text-un-text"
                                }`}>
                                  {item.lesson.title}
                                </span>
                              </button>
                            </li>
                          );
                        });
                      });
                    } else {
                      let lastCategory = "";
                      ordered.forEach((item) => {
                        if (item.categoryTitle !== lastCategory) {
                          lastCategory = item.categoryTitle;
                          rows.push(
                            <li
                              key={`cat-${item.categoryTitle}`}
                              className="px-4 py-2 bg-un-card-border/30 border-b border-un-card-border"
                            >
                              <div className="flex items-center gap-2">
                                <span className="shrink-0 text-un-muted">
                                  {CATEGORY_ICONS[item.categoryIcon] ?? (
                                    <Rocket className="w-4 h-4" />
                                  )}
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wide text-un-muted">
                                  {item.categoryTitle}
                                </span>
                              </div>
                            </li>
                          );
                        }
                        const isSelected = selectedLessonId === item.lesson.id;
                        const done = selectedPathId !== "professions" && completedIds.includes(item.lesson.id);
                        rows.push(
                          <li key={item.lesson.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedLessonId(item.lesson.id)}
                              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors hover:bg-un-card-border/50 cursor-pointer ${
                                isSelected
                                  ? "bg-un-accent/10 border-l-4 border-un-accent"
                                  : ""
                              }`}
                            >
                              <span
                                className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-semibold border ${
                                  done
                                    ? "bg-un-success/20 border-un-success text-un-success"
                                    : isSelected
                                      ? "bg-un-accent/10 border-un-accent/40 text-un-accent"
                                      : "bg-un-card-border border-un-card-border text-un-muted"
                                }`}
                              >
                                {done ? <Check className="w-3.5 h-3.5" /> : item.step}
                              </span>
                              <span className={`min-w-0 flex-1 truncate text-sm font-medium ${
                                done ? "text-un-muted" : "text-un-text"
                              }`}>
                                {item.lesson.title}
                              </span>
                            </button>
                          </li>
                        );
                      });
                    }
                    return rows;
                  })()}
                </ul>
              </nav>
            </aside>

            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <div className="bg-un-card border border-un-card-border rounded-xl p-4 sm:p-6 h-full min-h-[400px]">
                {selectedItem ? (
                  <LessonContent
                    lesson={selectedItem.lesson}
                    step={selectedItem.step}
                    totalSteps={pathLessonCount}
                    categoryTitle={selectedItem.categoryTitle}
                    categoryIcon={selectedItem.categoryIcon}
                    isCompleted={completedIds.includes(selectedItem.lesson.id)}
                    onToggleComplete={toggleComplete}
                    showCompleteButton={selectedPathId !== "professions"}
                  />
                ) : (
                  <p className="text-un-muted text-sm">
                    Pick a lesson from the list to start — step 1 is a good place.
                  </p>
                )}
              </div>
            </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
