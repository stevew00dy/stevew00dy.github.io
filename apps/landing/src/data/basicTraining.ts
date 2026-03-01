/**
 * Basic Training — dashboard content.
 *
 * Progression (outcome-driven, for new casual players):
 * 1. First steps (12 lessons) — Orientation → Setup → Performance & community → First mission → Bug resilience → Expansion.
 * 2. Flying (9 lessons) — AC setup → HUD → Controls → Decoupled Drills → Settings → Takeoff → SPViewer → Components → Engineering.
 * 3. FPS & PvE (3 lessons) — Weapons, bunkers, tactics.
 * 4. Professions (3 lessons) — Mining, refining, trading.
 *
 * Voice: direct, no jargon without inline definition, no assumptions about prior knowledge.
 * Replace each videoUrl with the real YouTube watch URL when the lesson video is ready.
 *
 * Lesson style template (use for all lessons):
 * - No --- dashes between sections.
 * - Use [SECTION]Title[/SECTION] for section headers (clear, not ALL CAPS).
 * - Use [CHECKLIST]...[/CHECKLIST] for steps.
 * - Checkpoint at end.
 * - Session-only notes at end: "Changes apply to this session only. For permanent defaults: ..."
 */

export interface ResourceLink {
  label: string;
  url: string;
  /** Optional icon name (e.g. Rocket, Crosshair) for card-style display. */
  icon?: string;
  /** Optional short description for card-style display. */
  description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  /** Optional lesson image (e.g. custom thumbnail). Falls back to video thumbnail when not set. */
  imageUrl?: string;
  /** YouTube or other video URL — will be embedded or linked */
  videoUrl?: string;
  /** Written guide (plain text or HTML-safe). Use \n for line breaks. */
  text?: string;
  resources?: ResourceLink[];
}

export interface TrainingCategory {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name, or use in component
  lessons: Lesson[];
}

export const BASIC_TRAINING_CATEGORIES: TrainingCategory[] = [
  {
    id: "first-steps",
    title: "First steps",
    description: "Orientation, setup, and systems — so you know what you're stepping into and can recover.",
    icon: "Home",
    lessons: [
      {
        id: "first-1",
        title: "Welcome Bob",
        imageUrl: "/lesson-thumbnails/first-1.svg",
        text: "\"Bob\" is community slang for a laid-back, generalist player — someone who dabbles in a bit of everything, isn't out to dominate, and doesn't take it too seriously. You might be new or you might have been around a while; either way, if that sounds like you, welcome, \"Bob\".\n\n[SECTION]The games[/SECTION]\n\nCIG (Cloud Imperium Games) are developing two games. Star Citizen is a sandbox MMO and persistent universe where you fly, trade, fight, and explore with others. It's predominantly whatever you make of it — the emphasis is on curating your own adventure, though they're also adding story content. Squadron 42 is the other: a cinematic single-player campaign, not released yet. This training focuses on Star Citizen. To play it you need a Star Citizen game package (next lesson).\n\n[SECTION]Progress and wipes[/SECTION]\n\nStar Citizen is early-access (\"alpha\") — still being built. Learning how things work matters more than accumulating in-game money (called aUEC). Your knowledge and muscle memory persist even when items or currency don't. Major updates can reset your money, items, or reputation (called wipes). Think of progress as seasonal learning — what you know carries forward, what you own might not.\n\n[SECTION]Bugs and instability[/SECTION]\n\nDesync (what you see doesn't match the server), UI glitches, missions that fail to complete, server crashes — all normal for early access. Before you play, check that your PC meets the requirements on the Roberts Space Industries website: you need an SSD and at least 16 GB RAM.\n\nCheckpoint: You know SC is the persistent game (SQ42 is separate), that you need a game package for SC, and that wipes and bugs are part of the deal.",
        resources: [],
      },
      {
        id: "first-2",
        title: "Getting a game package",
        description: "Game package vs ship-only. What packages include, upgrading, and why you don't need to pay to win.",
        videoUrl: "https://youtu.be/BGgyFafah58",
        text: "You need a game package to play — buying a ship alone does not give you access. A game package includes access to the game and a starter ship, and sometimes other perks. Standalone ships are sold for people who already have a package and want an extra ship; they do not include game access and will not let you log in.\n\n[SECTION]Where to get it[/SECTION]\n\nGet your game package from the Roberts Space Industries website (link below). RSI (Roberts Space Industries) is the main site for the game, shop, and community — it's different from CIG, the developer. RSI is also a ship manufacturer in the game. After you have a package, you can upgrade your starter ship later if you want — also through RSI. Third-party sites (the grey market) sell packages and ships too; many are reputable, but buying there does not directly support the game, so it is not recommended.\n\n[SECTION]No pay-to-win[/SECTION]\n\nEvery ship is or will be available in-game to buy, earn, or craft. You can start with the most basic starter package and get everything you want with in-game currency (aUEC), which is straightforward to earn.\n\nCheckpoint: You know you need a game package (not just a ship), where to get one, and that the starter is enough — everything else is obtainable in-game.",
        resources: [
          { label: "RSI — game packages", url: "https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N" },
        ],
      },
      {
        id: "first-3",
        title: "Setting your home location",
        description: "Choose star system and city. Stanton, starting location, and regeneration point.",
        text: "When 1.0 launches there will be five star systems. The original Kickstarter promised over 100, but those were planned as simpler, lifeless worlds — the planets in the game today are far more detailed. Right now three systems are in the game, with two more promised for launch.\n\n[SECTION]Home location[/SECTION]\n\nWhen you start for the first time, after creating your character, you will need to select a home location (primary residence). That is where you will initially spawn and where your ships and items are stored; any ships or items you buy on the website or receive (e.g. Subscriber Flair) are delivered there. Your primary residence is locked until the next patch — you cannot change it in between. You can, however, set a new spawn (regeneration) location at any time so you respawn somewhere else when you die.\n\n[SECTION]Stanton landing zones[/SECTION]\n\nRecommended: Stanton. It is the most established system with the most to do. Most new players pick New Babbage, but consider choosing a location closer to the sun — it is easier to navigate around the system from there.\n\nThe four main Stanton landing zones:\n\n[TABLE]\nLocation|Planet|Notes|Image|Guide\nNew Babbage|microTech|Snowy, tech-focused.|/planets/new-babbage.png|https://youtu.be/QKYbDT0VsAI\nArea18|ArcCorp|City planet, industrial.|/planets/area18.png|https://youtu.be/xRHMvDwpKro\nLorville|Hurston|Industrial hub.|/planets/lorville.png|https://youtu.be/tzmsz0BcdV8\nOrison|Crusader|Gas giant, cloud city.|/planets/orison.png|\n[END_TABLE]\n\nCheckpoint: You have picked Stanton and a starting city as your primary residence.",
        resources: [],
      },
      {
        id: "first-13",
        title: "Completing the tutorial",
        description: "The in-game New Player Experience. Movement, interaction, spaceport, ASOP, first flight.",
        videoUrl: "https://youtu.be/iAf2ksECBK4",
        text: "When you load into the game for the first time, you'll be offered the New Player Experience (NPE) — an in-game tutorial that walks you through the basics. It covers: movement and interaction (F to interact, PIT for inner thought), finding your way to the spaceport, using the ASOP terminal to retrieve your ship, and your first flight. Completing it gets you to a space station and familiar with the core loop.\n\nMany players skip it or feel lost after it ends — the game opens up and can feel overwhelming. If you're stuck, the video above is a full walkthrough. Use it if you need a step-by-step guide.\n\nCheckpoint: You've completed the in-game tutorial (or watched the walkthrough and know what it covers).",
        resources: [],
      },
      {
        id: "first-5",
        title: "Setting your spawn location",
        description: "After the tutorial: set your spawn at the medical center. Death and respawn.",
        imageUrl: "/lesson-thumbnails/first-5.png",
        text: "The tutorial takes you to a space station. It doesn't cover setting your spawn — so that's your next step.\n\n[SECTION]Set your spawn[/SECTION]\n\nGo to the medical center, find the insurance terminal (as shown in the image above), and use Regeneration → Transfer Imprint. That location becomes your respawn point. You can change it any time, no cost. Tip: space stations mean a faster return to space — no tram ride, and you don't need to leave atmosphere, which takes time.\n\n[SECTION]When you die[/SECTION]\n\nYou respawn at your selected medical centre. If that location is not available, you respawn at your home — the one you chose when you first set up the game. You keep what you have equipped (guns, armour, attachments). Anything stored in your backpack or armour slots stays on your body and can be looted.\n\nIf you need to kill yourself — for example, to fast travel back to your spawn — hold Backspace. It's not intended long term, but it's how the game currently works.\n\nCheckpoint: You've set your spawn at the space station and know how to recover from death.",
        resources: [],
      },
      {
        id: "first-next",
        title: "What's next?",
        description: "Choose your game loop. Flying, ground combat, professions — it's a sandbox. You decide.",
        imageUrl: "/lesson-thumbnails/first-next.png",
        text: "Star Citizen is a sandbox MMO. You carve your own experience. The real question: what do you want to try first?\n\nYou've done the setup. Now the real game starts — and it starts with a choice. What do you want to get good at? Flying? Combat on the ground? The industrial side — mining, trading, salvage? Pick a path below and dive in. You can always switch later.",
        resources: [
          { label: "Learning to fly", url: "/training?path=flying#basic-training", icon: "Rocket", description: "Ships, space, and combat" },
          { label: "Ground combat", url: "/training?path=fps#basic-training", icon: "Crosshair", description: "Weapons, bunkers, and PvE" },
          { label: "Professions", url: "/training?path=professions#basic-training", icon: "Briefcase", description: "Mining, trading, and industrial" },
        ],
      },
      {
        id: "first-11",
        title: "Performance: CPU, FPS, and server tech",
        description: "The game isn't optimised yet. Why CPU matters, personal vs server FPS, and what's coming.",
        imageUrl: "/lesson-thumbnails/first-4.svg",
        text: "The game is not fully optimised yet. Performance will improve over time, but it helps to know what you're dealing with.\n\n[SECTION]CPU and FPS[/SECTION]\n\nCPU is usually the bottleneck — more than your graphics card. The game does a lot of simulation (ships, physics, AI, other players) on the server and on your machine. Check the recommended specs on the Roberts Space Industries website and aim for a strong CPU; an SSD and at least 16 GB RAM are essential.\n\nYou'll see two FPS numbers in the game: your personal FPS (how smoothly your PC is drawing the frame) and server FPS. Right now server FPS is capped at 30. So even with a powerful PC you can feel hitches or a ceiling on smoothness when the server is under load. That's a current limitation, not a fault of your hardware.\n\n[SECTION]Server meshing[/SECTION]\n\nServer meshing is the tech that lets multiple servers share one game world (so more players and more space without one server doing everything). The team is working on dynamic server meshing — servers handing off areas and players as they move — which should improve stability and performance over time. You don't need to understand the details; just know that big backend improvements are in progress.\n\nCheckpoint: You know the game is CPU-heavy and unoptimised, that server FPS is capped at 30, and that server meshing work is ongoing.",
        resources: [],
      },
      {
        id: "first-12",
        title: "Community and where to learn",
        description: "Spectrum, Issue Council, YouTube, newsletters, and dev content — so you know where to ask and where to look.",
        imageUrl: "/lesson-thumbnails/first-10.svg",
        text: "Knowing where to get help and stay informed makes a big difference.\n\n[SECTION]Spectrum and Issue Council[/SECTION]\n\nSpectrum is the official forum (robertsspaceindustries.com/spectrum). You can ask questions, read guides, and join discussions. The Issue Council is where players report bugs and vote on reproductions — it helps the devs prioritise fixes and can give you workarounds. Both are linked from the RSI site.\n\n[SECTION]YouTube and dev updates[/SECTION]\n\nYouTube has a huge amount of community content: tutorials, ship reviews, patch summaries, and guides for every role. If you're stuck on something, search for it; someone has usually made a video.\n\nThe dev team puts out regular updates: newsletters, comm-link posts, and videos (e.g. Inside Star Citizen, Star Citizen Live). The original Kickstarter and the stretch goals are part of the game's history and show the long-term vision — worth a look if you want the full picture.\n\nCheckpoint: You know where the forum is, where to report bugs, and that YouTube and official updates are there when you need them.",
        resources: [
          { label: "Spectrum — official forum", url: "https://robertsspaceindustries.com/spectrum" },
          { label: "Issue Council — report bugs", url: "https://robertsspaceindustries.com/community/issue-council" },
          { label: "RSI — comm-link & news", url: "https://robertsspaceindustries.com/comm-link" },
        ],
      },
    ],
  },
  {
    id: "flying",
    title: "Learning to fly",
    description: "Arena Commander first. HUD, controls, coupled/decoupled, settings, pre-flight, takeoff, plotting, comms, orbiting, ship stats, components, engineering.",
    icon: "Rocket",
    lessons: [
      {
        id: "flying-ac",
        title: "Arena Commander setup",
        description: "The arcade mode — no travel, no cost, instant respawn. Ideal for training or practice.",
        imageUrl: "/lesson-thumbnails/arena-commander-setup.png",
        text: "Arena Commander (AC) is the arcade mode within Star Citizen — separate from the persistent universe.\n\nThere's no travel time, no aUEC cost, no gear to lose, and you have instant respawns. That makes it ideal for training or practice.\n\n[IMAGE:/lesson-thumbnails/arena-commander-path.svg|Main menu → Game Modes → Arena Commander → Offline → Free Flight|520px]\n\nPick your map. I recommend Security Post Kareah — it has good references for training.\n\nI also recommend Offline mode so it's just you.\n\nAt this early stage, we're not going to focus on vehicle loadouts and vehicle selection. We're just going to load in with the initial ship that we purchased.\n\nCheckpoint: You know Arena Commander is the arcade mode and have loaded into Free Flight at least once.",
        resources: [],
      },
      {
        id: "flying-1",
        title: "Learning the HUD",
        description: "What the HUD is and what it does. Setup via MFD and Escape options. Advanced HUD, flight settings.",
        imageUrl: "/Training/Dogfighting/hud-cockpit.png",
        videoUrl: "https://youtu.be/DAkuSrkm1Y8",
        text: "The HUD (Heads-Up Display) is the overlay on your screen when you're in a ship — your vector, speed, mode, boost, and more. Most players start in basic mode; we'll switch to Advanced HUD and remove the hologram so the important elements are clear.\n\n[SECTION]Setup via MFD[/SECTION]\n\nAll settings are done from within the ship. Hold F to interact, then use the MFD (Multi-Function Display) — the screens around your cockpit. Open one, search for Configuration.\n\n[SECTION]HUD[/SECTION]\n\n[CHECKLIST]\nEnable Advanced HUD (SCM and NAV)\nDisable MFD casts (removes the top-left hologram)\n[END_CHECKLIST]\n\n[SECTION]Key elements[/SECTION]\n\n[IMAGE:/Training/Dogfighting/hud-key-elements.png|In-game HUD showing mode, speed, TVI, G-meter, and boost bar|75%]\n\n[HUD_KEY_ITEMS]\n1|Mode — SCM (Space Combat Maneuvers) or NAV (Navigation). SCM = weapons and shields on, speed capped for combat. NAV = fast travel, weapons and shields off.\n2|Speed — Your current speed in m/s.\n3|TVI (Travel Vector Indicator) — The marker showing which direction you're actually travelling. Your nose can point one way while you're drifting another; the TVI shows the truth.\n4|Boost bar — Your afterburner fuel. Empty = you can't dodge or run.\n5|Countermeasures — Decoy and noise. Defensive flares and chaff for evading missiles and breaking locks.\n6|G-meter — How many G-forces you're pulling. High G can black you out.\n[END_HUD_KEY_ITEMS]\n\n[SECTION]Flight settings[/SECTION]\n\nAdditional configurations via the MFD will help you build good habits. Many new players don't touch these and in turn build habits around systems that don't best serve them when they want to improve.\n\n[CHECKLIST]\nDisable automatic slowdown\nDisable G-Safe\nDisable \"Space brake enables boost\"\nDisable proximity assist\nDisable speed limiter\nGimbals locked, precision lines on; pips/symbology off\n[END_CHECKLIST]\n\nChanges apply to this session only. For permanent defaults: Escape → Options → set the relevant game settings as default. A full list of settings can be found in the video above.\n\nCheckpoint: You know what the HUD is, you can name mode, speed, TVI, G-meter, and boost bar, and you've set up Advanced HUD plus the flight settings above.",
        resources: [],
      },
      {
        id: "flying-2",
        title: "Basic controls",
        description: "How your ship moves and turns. 6DOF, thrust vs rotation, strafing, pitch/yaw/roll, M+K vs HOSAS, boost and brake, coupled vs decoupled, G-force.",
        videoUrl: "https://youtu.be/H58jzY8o7HE",
        text: "In space your ship can move in any direction and turn on any axis. That's six degrees of freedom (6DOF) — six ways the ship can move. They split into two groups: thrust (where you go) and rotation (where your nose points).\n\n[SECTION]6DOF[/SECTION]\n\nThrust is where you go. The ship fires thrusters and you move in a direction — translation only, no turning. Three axes: forward/back (throttle and retro), left/right (horizontal strafe), up/down (vertical strafe). Strafing is moving sideways or vertically without turning the nose. You can go left while facing forward; that's thrust on one axis, rotation unchanged.\n\nRotation is which way your nose points. You turn on an axis — the ship can spin without changing where it's going. Three axes: pitch (nose up or down), yaw (nose left or right), roll (ship spins around the nose). On most ships, yaw is the slowest way to turn, roll is fastest, pitch is in between. To get your nose on a target quickly: roll so the target is above or below you, then pitch. Roll then pitch beats yawing across.\n\n[SECTION]Mouse and keyboard vs HOSAS[/SECTION]\n\nM+K (mouse and keyboard), HOTAS (one throttle, one stick), or HOSAS (two sticks) — any of them work. Use what you have. Bind throttle, strafe, pitch, yaw, roll, boost, brake. Keybinds are personal; find what feels natural. Flying well comes from building muscle memory: repeating the same inputs until they're automatic. The next lessons are about practice, not just theory.\n\n[SECTION]Boost and brake[/SECTION]\n\nBoost is afterburner. Short bursts for evasive movement or correcting position. Empty boost bar means less acceleration — don't run it dry in a fight. Space brake is one input to stop (cancel your velocity). Often X by default. Brake and boost should be separate bindings.\n\n[SECTION]Coupled vs decoupled[/SECTION]\n\nCoupled is on by default. You can change it on the MFD (in the ship) or in the game settings (Escape → Options).\n\nCoupled mode: whenever you release an input, the ship fires thrusters to cancel your momentum. Let go of forward — you slow down. Let go of strafe — you stop drifting. It feels safe. But it works against you when you need precise control: hard to hold a smooth orbit.\n\nDecoupled mode: you keep your momentum until you actively counter it or hit brake. One brake input = full stop. Orbiting is easy: nose on a point, add some strafe, and you glide in a circle without constant input. In coupled you'd have to tap constantly because the ship keeps killing your drift.\n\nUse decoupled for precise flying — orbits, combat, anything where you want your nose and travel to differ. Use coupled as a parking brake or for smooth landings (put your TVI on the landing pad, ease down with brake).\n\n[SECTION]G-force[/SECTION]\n\nThe G-meter on your HUD shows how many G's you're pulling. Hard turns and sudden direction changes multiply the force on your pilot. Too much and you black out (screen goes dark, you lose control briefly). In basic flying you'll rarely hit it; in dogfighting it becomes something to manage. The Dogfighting section goes deeper on G and combat.\n\n[SECTION]SCM and NAV[/SECTION]\n\nSCM (Space Combat Maneuvers) — lower speed ceiling, tighter handling. NAV (Navigation) — higher speed for travel, less maneuverable. Switching between them takes a second or so. Each ship has different limits; SPViewer shows the exact numbers for any hull.\n\nCheckpoint: You know thrust vs rotation, strafe, pitch, yaw, roll, boost, brake, coupled vs decoupled, SCM vs NAV, and what G-force means.",
        resources: [],
      },
      {
        id: "flying-coupled",
        title: "Decoupled Drills",
        description: "Takeoff, landing, and orbit in decoupled. Build muscle memory so throttle, brake, and strafe become automatic.",
        videoUrl: "https://youtu.be/CaxduZYWd5k",
        text: "Time to fly. The video above teaches takeoff and landing in decoupled mode and how to orbit an object. Use it as your guide, then practice the drills below. The goal is muscle memory: throttle, brake, strafe, and landing gear should become automatic — something you do without thinking. Repeat the drills until they feel natural.\n\n[SECTION]Setup[/SECTION]\n\nArena Commander → Offline → Free Flight. Security Post Kareah recommended. Any ship.\n\n[SECTION]Pre-flight checks[/SECTION]\n\nBefore you go:\n\n[CHECKLIST]\nPower management (shields, weapons, thrust — balance as needed)\nFuel (hydrogen and quantum)\nHull and damage\nAmmo (if you have weapons)\nSpacesuit and helmet on\nCargo (if carrying any — secure or leave it)\n[END_CHECKLIST]\n\nIn Arena Commander your ship respawns fresh each time, but getting into the habit now pays off in the PU where you need to top up and repair.\n\n[SECTION]Drill 1 — Takeoff and landing (decoupled)[/SECTION]\n\nTake off in decoupled: power on, engines on, landing gear up. Ease throttle or strafe up to leave the pad. Fly around at different speeds; use retro (throttle back) or brake to slow and stop. Get used to controlling your speed yourself — in decoupled the ship won't kill your drift when you let go.\n\nLanding: slow with retro or brake. Put landing gear down. Line up your TVI on the pad and ease down with strafe or throttle. Practice until you can take off and land cleanly without crashing.\n\n[SECTION]Drill 2 — Orbit an object[/SECTION]\n\nPick a reference — a station, a ring, a structure. Nose on the target. Add strafe (left/right or up/down) so you move in a circle around it. A little throttle can widen the circle. Decoupled makes this smooth; one strafe input and momentum carries you. Try a slow orbit, then tighten it.\n\n[SECTION]Extra practice[/SECTION]\n\nSpeed control in decoupled: accelerate to a set speed, then brake to a full stop. Repeat until it feels predictable. The more you repeat, the more you build muscle memory — so when you move on to combat or the PU, your hands already know the basics.\n\nCheckpoint: You can take off and land in decoupled. You've flown at least one clean orbit around a fixed point.",
        resources: [],
      },
      {
        id: "flying-settings",
        title: "Game settings",
        description: "Flight and camera options so the ship feels responsive. Keybind basics: controls, boost, brake, landing gear.",
        text: "Do this before you fly. The defaults often feel sluggish and hide important info. All of these are in Options (Escape → Options).\n\n[SECTION]Camera[/SECTION]\n\n[CHECKLIST]\nDisable vibration, cinematic cameras, and camera spring — stable view, no erratic zoom or shake.\nDisable automatic camera movements and pilot look ahead — no distracting shifts in combat.\nDisable zoom on target — you keep manual control of field of view.\nOnce you know the basics, turn off hints and control hints to declutter the HUD.\n[END_CHECKLIST]\n\n[SECTION]Flight[/SECTION]\n\n[CHECKLIST]\nDisable auto slowdown on landing gear — it can cause unexpected slowing and crashes; manual speed control is safer.\nDisable G-Safe and boost G-Safe — full agility and responsiveness, especially in combat.\nDisable \"space brake uses boost\" — braking shouldn't drain boost; you manage boost yourself.\nTurn off the speed limiter — manual control over max speed.\nDisable proximity assist — it slows you near obstacles and hurts precision in tight spaces or combat.\nCruise mode: leave activation off; use the hotkey when you want it.\nGravity compensation: keep on for smoother atmospheric flight (you can disable for a challenge).\n[END_CHECKLIST]\n\n[SECTION]ESP (Enhanced Stick Precision)[/SECTION]\n\nJoystick or HOSAS: keep ESP on, strength 1.00, dampening 0.00 for best aim. Mouse: many pilots turn ESP off for faster dogfights. Try both and see what feels right.\n\n[SECTION]HUD and targeting[/SECTION]\n\n[CHECKLIST]\nEnable all Advanced HUD options and the velocity indicator (TVI) — you see your real trajectory.\nPrecision mode lines on — shows the effective aim-assist area.\nDisable single pip and fading pip — clear, visible pips help when weapons have different projectile speeds.\nDisable missile count loop — resets can confuse you in combat.\nEnable target arrow and pin overflow — better situational awareness.\nHold to exit vehicle: keep on — avoids accidentally leaving your ship.\nShow party names: on — easier team coordination.\n[END_CHECKLIST]\n\n[SECTION]Keybind basics[/SECTION]\n\nFind and test the essentials: throttle, strafe (up/down/left/right), pitch, yaw, roll, boost, brake, and landing gear. Tune sensitivity so it feels natural. We'll go deeper on keybinds later; for now you need to be able to move, stop, and put the gear up and down.\n\nBack up your keybinds — patches and wipes can reset them, and restoring from a backup saves a lot of hassle. The video linked below walks through how to back up and restore your keybinds.\n\n[SECTION]Graphics[/SECTION]\n\nSet for stability, not max quality. If your PC struggles, lower until it's smooth. Consider upscaling (DLSS, FSR, or TAA) for better FPS. Disable motion blur for clear motion. Sharpening at 100% helps clarity. Turn off film grain and chromatic aberration to reduce visual noise. Scattered object distance on low often gives a good FPS gain with little visual loss. Planet volumetric clouds on medium can boost FPS if needed.\n\nCheckpoint: Flight, camera, HUD, and graphics are set for responsive flying and clear info. You know where your basic controls are — throttle, strafe, boost, brake, landing gear.",
        resources: [
          { label: "Back up your keybinds (video)", url: "https://youtu.be/xjjqFOygeu4" },
        ],
      },
      {
        id: "flying-takeoff",
        title: "Take off and landing",
        description: "Getting off the pad and back down. The first flight loop.",
        imageUrl: "/lesson-thumbnails/flying-5.svg",
        videoUrl: "https://www.youtube.com/watch?v=BUsOaQDAjc8",
        text: "Take off: power on, engines on, landing gear up. Ease throttle forward. Use strafe up if you need to clear the pad. In the PU, request takeoff permission first (Comms).\n\nLanding: slow with retro (throttle back) or brake. Put landing gear down. Line up your TVI on the pad and ease down. Use coupled for smooth landings — the ship kills your drift when you release inputs. In the PU, request landing permission before you arrive.\n\nPractice in Arena Commander until you can take off and land cleanly without crashing.\n\nCheckpoint: You can take off and land on a pad. You know to request permission in the PU.",
        resources: [],
      },
      {
        id: "flying-3",
        title: "How to orbit an object",
        description: "A step up from basic flight. Nose on a point, move around it. Foundation for dogfighting.",
        imageUrl: "/lesson-thumbnails/flying-5.svg",
        videoUrl: "https://www.youtube.com/watch?v=BUsOaQDAjc8",
        text: "Once you're comfortable with takeoff, landing, and basic movement, orbiting is the next step. It means keeping your nose on a fixed point while you move in a circle around it. Your nose and your travel direction are different — that's the 6DOF separation from Basic controls. This is the foundation for dogfighting: rate fights are two ships orbiting each other, both trying to keep their nose on the other.\n\n[SECTION]How it works[/SECTION]\n\nNose on the target. Add strafe (left/right, up/down) so you move sideways or vertically around it. A little throttle can widen the circle. Your TVI (direction of travel) moves around the target while your crosshair stays on it. In decoupled, you set the strafe once and your momentum carries you — smooth, minimal input. In coupled, the ship constantly fights your drift, so you have to tap strafe over and over. Decoupled is why orbiting feels natural.\n\n[SECTION]Why it matters[/SECTION]\n\nEvery close-range fight settles into an orbit. Both pilots roll to position, pitch to track, and strafe to hold the circle. The one who keeps their nose on target first has control. Learning to orbit a fixed point (a station, a ring) builds the muscle memory before you add a moving target.\n\n[SECTION]Practice[/SECTION]\n\nArena Commander → Free Flight. Stop in front of the blue ring at Security Post Kareah. Roll 90° so the ring is above or below you. Pitch to put your nose on it. Add strafe (up or down) — start at 30–40 m/s. Keep the nose on the ring as you circle. Decoupled. Try it in coupled and feel the difference.\n\nCheckpoint: You understand what orbiting is, why decoupled makes it work, and you've flown a clean orbit around a fixed point.",
        resources: [],
      },
      {
        id: "flying-11",
        title: "Understanding your ship",
        description: "What the numbers mean so you can compare ships and plan your loadout.",
        imageUrl: "/lesson-thumbnails/spviewer-screenshot.png",
        text: "SPViewer (spviewer.eu) is a community tool that pulls real ship data from the game. Open the site, pick a ship, and you get the numbers that define how it flies and fights. No guesswork — you can compare ships before you fly or buy and know exactly what you're stepping into.\n\n[SECTION]Why it matters[/SECTION]\n\nEvery ship has a speed ceiling, turn rates, and acceleration. Those numbers set how responsive it feels: how fast you can go in combat, how quickly you can get your nose on a target, and how hard you can strafe or brake. If you're learning in a starter and thinking about upgrading, or you're borrowing a ship and want to know its limits, the tool gives you the answers. The next lesson covers components (weapons, shields, coolers); it shows those too when you're ready to plan a loadout.\n\n[SECTION]Flight performance — speed[/SECTION]\n\nSCM speed is your maximum in combat mode (weapons and shields on, speed capped). That's the \"speed wall\" you'll hear about in dogfighting: stay at or below SCM for full maneuverability; go over it and the ship gets sluggish when you need to dodge. NAV speed is your travel ceiling — higher, but you're in travel mode and less maneuverable. Both are in m/s. When you're flying, the HUD shows your current speed; look up the ship's limits in the tool.\n\n[SECTION]Flight performance — rotation[/SECTION]\n\nPitch, yaw, and roll are how fast the ship turns on each axis, usually in degrees per second. On most ships, roll is fastest, then pitch, then yaw (slowest). Higher numbers = faster turn. If you're comparing two ships, the one with higher pitch and roll will feel more nimble in a fight.\n\n[SECTION]Efficient flying and muscle memory[/SECTION]\n\nBecause yaw is slower than pitch and roll is fastest, the efficient way to get your nose on a target is roll first, then pitch — not yaw. Roll so the target is above or below you, then pitch up (or down) onto them. That uses your ship's strongest axes and gets you on target in less time. Practice this until it's automatic. Building that habit early is good muscle memory; if you rely on yaw, you'll be slower and have to unlearn it later.\n\nLearn your ship's abilities and limitations. Look up your ship's actual pitch, yaw, and roll so you know what it can do. Then fly it: feel the difference when you roll then pitch versus when you yaw. Stay within the ship's limits (e.g. SCM speed, so you keep full maneuverability) and you'll build efficient habits that carry over to any ship.\n\n[SECTION]Accelerations[/SECTION]\n\nAccelerations are in G (multiples of gravity). Main is forward, retro is backward, and strafe is up/down/left/right. Higher G means the ship changes velocity faster — it feels snappier when you hit throttle, brake, or strafe. Strong retro and strafe help you stop and dodge; strong main gets you up to speed quickly. Use these numbers when you're choosing a ship for combat or racing.\n\n[SECTION]Where to find the numbers[/SECTION]\n\nIn the tool, select your ship from the list and open the flight or performance section. The layout may change as the tool updates, but the numbers — SCM, NAV, pitch/yaw/roll, and accelerations — are what you need for understanding how your ship flies. Use it alongside the in-game experience: fly the ship, then check the numbers to see why it feels the way it does.\n\nCheckpoint: You can look up a ship's speed, rotation, and acceleration numbers. You know the efficient habit is roll then pitch, and you use the numbers to learn your ship's abilities and limitations.",
        resources: [
          { label: "SPViewer — open the tool", url: "https://www.spviewer.eu/" },
        ],
      },
      {
        id: "flying-components",
        title: "Ship components and upgrades",
        description: "Component types and grades, heat, HP, weapons, loadouts. Where to buy or find parts. Repair from cockpit or engineering.",
        imageUrl: "/lesson-thumbnails/ship-components.png",
        text: "Ships have slots for weapons and components. You can swap a vehicle's components physically by unlocking the ports on the ship, or at a space station when the ship is stored — via the vehicle manager.\n\n[SECTION]Unlocking ports[/SECTION]\n\nUnlock your ship's component ports anytime with Right Alt + K. Be careful: while unlocked, other players can take your components. Lock the ports again when you're finished.\n\n[SECTION]Planning loadouts — Erkul and SPViewer[/SECTION]\n\nUse Erkul (erkul.games) or SPViewer (spviewer.eu) to see ship and component stats before you fly. Pick a ship and you get a full list: weapons, shields, coolers, power plant, quantum drive, thrusters, and performance (DPS, shield HP, heat and EM).\n\nClick a component to see what's available for that slot — grades, class, stats — and where to purchase it in the verse.\n\n[IMAGE:/lesson-thumbnails/spviewer-loadout.png|SPViewer loadout view — weapons, components, grades, and performance for a ship|75%]\n\n[SECTION]Types and grades[/SECTION]\n\nComponents have types (e.g. stealth, civilian, military) and grades: A, B, C. Higher grade usually means better performance.\n\nThe best A and B in stealth or military often can't be bought in shops. You find them by looting or salvaging. So \"military A\" coolers or \"stealth B\" power plants are earned in the verse, not at a terminal.\n\n[SECTION]What components affect[/SECTION]\n\nComponents affect heat signature (stealth = low-emission parts), HP (how much damage before they fail), and how the ship flies and fights. Different loadouts suit different styles: brawler, sniper, stealth, tank. Use Erkul or SPViewer to compare options.\n\n[SECTION]Weapons[/SECTION]\n\nShip weapons are ballistics, lasers, or distortion. Ballistics penetrate shields and hit hull and components; they're the current PvP meta but need ammo. Lasers use capacitor, no ammo, but are stopped by shields. Distortion damages systems and can disable without destroying.\n\nShips have hull HP, armour, and shields. Ballistics bypass shields and can knock out critical components. In precision mode you can target the power plant to disable the ship.\n\n[SECTION]Repair[/SECTION]\n\nEngineering allows in-flight repair. Small ships: often repair from the cockpit. Larger ships: use an engineering terminal or go to the physical component and repair with the multitool for faster results.\n\nCheckpoint: You know component types and grades, that top stealth/military A and B are looted or salvaged, and you use Erkul or SPViewer to plan loadouts. You understand weapons (ballistic, laser, distortion), hull/shields/armour, and targeting components to disable. You know repair from the cockpit on small ships and via terminal or multitool on larger ones.",
        resources: [
          { label: "Erkul — ship & component stats", url: "https://erkul.games/" },
          { label: "SPViewer — ship & components", url: "https://www.spviewer.eu/" },
        ],
      },
      {
        id: "flying-engineering",
        title: "Engineering",
        description: "Power triangle, shields, cooling. Managing ship systems in flight.",
        imageUrl: "/lesson-thumbnails/flying-10.svg",
        text: "The power triangle lets you shift power between shields, weapons, and thrust. More power to shields = faster recharge. More to weapons = more damage. More to thrust = better acceleration and boost. You can adjust this in flight via the MFD or keybinds.\n\nShields have faces (front, back, etc.) — damage is distributed. Cooling affects how long you can sustain fire or boost before overheating.\n\nFor basic flying you don't need to micromanage, but knowing the triangle exists helps when things get rough.\n\nCheckpoint: You know what the power triangle does and can adjust it if needed.",
        resources: [],
      },
    ],
  },
  {
    id: "dogfighting",
    title: "Dogfighting",
    description: "Ship-v-ship PvP: roll/pitch discipline, drills, evasion, merge, pip control, speed walls, Arena Commander.",
    icon: "Swords",
    lessons: [
      {
        id: "df-1",
        title: "What is dogfighting",
        description: "Ship-v-ship PvP. Where to practice and why it matters.",
        imageUrl: "/lesson-thumbnails/flying-8.svg",
        text: "Dogfighting here means ship-v-ship combat against other players (PvP). It's different from fighting AI: players dodge, fake, and exploit the same mechanics you're learning.\n\nYou can practice in the persistent universe (PU) — real bounties, real risk — or in Arena Commander (AC), a separate mode from the main menu. AC has no travel, no cost if you die, and instant respawn. Most pilots use AC to build muscle memory and then take those skills into the PU.\n\nThis section assumes you've done Learning to fly: HUD, 6DOF, decoupled, and orbiting. Dogfighting adds roll/pitch discipline, evasion, merge, pip control, speed walls, and PvP tactics.\n\nCheckpoint: You know dogfighting is PvP ship combat and that Arena Commander is the place to practice without losing money or gear.",
        resources: [],
      },
      {
        id: "flying-4",
        title: "Roll, pitch, yaw — and why it matters",
        description: "Roll to position, pitch to track. Why this is faster than yawing left and right.",
        imageUrl: "/lesson-thumbnails/flying-4.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "On most ships, rotation speeds go: roll (fastest), then pitch, then yaw (slowest). You can check the exact numbers for any ship in SPViewer (linked below).\n\nWhat this means: if a target is off to your left, yawing toward them is the slowest way to get your nose on them. Instead: roll so the target is above or below you, then pitch. Roll is fast, pitch is next — so you get on target quicker. Then use strafe up (usually your strongest strafe direction after forward) to stay on them or close distance.\n\nThis is called \"keeping the fight in pitch\" — roll to reposition, pitch to track. It's the core of how skilled pilots fly, and it's why most close-range fights settle into an orbit where both ships are pitching into each other.\n\nCheckpoint: You understand why you roll first and pitch second, and you've tried it against a fixed point (like a station).",
        resources: [
          { label: "SPViewer — compare ship rotation", url: "https://www.spviewer.eu/" },
        ],
      },
      {
        id: "flying-5",
        title: "Drills — nose on target, orbit, roll then pitch",
        description: "Structured practice at a station. These are the drills that build muscle memory.",
        imageUrl: "/lesson-thumbnails/flying-5.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "Load into Arena Commander (practice mode — no cost, instant respawn) and fly to a fixed reference like a station.\n\n[SECTION]Drill 1 — Nose on target[/SECTION]\n\nRoll so the station is above you. Pitch (and strafe up if needed) to keep the nose on one spot as you fly past. Slow pass, repeat until it feels steady.\n\n[SECTION]Drill 2 — Orbit[/SECTION]\n\nNose on the station, add side strafe and a little throttle to fly in a circle around it. Decoupled holds the orbit smoothly with minimal input. Try it in coupled too — you'll feel the difference (you have to tap constantly).\n\n[SECTION]Drill 3 — Pole drill[/SECTION]\n\nOrbit as close as you can to the structure without hitting it. Builds tight control.\n\n[SECTION]Drill 4 — Roll then pitch[/SECTION]\n\nPick a spot on the station (e.g. a dish). Look away, then re-acquire: roll so the target is above or below, then pitch onto it. No yaw. This should feel faster than yawing across.\n\nCheckpoint: You can orbit a station with nose on it (decoupled) and re-acquire a point using roll then pitch.",
        resources: [],
      },
      {
        id: "flying-6",
        title: "Passive evasion — corkscrew and circle strafe",
        description: "Moves you do regardless of what the enemy is doing. Break their aim solution.",
        imageUrl: "/lesson-thumbnails/flying-6.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "Passive evasion means moves you perform no matter what the enemy is doing. The game's aiming system predicts where you'll be based on your current direction and speed. If your direction keeps changing, their aim solution is wrong and they miss.\n\n[SECTION]Corkscrew[/SECTION]\n\nBoost forward, roll, and strafe so your TVI (direction of travel marker) stays roughly in one spot off to the side. You never actually fly to where the TVI is — it orbits you — so anyone shooting at your predicted position misses. Use when approaching a fight or when outside about 900 m. Inside that range, stop corkscrewing and start fighting.\n\n[SECTION]Circle strafe[/SECTION]\n\nNo forward/back movement, just side strafe and up strafe so you move in a circle. Good against stationary or slow targets (turrets, large ships). Same idea: your predicted position is always moving. Don't spin so fast that you pull too many G's and black out (the screen goes dark and you lose control briefly), or so fast that you're not actually going anywhere.\n\nCheckpoint: You can perform a corkscrew approach and a circle strafe in Arena Commander.",
        resources: [],
      },
      {
        id: "flying-7",
        title: "Glossary — combat terms",
        description: "Quick reference for terms used in dogfighting and by other pilots.",
        imageUrl: "/lesson-thumbnails/flying-7.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "6DOF — Six degrees of freedom: three ways to move (throttle/retro, strafe L/R, strafe U/D) and three ways to turn (pitch, yaw, roll).\n\nSCM / NAV — SCM = Space Combat Maneuvers (weapons, shields, capped speed). NAV = Navigation (fast travel, weapons and shields off). Stay in SCM during a fight.\n\nPIP — Predicted impact point. The marker on your HUD showing where to aim to hit a moving target.\n  Lead pip — Ahead of the target, when they're moving across or away — you aim ahead so shots land.\n  Lagging pip — When they're closing toward you, the pip sits closer to or behind them; less lead required.\n\nVector — Your direction of travel. Where you're actually going, which can differ from where your nose points (especially in decoupled). The TVI shows your vector on the HUD.\n\nTVI — Your velocity indicator (direction you're actually travelling). The target's TVI shows their direction.\n\nDelta — Relative velocity between you and a target. Positive = closing. Negative = separating.\n\nMerge — Closing into engagement range. The moment you commit to the fight.\n\nRate fight — The sustained turning duel when two ships orbit each other, matching turn rates, pips in pitch. The \"binary circle\" that most skilled fights settle into.\n\nNose authority — Who gets their nose on target first after a merge. The pilot with nose authority controls the fight.\n\nSpeed wall — Max speed in SCM without boost (ship-dependent). Stay under it for full maneuverability. On or above it, your acceleration in other directions gets cut.\n\nRule of halves — Effective engagement range is roughly half your weapon's velocity. E.g. a gun with 1800 m/s projectile speed → effective at ~900 m (shots land in half a second). Outside that, evasion is too easy.",
        resources: [],
      },
      {
        id: "flying-8",
        title: "Stages of a fight — merge, duel, disengage",
        description: "Every fight has stages: how you close in, the turning fight, and when to get out.",
        imageUrl: "/lesson-thumbnails/flying-8.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "[SECTION]Merge[/SECTION]\n\nClosing into range. If you boost straight at someone, you'll close too fast and slingshot past them. Keep your closing rate around 200 m/s or under (watch delta on the HUD). NAV merge: approach fast in travel mode, then brake in time (start braking around 3 km out), switch to SCM, and close the last stretch under 200. Delta merge: the target is coming at you (e.g. a fast ship making attack passes) — backstrafe and boost to keep their closing speed low so they don't blow past you. Before merging: confirm you're in SCM and you have boost.\n\n[SECTION]Duel (rate fight)[/SECTION]\n\nOnce you're in range, the fight settles into a turning duel. Both ships orbit, pips in pitch, matching turn rates. Whoever gets their nose on target first (nose authority) controls the fight and can lead the other around. We cover active evasion and pip work in the next lesson. Key: stay under the speed wall and use boost in strafe (not forward).\n\n[SECTION]Disengage[/SECTION]\n\nBreak the fight before you're dead. Turn away, create separation, then switch to NAV when they're not right on you (NAV turns off your shields and weapons). Use boost to get out. If boost is low, disengage earlier while you still can. Fights can have multiple merges if someone runs, recovers, and comes back.\n\nCheckpoint: You understand the three stages and know what to focus on at each one.",
        resources: [],
      },
      {
        id: "flying-9",
        title: "Pip control and active evasion",
        description: "Neutralise pips to close; keep the fight in pitch; evade when you have nose authority.",
        imageUrl: "/lesson-thumbnails/flying-9.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "[SECTION]Pip neutralisation[/SECTION]\n\nThe pip shows relative motion between you and the target. If you strafe in the direction of the pip, you reduce that relative motion (called neutralising the pip) — your paths align and you can close distance or hold position. If you strafe away from the pip, you extend (separate) — useful when disengaging.\n\n[SECTION]Keep the fight in pitch[/SECTION]\n\nRoll so the pip sits above their ship, then use strafe up to track them. That posture — pip in pitch, above them — is where you want to be. If they're yawing and you're pitching, you have the faster turn rate (this is called attacking the wing). Both ships doing this is why fights settle into orbits.\n\n[SECTION]Range and active evasion[/SECTION]\n\nDon't open fire at maximum range. Effective range is roughly half your weapon's projectile speed (see glossary — rule of halves). Inside that, your shots arrive in under half a second. Outside it, evasion is too easy.\n\nWhen you have nose authority (you got on target first), strafe away from the direction they're turning — this forces them to chase your ship. If you lose nose authority (they're on you before you're on them), reverse: roll the other way, strafe, and try to get back on top.\n\nCheckpoint: You understand pip neutralisation, keeping the fight in pitch, and the difference between passive evasion (lesson 6) and active evasion (this lesson).",
        resources: [],
      },
      {
        id: "flying-10",
        title: "Boost, speed walls, and ship exhaustion",
        description: "Why going faster isn't always better. Stay under the wall, manage boost, don't run out.",
        imageUrl: "/lesson-thumbnails/flying-10.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "[SECTION]Speed wall[/SECTION]\n\nIn SCM (combat mode), your ship has a maximum speed without using boost — this is called the speed wall (it's different for each ship, e.g. ~225 m/s for a Gladius). Below that speed you get full acceleration in every direction. At the wall, your acceleration in sideways and up/down directions gets cut. Over it (e.g. from boosting forward), it's even worse — when boost runs out, the ship drags you back to the wall and you can barely dodge in any direction.\n\n[IMAGE:/Training/Dogfighting/scm-nav-performances.png|Flight performances — SCM, NAV, accelerations|50%]\n\nSo in a fight: stay under the speed wall. Use boost for short bursts in strafe (dodge sideways, correct position) — not to go faster forward. Slow speed with fast direction changes is how you survive.\n\n[SECTION]Ship exhaustion[/SECTION]\n\nWhen the boost bar is empty, the ship is exhausted. Slower in every direction. Can't dodge, can't run. If your boost is getting low, pull away from the fight, create distance, let it recover, then re-engage. Don't stay in a fight with empty boost.\n\nCheckpoint: You know what the speed wall is, you can see your speed on the HUD, and you treat boost as a resource to manage, not a gas pedal.",
        resources: [],
      },
      {
        id: "df-2",
        title: "Ship choice for PvP",
        description: "Why light fighters dominate. When to fly something else.",
        imageUrl: "/lesson-thumbnails/flying-10.svg",
        text: "Light fighters (e.g. Gladius, Arrow) are the meta for 1v1 and small-group PvP. They have strong acceleration, good rotation, and a small profile — hard to hit, fast to get their nose on target. Heavier ships hit harder but turn slower and present a bigger target; in a skilled fight the light fighter usually wins.\n\nThat doesn't mean you must fly a light fighter. Medium fighters and heavies have a place in group fights, and some pilots prefer a different style. But if you want to learn the core duel — merge, rate fight, nose authority — start in a light fighter. You can look up exact stats (speed wall, pitch/yaw/roll, thrust) in SPViewer.\n\nCheckpoint: You know why light fighters dominate 1v1 and that you can look up ship stats before you fly.",
        resources: [
          { label: "SPViewer — ship stats", url: "https://www.spviewer.eu/" },
        ],
      },
      {
        id: "df-3",
        title: "Weapons and loadouts",
        description: "Weapon velocity, rule of halves, fixed vs gimbal. What to run.",
        imageUrl: "/lesson-thumbnails/flying-2.svg",
        text: "Weapon projectile velocity determines effective range. The rule of halves: effective engagement is roughly half the projectile speed in m/s. So a 1800 m/s gun is effective to about 900 m — beyond that, targets can dodge easily.\n\nFixed weapons (no gimbal) do more damage and force you to fly the pip — good for practice and for max DPS when you can track. Gimballed weapons aim for you within a cone; easier to land shots but less damage and they can be countered by fast strafe. Many PvP pilots run fixed for the damage and the discipline it teaches.\n\nMatch weapon velocities so your pips line up (one pip, one pull of the trigger). Mismatched velocities mean multiple pips and split focus. Check SPViewer or in-game for weapon stats.\n\nCheckpoint: You understand the rule of halves and why matching weapon velocities matters.",
        resources: [
          { label: "SPViewer — weapons", url: "https://www.spviewer.eu/" },
        ],
      },
      {
        id: "df-4",
        title: "Arena Commander — where to practice",
        description: "AC modes, single player vs multiplayer, no cost, instant respawn.",
        imageUrl: "/lesson-thumbnails/flying-5.svg",
        text: "Arena Commander is in the main menu under Game Modes. You can run single-player vs AI (Vanduul or pirates) to warm up or practice drills. For real PvP, use multiplayer: Battle Royale (free-for-all), Squadron Battle (team deathmatch), or other modes depending on patch.\n\nNo travel, no aUEC cost for repairs or reclaim. You spawn, you fight, you die, you respawn. That makes it ideal for repetition: merge practice, pip tracking, disengage and re-engage.\n\nQueue times vary by region and time of day. If nobody is in AC, use single-player to keep drilling; the mechanics are the same.\n\nCheckpoint: You've loaded into Arena Commander (single or multi) and know where to find it for future practice.",
        resources: [],
      },
      {
        id: "df-5",
        title: "Merge discipline (PvP)",
        description: "Closing rate, NAV merge, delta merge. Common mistakes.",
        imageUrl: "/lesson-thumbnails/flying-8.svg",
        text: "The merge is when you close into engagement range. Do it wrong and you slingshot past, waste boost, or give them the first shot.\n\nKeep closing rate (delta) around 200 m/s or under. NAV merge: approach in travel mode, brake in time (start around 3 km out), switch to SCM, close the last bit under 200. Delta merge: they're coming at you — backstrafe and boost to keep their closure low so they don't blow past.\n\nCommon mistakes: boosting straight at them (you overshoot), merging in NAV with no brake (same), merging with no boost left (you can't dodge on the way in). Before every merge: confirm SCM, confirm you have boost.\n\nCheckpoint: You can execute a controlled merge with delta under 200 m/s in AC.",
        resources: [],
      },
      {
        id: "df-6",
        title: "Rate fight and nose authority",
        description: "Keeping nose authority, losing it, and how to recover.",
        imageUrl: "/lesson-thumbnails/flying-9.svg",
        text: "Once you're in range, the fight becomes a rate fight: both ships orbiting, pips in pitch, matching turn rates. Whoever gets their nose on target first has nose authority — they lead the other pilot around.\n\nTo keep it: stay under the speed wall, use boost in strafe (not forward), keep the fight in pitch (roll so pip is above them, strafe up to track). If you lose nose authority — they're on you before you're on them — roll the other way, strafe, and try to get back on top. Don't yaw; roll then pitch is faster.\n\nIf you can't recover, create separation and disengage: turn away, build distance, go to NAV when they're not right on you, boost out. Live to merge again.\n\nCheckpoint: You understand nose authority and have tried to hold it and recover it in a duel.",
        resources: [],
      },
      {
        id: "df-7",
        title: "Wing fights and multiple targets",
        description: "2v2, 2v1, target priority, when to disengage.",
        imageUrl: "/lesson-thumbnails/flying-8.svg",
        text: "When more than two ships are in the fight, target priority matters. Focus the ship that's already damaged or the one that's about to get a shot on your wingman. Don't tunnel one target while another gets behind you.\n\n2v1: you're at a disadvantage. Use range and evasion; try to separate them so you fight one at a time. If you can't, create distance and run — surviving is a win.\n\n2v2: communicate if you can. Call targets, call when you're disengaging. Two pilots with nose authority on different targets can clear a fight fast.\n\nDisengage when you're low on boost, low on hull, or outnumbered and separated. One good disengage beats a respawn.\n\nCheckpoint: You've been in a multi-target fight (AC or PU) and thought about target priority and when to leave.",
        resources: [],
      },
      {
        id: "df-8",
        title: "Countermeasures and missiles",
        description: "Flares, chaff, missile types. Don't rely on missiles for kills.",
        imageUrl: "/lesson-thumbnails/flying-2.svg",
        text: "Countermeasures (flares, chaff) break missile lock or confuse seekers. Use them when you get a missile lock warning or when you see a launch — timing matters. Some missiles are flare-resistant, some chaff-resistant; the HUD usually indicates type.\n\nMissiles can get kills, but skilled pilots often avoid them. They're part of the game: use them when it makes sense (e.g. on a disengaging target), but don't depend on them. Guns are the main event; missiles are pressure or finishers.\n\nIn AC you can test different countermeasure bindings and get used to the lock tone and launch cues.\n\nCheckpoint: You know how to fire countermeasures and that guns, not missiles, are the core of PvP.",
        resources: [],
      },
    ],
  },
  {
    id: "fps",
    title: "FPS & PvE",
    description: "Ground combat, weapons, bunkers, and how to PvE effectively.",
    icon: "Crosshair",
    lessons: [
      {
        id: "fps-1",
        title: "Weapons and armour",
        description: "What to carry, where to get it, and how to plan your loadout before you fly.",
        imageUrl: "/lesson-thumbnails/fps-1.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "[SECTION]What to carry[/SECTION]\n\nStart with a rifle, a sidearm, and a medical gun (medgun — heals you and others). Armour affects how much damage you can take and how much you can carry. Pick something that balances protection and carry capacity for the mission you're doing.\n\n[SECTION]Where to get it[/SECTION]\n\nYou can buy weapons and armour from shops at landing zones, or loot them from enemies. Use the Loadout Planner and Armour Tracker (linked below) to plan your gear before you fly so you're not shopping under pressure.\n\nCheckpoint: You have a basic loadout ready before heading to a combat mission.",
        resources: [
          { label: "Loadout Planner", url: "/loadout-planner/" },
          { label: "Armour Tracker", url: "/armor-tracker/" },
        ],
      },
      {
        id: "fps-2",
        title: "Bunker missions",
        description: "Underground facilities, AI enemies, and what to expect on your first run.",
        imageUrl: "/lesson-thumbnails/fps-2.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "Bunker missions take you to underground facilities where you fight AI enemies. These are the most common ground combat missions and a good way to earn aUEC and build reputation.\n\n[SECTION]Contract types[/SECTION]\n\nRead the contract text carefully: \"Defend\" means hold the bunker against waves. \"Clear\" or \"remove hostile\" means take out all enemies inside. Different objectives, different approach.\n\n[SECTION]Tactics[/SECTION]\n\nUse cover, clear corners before entering rooms, and watch for reinforcements coming from behind. Don't rush. Friendly NPCs may be present in some bunkers — check your target before shooting.\n\nCheckpoint: You've completed one bunker mission and understood the objective before going in.",
        resources: [],
      },
      {
        id: "fps-3",
        title: "PvE effectively",
        description: "Tactics, positioning, and surviving. One clean run beats three reckless ones.",
        imageUrl: "/lesson-thumbnails/fps-3.svg",
        videoUrl: "https://youtu.be/vnkJymjOpf4",
        text: "PvE (player vs environment — fighting AI, not other players) isn't just about shooting.\n\n[SECTION]Positioning[/SECTION]\n\nUse cover and peek around corners so you're not standing in the open. Clear each room before pushing to the next. Watch for flankers coming from behind.\n\n[SECTION]When to push and when to fall back[/SECTION]\n\nSave medical supplies (medpens and medgun) for when you're actually in trouble, not for every scratch. If you're low on health or ammo, retreat and recover.\n\nOne clean clear of a bunker beats three reckless runs where you die and lose gear. Take your time, stay alive, and the aUEC (in-game money) adds up.\n\nCheckpoint: You've completed a few combat missions without dying, or at least without panicking when things went sideways.",
        resources: [],
      },
    ],
  },
  {
    id: "professions",
    title: "Professions",
    description: "Mining, refining, trading, salvage, and other careers.",
    icon: "Briefcase",
    lessons: [
      {
        id: "prof-0",
        title: "What professions exist",
        description: "The six guilds and main career paths.",
        imageUrl: "/professions/citizencon-2954-guilds.png",
        text: "Star Citizen 1.0 organises work into six guilds. Each guild has a set of jobs — the roles and missions you can take.\n\nNot every job has full gameplay or missions yet. This section lists each profession under its guild, with detailed lessons on mining, refining, and trading. For the rest, check contracts in-game and community guides.\n\nCheckpoint: You know the six guilds and the jobs they offer, and that this section covers each profession.",
        resources: [],
      },
      {
        id: "prof-1",
        title: "Mining basics",
        description: "Hand-mining to ship mining. One run, one refine, one sell — then scale up.",
        text: "Mining ranges from hand-mining (using a multi-tool attachment on foot — low barrier, low reward) to ship-based mining (using a mining ship with lasers — higher investment, higher reward). Know your ore types and crack carefully — overcharging can break the rock or damage your ship.\n\nSell raw ore at refineries or trade terminals, or refine it first for more value (see the Refining lesson). Start with one loop: one mining run, one refine, one sell. Don't try to optimise yet.\n\nCheckpoint: You've completed one mining loop and sold the results.",
        resources: [
          { label: "Regolith Co. — mining calculator", url: "https://regolith.rocks/" },
          { label: "UEX Corp — commodity prices", url: "https://uexcorp.space/" },
        ],
      },
      {
        id: "prof-2",
        title: "Refining",
        description: "Turn raw ore into processed materials. Different methods, different yields.",
        text: "After mining, you can take raw ore to a refinery (found at certain stations) to process it into materials worth more than the raw ore. Different refining methods take different amounts of time and give different yields — some are fast but wasteful, others are slow but efficient. Choose based on your patience and the ore type.\n\nCheckpoint: You've refined a batch of ore and understand the tradeoff between speed and yield.",
        resources: [
          { label: "Refining Tracker", url: "/refining-tracker/" },
        ],
      },
      {
        id: "prof-3",
        title: "Trading & cargo",
        description: "Buy low, sell high. Requires capital, route knowledge, and risk awareness.",
        text: "Trading means buying commodities at one location and selling them at another for profit. It requires starting capital (aUEC to buy the goods) and knowledge of which routes are profitable — prices vary by location and change over time.\n\nUse tools like UEX Corp (linked below) to find profitable trade routes and current prices. Be aware: carrying high-value cargo makes you a target for other players (piracy). Plan your route, travel quickly, and don't invest more than you can afford to lose.\n\nCheckpoint: You've completed one trade run — bought goods, transported them, and sold at a profit.",
        resources: [
          { label: "UEX Corp — trade routes", url: "https://uexcorp.space/" },
        ],
      },
      // Academy of Science — professions
      {
        id: "prof-hunter",
        title: "Hunter",
        description: "Capture animals, collect parts, hunt. Academy of Science.",
        text: "Hunters capture or collect animals and their parts. Missions range from capturing live specimens to harvesting specific organs. Factions like HighPoint Wilderness Specialists offer contracts. Gameplay: hunt animals and collect parts are fully implemented; capture missions vary.\n\nCheckpoint: You know what Hunter missions involve.",
        resources: [],
      },
      {
        id: "prof-explorer",
        title: "Explorer",
        description: "Scan, map, deploy items, find & collect. Academy of Science.",
        text: "Explorers scan areas, map locations, deploy items, and find valuable objects. Imperial Cartography Center and HighPoint Wilderness Specialists offer contracts. Scan and deploy gameplay exist; location mapping and some mission types are still in development.\n\nCheckpoint: You know what Explorer missions involve.",
        resources: [],
      },
      {
        id: "prof-researcher",
        title: "Researcher",
        description: "Retrieve & research. Academy of Science.",
        text: "Researchers retrieve items or data and conduct research. Rayari Inc. is a main faction. Mission types and implementation status vary — check contracts in-game.\n\nCheckpoint: You know what Researcher missions involve.",
        resources: [],
      },
      {
        id: "prof-sar",
        title: "Search & Rescue",
        description: "Rescue persons in distress. Academy of Science.",
        text: "Search & Rescue (SAR) involves locating and rescuing people in dangerous situations. Rapid Response is the main faction. Medical ships and beacons play a role. Mission implementation in progress.\n\nCheckpoint: You know what Search & Rescue missions involve.",
        resources: [],
      },
      {
        id: "prof-farmer",
        title: "Farmer",
        description: "Animals and crops. Academy of Science.",
        text: "Farmers raise animals and grow crops. Terra Mills is the main faction. Farming gameplay is planned; check in-game and community guides for current status.\n\nCheckpoint: You know what Farmer missions involve.",
        resources: [],
      },
      {
        id: "prof-crafter-academy",
        title: "Crafter (Science)",
        description: "Chemical and food crafting. Academy of Science.",
        text: "Crafters in the Academy produce chemicals and food. Rayari Inc. and Terra Mills handle these sectors. Crafting gameplay varies — check contracts and guides for what's available.\n\nCheckpoint: You know what Science Crafter missions involve.",
        resources: [],
      },
      // United Resource Workers — professions (mining + refining have detailed lessons below)
      {
        id: "prof-salvager",
        title: "Salvager",
        description: "Collect and process destroyed ships and structures. URW.",
        text: "Salvagers collect and process destroyed ships, stations, and manufactured goods. Hull scraping and structural salvage are fully implemented. Ships like the Reclaimer and Vulture are built for this. Adagio Holdings is a main faction.\n\nCheckpoint: You know what Salvager missions involve.",
        resources: [],
      },
      {
        id: "prof-repair",
        title: "Repair Technician",
        description: "Repair hulls, infrastructure, power networks. URW.",
        text: "Repair technicians fix damaged ships (hull, components) and infrastructure. United Wayfarers Club offers hull repair; power network and infrastructure repairs are planned for Alpha 4.0. The Crucible is the dedicated repair ship.\n\nCheckpoint: You know what Repair Technician missions involve.",
        resources: [],
      },
      {
        id: "prof-towing",
        title: "Breakdown Engineer",
        description: "Towing disabled or stranded ships. URW.",
        text: "Breakdown engineers tow disabled or stranded ships. Gameplay exists with tangential missions. Towing is a support role for miners, haulers, and combat recovery.\n\nCheckpoint: You know what Breakdown Engineer missions involve.",
        resources: [],
      },
      {
        id: "prof-refueler",
        title: "Refueler",
        description: "Refuel ships in space. URW.",
        text: "Refuelers provide hydrogen and quantum fuel to ships in space. Gameplay is implemented; dedicated missions are in development. The Starfarer is the dedicated refuelling ship.\n\nCheckpoint: You know what Refueler missions involve.",
        resources: [],
      },
      {
        id: "prof-fuel-gatherer",
        title: "Fuel Gatherer",
        description: "Harvest hydrogen and quantum fuel. URW.",
        text: "Fuel gatherers harvest hydrogen and quantum fuel from space. Shubin Interstellar is a main faction. Quantum fuel gathering is partially implemented; check in-game for current status.\n\nCheckpoint: You know what Fuel Gatherer missions involve.",
        resources: [],
      },
      {
        id: "prof-builder",
        title: "Builder",
        description: "Construct buildings and orbital stations. URW.",
        text: "Builders construct infrastructure on planets and in orbit — homesteads and space stations. Cornerstone Developments is the main faction. Base building is planned; check in-game for implementation status.\n\nCheckpoint: You know what Builder missions involve.",
        resources: [],
      },
      {
        id: "prof-crafter-urw",
        title: "Crafter (Industry)",
        description: "Equipment, components, vehicles. URW.",
        text: "Industrial crafters produce equipment, ship components, and vehicles. Voyager Direct and Astro Armada handle these sectors. Implementation varies — check contracts and guides.\n\nCheckpoint: You know what Industry Crafter missions involve.",
        resources: [],
      },
      // Mercenary Guild — professions
      {
        id: "prof-bounty",
        title: "Bounty Hunter",
        description: "Track, capture, or eliminate wanted targets. Mercenary Guild.",
        text: "Bounty hunters track down criminals wanted by UEE law or private bounty, then capture or eliminate them for credits. Kill VIP missions are fully integrated. The Hawk is designed for bounty hunting with an EMP and prisoner pod.\n\nCheckpoint: You know what Bounty Hunter missions involve.",
        resources: [],
      },
      {
        id: "prof-combat-pilot",
        title: "Combat Pilot",
        description: "Ship combat: defend, patrol, destroy, recover. Mercenary Guild.",
        text: "Combat pilots fly missions: defend locations or VIPs, patrol areas, destroy objects, recover items, and eliminate targets. Foxwell Enforcement, Citizens for Prosperity, Northrock, and InterSec Defense Solutions offer contracts. Fully integrated.\n\nCheckpoint: You know what Combat Pilot missions involve.",
        resources: [],
      },
      {
        id: "prof-operative",
        title: "Operative (FPS)",
        description: "Recon, scan, investigate, extract. Mercenary Guild.",
        text: "FPS operatives conduct recon: scan areas and objects, map locations, investigate, and extract data or items. Hockrow Agency offers contracts. Investigate is fully integrated; other mission types vary. See Ground combat for FPS basics.\n\nCheckpoint: You know what Operative missions involve.",
        resources: [],
      },
      {
        id: "prof-soldier",
        title: "Soldier (FPS)",
        description: "Defend, rescue, patrol, eliminate. Mercenary Guild.",
        text: "FPS soldiers defend locations and VIPs, rescue targets, patrol, destroy objects, and eliminate enemies. Foxwell Enforcement, Citizens for Prosperity, Eckhart Security, and InterSec Defense Solutions offer contracts. Defend, destroy, kill VIP, and kill all are fully integrated. See Ground combat for FPS basics.\n\nCheckpoint: You know what Soldier missions involve.",
        resources: [],
      },
      // Interstellar Transport Guild — professions (trading has detailed lesson below)
      {
        id: "prof-hauler",
        title: "Hauler",
        description: "Bulk cargo delivery. ITG.",
        text: "Haulers move bulk cargo for contractors like Covalex, Ling Family Hauling, and Red Wind Linehaul. Low risk, low reward — requires ships with large cargo holds (Hull series). Cargo delivery is fully implemented.\n\nCheckpoint: You know what Hauler missions involve.",
        resources: [],
      },
      {
        id: "prof-courier",
        title: "Courier",
        description: "Timely delivery of valuable cargo and data. ITG.",
        text: "Couriers deliver valuable cargo and data on time. Value is on quality and timeliness, not quantity. Red Wind Linehaul and FTL Courier Service offer contracts. Cargo delivery is fully implemented.\n\nCheckpoint: You know what Courier missions involve.",
        resources: [],
      },
      {
        id: "prof-transporter",
        title: "Transporter",
        description: "Passenger, vehicle, and data delivery. ITG.",
        text: "Transporters move passengers, vehicles, and data. GuideStar Taxi handles passenger delivery; Ling Family and Covalex handle vehicle delivery; FTL handles data. Implementation varies — check contracts in-game.\n\nCheckpoint: You know what Transporter missions involve.",
        resources: [],
      },
      {
        id: "prof-recovery",
        title: "Recovery Expert",
        description: "Recover lost or stranded cargo. ITG.",
        text: "Recovery experts locate and recover cargo from wrecked or stranded ships. Red Wind Linehaul offers recovery cargo missions. Fully implemented.\n\nCheckpoint: You know what Recovery Expert missions involve.",
        resources: [],
      },
      // Imperial Sports Federation — professions
      {
        id: "prof-racing-driver",
        title: "Racing Driver",
        description: "Ground vehicles: time trials, grand prix, death race. ISF.",
        text: "Racing drivers compete in ground vehicles: time trials, grand prix, and death race. Wildstar Racing and Incred!Fun Adventures run events. Murray Cup for ground racing. Implementation varies — check in-game and community guides.\n\nCheckpoint: You know what Racing Driver involves.",
        resources: [],
      },
      {
        id: "prof-racing-pilot",
        title: "Racing Pilot",
        description: "Ship racing: time trials, grand prix, death race. ISF.",
        text: "Racing pilots compete in ship races: time trials (Wildstar Racing, Incred!Fun Adventures), grand prix, and death race (Arena Commander). Murray Cup is the premier event. M50 and 350r are popular racing ships.\n\nCheckpoint: You know what Racing Pilot involves.",
        resources: [],
      },
      {
        id: "prof-marksman",
        title: "Marksman",
        description: "Target shooting, hunting, Star Marine. ISF.",
        text: "Marksmen compete in target shooting, hunting competitions, and Star Marine (Arena Commander). Nerf Arena and similar events exist. Check in-game and community guides for current events.\n\nCheckpoint: You know what Marksman involves.",
        resources: [],
      },
      {
        id: "prof-parkour",
        title: "Parkour Athlete",
        description: "Time trials and obstacle courses. ISF.",
        text: "Parkour athletes run time trials and obstacle courses. Incred!Fun Adventures runs events. On-foot movement and agility matter.\n\nCheckpoint: You know what Parkour Athlete involves.",
        resources: [],
      },
      {
        id: "prof-industrial-athlete",
        title: "Industrial Athlete",
        description: "Mining, cargo loading, salvage, repair competitions. ISF.",
        text: "Industrial athletes compete in mining, cargo loading, salvage, and repair — Cargolympics-style events. Gameplay is partially implemented; dedicated missions are in development.\n\nCheckpoint: You know what Industrial Athlete involves.",
        resources: [],
      },
      // The Council (criminal) — professions
      {
        id: "prof-criminal-fps",
        title: "Violent Criminal (FPS)",
        description: "Defend, kill, patrol, arson. The Council.",
        text: "Violent criminals on foot: defend locations, kill VIPs, patrol, rescue VIPs, recover items, destroy objects, arson. Headhunters, Dead Saints, Darkside Rovers, Drop Kings, and Otoni Syndicate offer contracts. Kill VIP and kill all are fully implemented. High risk; reputation and consequences are permanent.\n\nCheckpoint: You know what Violent Criminal (FPS) missions involve.",
        resources: [],
      },
      {
        id: "prof-criminal-ship",
        title: "Violent Criminal (Ship)",
        description: "Piracy, kill VIP, destroy. The Council.",
        text: "Violent criminals in ships: kill VIPs, kill all, destroy objects, patrol, defend, rescue. Vaughn, Headhunters, Horizon, and Drop Kings offer contracts. Kill VIP and kill all are fully implemented. Piracy targets cargo and ships. High risk.\n\nCheckpoint: You know what Violent Criminal (Ship) missions involve.",
        resources: [],
      },
      {
        id: "prof-council-operative",
        title: "Operative (Criminal)",
        description: "Access data, scan, disable, extract. The Council.",
        text: "Criminal operatives access data, investigate, scan areas and objects, disable objects, and extract items. Bit Zeros and Otoni Syndicate offer contracts. Access data, disable, and extract are fully implemented.\n\nCheckpoint: You know what Criminal Operative missions involve.",
        resources: [],
      },
      {
        id: "prof-organized-criminal",
        title: "Organized Criminal",
        description: "Bribe, intimidate, capture. The Council.",
        text: "Organized criminals bribe, intimidate, investigate VIPs, and capture targets. NovaRiders and Otoni Syndicate offer contracts. Implementation varies. High risk; reputation is permanent.\n\nCheckpoint: You know what Organized Criminal missions involve.",
        resources: [],
      },
      {
        id: "prof-smuggler",
        title: "Smuggler",
        description: "Illegal cargo, passenger, vehicle, data delivery. The Council.",
        text: "Smugglers move illegal cargo, passengers, vehicles, or data into or out of protected areas. Dead Saints offer cargo delivery — fully implemented. Avoid police scans; smugglers' compartments help. High risk.\n\nCheckpoint: You know what Smuggler missions involve.",
        resources: [],
      },
    ],
  },
];

/**
 * Recommended path: first steps (don't quit), then flying, then FPS, then professions.
 * Order is tuned for a new casual player: survival and one repeatable loop before combat.
 */
export const RECOMMENDED_LESSON_ORDER: string[] = [
  "first-1",
  "first-2",
  "first-3",
  "first-13",
  "first-5",
  "first-next",
  "flying-ac",
  "flying-1",
  "flying-2",
  "flying-coupled",
  "flying-settings",
  "flying-11",
  "flying-components",
  "flying-engineering",
  "df-1",
  "flying-3",
  "flying-4",
  "flying-5",
  "flying-6",
  "flying-7",
  "flying-8",
  "flying-9",
  "flying-10",
  "df-2",
  "df-3",
  "df-4",
  "df-5",
  "df-6",
  "df-7",
  "df-8",
  "fps-1",
  "fps-2",
  "fps-3",
  // Professions excluded — FYI only, no completion tracking for now
];

const FIRST_STEPS_IDS = ["first-1", "first-2", "first-3", "first-13", "first-5", "first-next"];
const FLYING_IDS = ["flying-ac", "flying-1", "flying-2", "flying-coupled", "flying-settings", "flying-11", "flying-components", "flying-engineering"];
const DOGFIGHTING_IDS = ["df-1", "flying-3", "flying-4", "flying-5", "flying-6", "flying-7", "flying-8", "flying-9", "flying-10", "df-2", "df-3", "df-4", "df-5", "df-6", "df-7", "df-8"];
const FPS_IDS = ["fps-1", "fps-2", "fps-3"];
const PROF_IDS = [
  "prof-0",
  "prof-hunter",
  "prof-explorer",
  "prof-researcher",
  "prof-sar",
  "prof-farmer",
  "prof-crafter-academy",
  "prof-1",
  "prof-2",
  "prof-salvager",
  "prof-repair",
  "prof-towing",
  "prof-refueler",
  "prof-fuel-gatherer",
  "prof-builder",
  "prof-crafter-urw",
  "prof-bounty",
  "prof-combat-pilot",
  "prof-operative",
  "prof-soldier",
  "prof-3",
  "prof-courier",
  "prof-transporter",
  "prof-hauler",
  "prof-recovery",
  "prof-racing-driver",
  "prof-racing-pilot",
  "prof-marksman",
  "prof-parkour",
  "prof-industrial-athlete",
  "prof-criminal-fps",
  "prof-criminal-ship",
  "prof-council-operative",
  "prof-organized-criminal",
  "prof-smuggler",
];

/** Section of a path (e.g. professions: Introduction, then each guild with its jobs). */
export interface PathSection {
  id: string;
  name: string;
  lessonIds: string[];
}

/** Learning paths: Getting started = do this first (so you don't quit). Other paths assume you've done it or are happy to jump in. */
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  lessonIds: string[];
  /** When set, left nav shows sub-categories (e.g. Introduction, then each guild with jobs). */
  sections?: PathSection[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "getting-started",
    name: "Getting started",
    description: "Orientation, setup, and systems — so you know what you're stepping into and can recover.",
    lessonIds: [...FIRST_STEPS_IDS],
  },
  {
    id: "flying",
    name: "Learning to fly",
    description: "HUD, basic controls, coupled vs decoupled, understanding your ship. No combat.",
    lessonIds: [...FLYING_IDS],
  },
  {
    id: "dogfighting",
    name: "Dogfighting",
    description: "Ship-v-ship PvP: roll/pitch, drills, evasion, merge, pip, speed walls, Arena Commander.",
    lessonIds: [...DOGFIGHTING_IDS],
  },
  {
    id: "fps",
    name: "Ground combat",
    description: "Weapons, bunkers, and PvE.",
    lessonIds: [...FPS_IDS],
  },
  {
    id: "professions",
    name: "Professions",
    description: "The six guilds and their jobs — mining, refining, trading, and more.",
    lessonIds: [...PROF_IDS],
    sections: [
      { id: "intro", name: "Introduction", lessonIds: ["prof-0"] },
      {
        id: "academy",
        name: "Academy of Science",
        lessonIds: ["prof-hunter", "prof-explorer", "prof-researcher", "prof-sar", "prof-farmer", "prof-crafter-academy"],
      },
      {
        id: "urw",
        name: "United Resource Workers",
        lessonIds: ["prof-1", "prof-2", "prof-salvager", "prof-repair", "prof-towing", "prof-refueler", "prof-fuel-gatherer", "prof-builder", "prof-crafter-urw"],
      },
      {
        id: "mercenary",
        name: "Mercenary Guild",
        lessonIds: ["prof-bounty", "prof-combat-pilot", "prof-operative", "prof-soldier"],
      },
      {
        id: "transport",
        name: "Interstellar Transport Guild",
        lessonIds: ["prof-3", "prof-courier", "prof-transporter", "prof-hauler", "prof-recovery"],
      },
      {
        id: "sports",
        name: "Imperial Sports Federation",
        lessonIds: ["prof-racing-driver", "prof-racing-pilot", "prof-marksman", "prof-parkour", "prof-industrial-athlete"],
      },
      {
        id: "council",
        name: "The Council",
        lessonIds: ["prof-criminal-fps", "prof-criminal-ship", "prof-council-operative", "prof-organized-criminal", "prof-smuggler"],
      },
    ],
  },
];

export function getPathLessonOrder(pathId: string): string[] {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  return path?.lessonIds ?? LEARNING_PATHS[0].lessonIds;
}

/** Badges earned by completing classes. */
export interface Badge {
  id: string;
  name: string;
  description: string;
  flavour: string;
  icon: string;
  /** Category to complete to earn this badge; null = graduate (all lessons). */
  categoryId: string | null;
  /** When set, use this path's lessonIds instead of category. For badges tied to a specific path (e.g. Getting started). */
  pathId?: string;
}

export const BADGES: Badge[] = [
  {
    id: "survival-ready",
    name: "Getting Started",
    icon: "Shield",
    description: "Completed Getting started",
    flavour: "You know what you're stepping into and how to recover. Most people quit before this point.",
    categoryId: "first-steps",
    pathId: "getting-started",
  },
  {
    id: "pilot",
    name: "Pilot",
    icon: "Rocket",
    description: "Completed Learning to fly",
    flavour: "You understand 6DOF, decoupled, pip control, and boost management. You can hold your own.",
    categoryId: "flying",
  },
  {
    id: "dogfighter",
    name: "Dogfighter",
    icon: "Swords",
    description: "Completed Dogfighting",
    flavour: "Merge discipline, rate fights, wing fights. You practice in AC and take it to the verse.",
    categoryId: "dogfighting",
  },
  {
    id: "ground-ops",
    name: "Ground Ops",
    icon: "Crosshair",
    description: "Completed FPS & PvE",
    flavour: "Bunkers cleared, gear managed, missions completed. You fight on the ground with confidence.",
    categoryId: "fps",
  },
  // Professional badge excluded — professions are FYI only, no completion for now
  {
    id: "graduate",
    name: "Basic Training Graduate",
    icon: "GraduationCap",
    description: "Completed all classes",
    flavour: "Every lesson done. You're not a beginner any more. Now go make the verse your own.",
    categoryId: null,
  },
];

export function getEarnedBadges(completedIds: string[]): Badge[] {
  const completedSet = new Set(completedIds);
  const totalRequired = getTotalLessonCount();

  return BADGES.filter((badge) => {
    if (badge.categoryId === null) {
      return completedSet.size === totalRequired && RECOMMENDED_LESSON_ORDER.every((id) => completedSet.has(id));
    }
    const lessonIds = badge.pathId
      ? LEARNING_PATHS.find((p) => p.id === badge.pathId)?.lessonIds
      : BASIC_TRAINING_CATEGORIES.find((c) => c.id === badge.categoryId)?.lessons.map((l) => l.id);
    if (!lessonIds) return false;
    return lessonIds.every((id) => completedSet.has(id));
  });
}

export interface BadgeProgress {
  badge: Badge;
  earned: boolean;
  completed: number;
  total: number;
  remaining: number;
}

export function getBadgeProgress(completedIds: string[]): BadgeProgress[] {
  const completedSet = new Set(completedIds);
  return BADGES.map((badge) => {
    if (badge.categoryId === null) {
      const total = getTotalLessonCount();
      const completed = RECOMMENDED_LESSON_ORDER.filter((id) => completedSet.has(id)).length;
      return { badge, earned: completed === total, completed, total, remaining: total - completed };
    }
    const lessonIds = badge.pathId
      ? LEARNING_PATHS.find((p) => p.id === badge.pathId)?.lessonIds
      : BASIC_TRAINING_CATEGORIES.find((c) => c.id === badge.categoryId)?.lessons.map((l) => l.id);
    if (!lessonIds) return { badge, earned: false, completed: 0, total: 0, remaining: 0 };
    const completed = lessonIds.filter((id) => completedSet.has(id)).length;
    const total = lessonIds.length;
    return { badge, earned: completed === total, completed, total, remaining: total - completed };
  });
}

const PROGRESS_KEY = "undisputed-noobs-basic-training-progress";

export interface TrainingProgress {
  completedIds: string[];
  selectedPathId?: string;
  selectedLessonId?: string;
}

export function loadProgress(): TrainingProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { completedIds: [] };
    const parsed = JSON.parse(raw) as TrainingProgress;
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      selectedPathId: typeof parsed.selectedPathId === "string" ? parsed.selectedPathId : undefined,
      selectedLessonId: typeof parsed.selectedLessonId === "string" ? parsed.selectedLessonId : undefined,
    };
  } catch {
    return { completedIds: [] };
  }
}

export function saveProgress(progress: TrainingProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function getTotalLessonCount(): number {
  return RECOMMENDED_LESSON_ORDER.length;
}

/** All lessons for a path, in order, with step number (1-based), category title and icon. */
export function getLessonsInOrder(pathId: string = "getting-started"): {
  step: number;
  lesson: Lesson;
  categoryTitle: string;
  categoryIcon: string;
}[] {
  const order = getPathLessonOrder(pathId);
  const byId = new Map<
    string,
    { lesson: Lesson; categoryTitle: string; categoryIcon: string }
  >();
  for (const cat of BASIC_TRAINING_CATEGORIES) {
    for (const lesson of cat.lessons) {
      byId.set(lesson.id, {
        lesson,
        categoryTitle: cat.title,
        categoryIcon: cat.icon,
      });
    }
  }
  return order.map((id, i) => {
    const entry = byId.get(id);
    return entry
      ? {
          step: i + 1,
          lesson: entry.lesson,
          categoryTitle: entry.categoryTitle,
          categoryIcon: entry.categoryIcon,
        }
      : null;
  }).filter(
    (x): x is { step: number; lesson: Lesson; categoryTitle: string; categoryIcon: string } =>
      x !== null
  );
}
