---
name: Training Dogfighting folder
overview: "Create a Training/Dogfighting folder with numbered markdown files: 0 (introduction) and 1–12 (lessons in order), aligned with the 12-lesson dogfighting path from the restructure plan."
todos: []
isProject: false
---

# Training / Dogfighting folder with numbered lessons

## What we're doing

- Add a **Training/Dogfighting** folder and 13 markdown files: **0** (introduction) and **1–12** (lessons in order).
- Use the 12-lesson structure from the [dogfighting path restructure plan](dogfighting-path-restructure-plan.md): Block A (in-ship) → Block B (drills) → Block C (theory) → Block D (stages).

## Location

- **Path:** [apps/landing/public/Training/Dogfighting/](../apps/landing/public/Training/Dogfighting/)
- **Reason:** Under `public/` so files are served statically and can be linked (e.g. `/Training/Dogfighting/0.md`). Keeps content with the landing app.

## File layout

| File      | Content                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------- |
| **0.md**  | Introduction — what dogfighting is, why this path, high-level flow (in-ship → drills → theory → stages). |
| **1.md**  | Why dogfighting (df-1)                                                                                   |
| **2.md**  | Basic controls (df-2)                                                                                    |
| **3.md**  | Learning the HUD (df-3)                                                                                  |
| **4.md**  | Settings that matter (df-4)                                                                              |
| **5.md**  | Decoupled and the brake (df-5)                                                                           |
| **6.md**  | Drill: Orbit a fixed target (df-6)                                                                       |
| **7.md**  | Drill: Tracking (df-7)                                                                                   |
| **8.md**  | Stages of a fight and key terms (df-8)                                                                   |
| **9.md**  | The merge (df-9)                                                                                         |
| **10.md** | The turning duel and evasion (df-10)                                                                     |
| **11.md** | Disengage (df-11)                                                                                        |
| **12.md** | Multi-target and countermeasures (df-12)                                                                 |

Numbering: **0** = introduction; **1–12** = lessons in order (no "0." in filenames; the numbers are the file names).

## Content approach

- **0.md:** Short intro (2–3 paragraphs): PvP ship combat, Arena Commander vs PU, and the four blocks (in-ship, drills, theory, stages). No jargon dump.
- **1.md–12.md:** Each file has a clear title (matching the plan) and a short outline or placeholder. Option A: title + "Content to be written" or a 2–3 bullet outline. Option B: copy/adapt text from [basicTraining.ts](../apps/landing/src/data/basicTraining.ts) dogfighting lessons and the plan so the markdown files are the source of truth. Recommend **Option B** for 1–8 (map existing + plan titles) and outline/placeholder for 9–12 until full copy is written; alternatively do outlines only and fill copy in a follow-up.

## Implementation steps

1. Create directory `apps/landing/public/Training/Dogfighting/`.
2. Add **0.md** with introduction text (our own wording, no external refs).
3. Add **1.md** through **12.md** with the lesson titles from the plan and either outline placeholders or full lesson copy (see content approach above).
4. No changes to [basicTraining.ts](../apps/landing/src/data/basicTraining.ts) or the UI in this task unless you also want the app to link to these files (e.g. "Read full lesson" → `/Training/Dogfighting/3.md`); that can be a separate step.

## Optional follow-up

- Wire the Basic Training UI to open or link to these markdown files (e.g. by lesson index or a new `markdownUrl` field).
- Sync or replace lesson `text` in `basicTraining.ts` with the content of these files so one source of truth lives in the folder.
