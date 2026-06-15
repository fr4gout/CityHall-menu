# Cursor Task: DMV Terminal & Driver Certification Integration

This task outlines the step-by-step implementation of the **DMV Terminal / Government Driver Certification Terminal** inside the City Hall NUI. The layout and styles must strictly align with the obsidian glassmorphism theme and preserve all branding logos.

---

## 🎨 Theme Guidelines Checklist
All code written must adhere to these CSS variables from [theme_guidelines.md](file:///g:/Dev%20work/city-hall-menu/.cursor/theme_guidelines.md):
- **Shell Background**: `var(--bg-panel)` for large outer containers.
- **Card Background**: `var(--bg-surface)` for cards, widgets, inputs.
- **Row Overlays**: `var(--bg-row)` and `var(--bg-row-alt)` for lists and grid items.
- **Borders**: `var(--bd)` (default), `var(--bd-strong)` (hover), `var(--bd-primary)` (active accent).
- **Primary Accent / Glow**: `var(--primary)`, `var(--primary-08)`, `var(--primary-15)`, `var(--primary-30)`.
- **Text Hierarchy**: `var(--tx)` (headers, highlights), `var(--tx-2)` (subtitles, metrics), `var(--tx-3)` (disabled).
- **Status Colors**: `var(--c-green)` (Clean standing, passed, correct), `var(--c-orange)` (warning, pending), `var(--c-red)` (suspended, failed, wrong, clear record).

*CRITICAL constraint: Do NOT hardcode colors. Do NOT use standard Tailwind colors like `bg-zinc-800` or `text-slate-400` on layout blocks.*

---

## 🛠️ Step-by-Step Implementation

### Step 1: Extend Player Zustand Store
Update [usePlayerStore.ts](file:///g:/Dev%20work/city-hall-menu/src/store/usePlayerStore.ts) to manage the DMV data dynamically so the interactive widgets are fully responsive.

1. **Add Interface Declarations** for the DMV records:
   ```typescript
   export interface Violation {
     id: string;
     name: string;
     points: number;
     date: string;
     location: string;
   }

   export interface DMVRecord {
     points: number;
     standing: "clean" | "warning" | "risk" | "suspended";
     violations: Violation[];
     expiryDays: number;
     expiryDate: string;
   }
   ```
2. **Add DMV fields and actions** to the `PlayerState` store interface:
   ```typescript
   dmvRecord: DMVRecord;
   addViolation: (violation: Omit<Violation, "id">) => void;
   expungeViolation: (id: string) => void;
   clearRecord: () => void;
   renewLicense: () => void;
   ```
3. **Implement actions** inside `usePlayerStore`:
   - Initialize `dmvRecord` with default values:
     - `points`: 3
     - `standing`: `"clean"`
     - `expiryDays`: 1161
     - `expiryDate`: `"2029-08-19"`
     - `violations`:
       1. `{ id: "v-1", name: "Speeding", points: 2, date: "2026-04-12", location: "MIRROR PARK BLVD" }`
       2. `{ id: "v-2", name: "Harsh Braking", points: 1, date: "2026-05-02", location: "VINEWOOD HILLS" }`
   - Recalculate standing whenever points update:
     - 0–3 points: `"clean"` (Badge color: `var(--c-green)`)
     - 4–6 points: `"warning"` (Badge color: `var(--c-orange)`)
     - 7–11 points: `"risk"` (Badge color: `var(--c-purple)`)
     - 12+ points: `"suspended"` (Badge color: `var(--c-red)`)

---

### Step 2: Register Router Path & Sidebar Tab
1. **Add Link node** to the sidebar navigation in [Sidebar.tsx](file:///g:/Dev%20work/city-hall-menu/src/components/layout/Sidebar.tsx):
   - Import `Car` from `lucide-react` (or re-use `ShieldAlert` if preferred).
   - Insert navigation node:
     ```typescript
     { to: "/dmv", label: "DMV Terminal", icon: Car }
     ```
   - Update `NavItem` route unions to include `"/dmv"`.

---

### Step 3: Create Driver License Card component
Create `src/components/cards/DriverLicenseCard.tsx` following the structure of `IDCardPreview.tsx`:
- Render as a `.glass-card` with `glow-primary` shadow.
- Implement mouse-move tracking for a **3D tilt effect** using `framer-motion` (identical to ID Card).
- Left side: Circular biometric scanner wireframe portrait (SVG).
- Right side: Name, Citizen ID, License Class (e.g. Class C), Issue Date, Expiry Date.
- Footer: "Signature" and "SA-DMV / DRV-LIC".
- Header banner: "SAN ANDREAS — DRIVER LICENSE" and a status badge mapped to the player's DMV standing.

---

### Step 4: Create Segmented Progress Bar
Create `src/components/ui/SegmentedProgressBar.tsx`:
- Needs 4 visually distinct blocks with text labels below: "CLEAN", "WARNING", "RISK", "SUSPENDED".
- Current points display (e.g., `3 / 12` points).
- Render a segment-container dividing the range:
  - Clean segment (representing 3 points, color: `var(--c-green)`)
  - Warning segment (representing 3 points, color: `var(--c-orange)`)
  - Risk segment (representing 5 points, color: `var(--c-purple)`)
  - Suspended segment (representing 1 point, color: `var(--c-red)`)
- Fill the blocks dynamically depending on the current point count. If points is 3, fill the first block green. If points is 5, fill the first block green, and part of the second block orange.

---

### Step 5: Implement DMV Screen Router
Create `src/routes/dmv.tsx`. It will manage four active views via a state switcher `activeView: "dashboard" | "record" | "theory" | "practical"` to ensure seamless instant rendering:

#### View A: DMV Dashboard (`"dashboard"`)
- **Left Column**:
  - Title: "Government Driver Certification Terminal"
  - Subtitle description.
  - `<DriverLicenseCard />`
  - Quick action buttons (re-use `<NeonButton>`):
    - **Theory Examination**: "Multi-format certification quiz with timer and live scoring." (Triggers `activeView = "theory"`)
    - **Practical Evaluation**: "Live driving HUD: instructions, violations, route checkpoints." (Triggers `activeView = "practical"`)
    - **License Record**: "View points, violations and renewal status." (Triggers `activeView = "record"`)
- **Right Column** (`<GlassCard>`):
  - **License Standing**: Status Badge (e.g., "Clean Driver" in green).
  - **Violation Points**: Renders point progress (e.g. 3/12 points) and the `<SegmentedProgressBar />`.
  - **Recent Violations**: Shows the last 2-3 violations in the store. Each infraction should display a small "+X [infraction name]" badge, date, location, and a clickable `EXPUNGE` button.
  - Link button: "FULL RECORD ->" (Triggers `activeView = "record"`)

#### View B: License Record (`"record"`)
- Back button: `<- BACK TO DASHBOARD` (returns to dashboard view)
- **Left Column**:
  - Title: "Driver Profile / LICENSE RECORD"
  - `<DriverLicenseCard />`
  - "VIOLATION HISTORY" list: Full table/list of all violations in the Zustand store. If empty, show "No active violations on record." Otherwise, show each violation with infraction name, date, location, points, and an `EXPUNGE` button.
- **Right Column**:
  - Points & Standing widget (with segmented progress bar).
  - **RENEWAL STATUS**: Shows days until expiry, expiry date, and a "SCHEDULE RENEWAL" button. (Clicking it resets expiryDays to 1161 and expiryDate to 5 years from now).
  - **SIMULATE CITATION** panel:
    - Button row/grid to add mock infractions for testing:
      - `+2 SPEEDING`
      - `+3 RAN RED LIGHT`
      - `+4 RECKLESS DRIVING`
      - `+3 VEHICLE COLLISION`
      - `+3 FLYING VIOLATION`
      - `+2 POLICE CITATION`
      - `+1 HARSH BRAKING`
    - Red button: `CLEAR RECORD` (runs `clearRecord()` action).

#### View C: Theory Examination (`"theory"`)
Maintained inside `dmv.tsx` under a multi-step quiz state:
1. **Introduction Panel**:
   - Title: "Driver Theory Examination"
   - Text description: "Eight randomized questions across signs, scenarios, hazard perception and traffic law. Pass mark 75%. Timer: 4 minutes."
   - Stats grid: Questions: 8, Time: 4:00, Pass: 75%.
   - Button: `BEGIN EXAMINATION ->` (resets quiz counters, starts a 4-minute countdown timer, select 8 random questions, sets step to `active`).
2. **Active Exam Panel**:
   - Header progress HUD:
     - Question index (e.g., `1 / 8`)
     - Count-down timer (formatted as `MM:SS`, e.g., `03:57`)
     - Mistakes count (starts at 0)
     - Live Score (percentage: correct/current)
   - Question Body:
     - Shows current question category (e.g. `EMERGENCY VEHICLES`) and question text.
     - Option list buttons (e.g. "A. True", "B. False"). Keyboard hotkeys 1-4 should select options.
     - Pressing "Enter" or clicking `NEXT ->` advances to the next question.
3. **Result Panel**:
   - Large glowing badge: `PASSED` (green glow, score >= 75%) or `FAILED` (red glow, score < 75%).
   - Metrics grid: Score %, Correct answers, Mistakes made, Pass Mark (75%).
   - **QUESTION BREAKDOWN** list:
     - Shows a list of the 8 questions taken during the exam.
     - Next to each question, display `CORRECT` (green text) or `WRONG` (red text).
   - Helper label:
     - If failed: "Examination not passed. A failed-test point has been added to your license record." (Proactively adds a +1 Harsh/Theory violation to player's record).
     - If passed: "Examination passed! You are now certified."
   - Buttons: `RETAKE` and `REVIEW LICENSE ->` (takes them back to profile/record view).

#### View D: Practical Driving Evaluation (`"practical"`)
Maintained inside `dmv.tsx` under a driving test state machine:
1. **Introduction Panel** (Certification Module 02):
   - Title: "Practical Driving Evaluation"
   - Description: "A simulated road test with live HUD overlay. The examiner will issue instructions, monitor your speed and braking, and dock points for any traffic violations."
   - Bullet points list:
     - Real-time examiner instructions
     - Six route checkpoints
     - Speed limit and braking detection
     - Live driving score and license points
   - Glowing orange outline button: `START PRACTICAL ->` (resets test state, transitions to active HUD).
2. **Active Driving HUD Simulator**:
   - Main screen area representing the dashboard visual telemetry:
     - **Perspective Road**: A trapezoidal SVG path representing yellow lane boundaries extending to a horizon center point, giving a simulated forward-moving road illusion.
     - **Telemetry Visualizer**: Animated gray spectrum/soundwave frequency bars that bounce dynamically.
     - Text overlay in the center: `"LIVE VEHICLE TELEMETRY"` in `var(--tx-2)`.
   - **Top-Left Examiner Card**:
     - Header badge: `"• EXAMINER"` (orange bullet).
     - Instruction: The current instruction text mapped to the active checkpoint.
     - Status subtitle: `> [Examiner message]` (e.g., "Examiner Hayes seated. Begin when ready.").
   - **Top-Right Route Progress Card**:
     - Metrics: `"ROUTE PROGRESS: CP X / 6"`, `"REMAINING: Y.Y mi"`.
     - Segmented progress bar showing CP slots.
     - Subtext: `"X% COMPLETE"`, `"AUTO-TRACKED"`.
     - Button: `"END TEST"` with a red outline (`var(--c-red)`).
   - **Bottom Telemetry Bar**:
     - **Speed Box**: Large digital speedometer value in mph. Red ring indicator displaying the active Speed Limit (e.g., `35`, `45`, `65`).
     - **Vehicle Damage Box**: Horizontal progress bar showing damage (starts at `0%`).
     - **Driving Score Box**: Shows current driving score (starts at `100`), mistakes counter, and active license points penalty.
   - **Simulated Test Loop Engine**:
     - Run a React `useEffect` interval (e.g. updating every 100ms) when the active HUD starts.
     - The simulation progresses automatically through 6 checkpoints over a 30-40 second sequence:
       - **CP 0 (Speed Limit 35)**: "Pull out of the DMV lot and merge with traffic." (Remaining: 4.2 mi)
       - **CP 1 (Speed Limit 40)**: "Turn right onto Vinewood Boulevard." (Remaining: 3.5 mi)
       - **CP 2 (Speed Limit 45)**: "Maintain safe distance behind the lead vehicle." (Remaining: 2.8 mi)
       - **CP 3 (Speed Limit 15)**: "Speed restriction zone. Slow down for speed bump." (Remaining: 1.9 mi)
       - **CP 4 (Speed Limit 65)**: "Enter the freeway and accelerate to match traffic speed." (Remaining: 1.1 mi)
       - **CP 5 (Speed Limit 35)**: "Exit freeway and return to DMV parking lot." (Remaining: 0.4 mi)
       - **CP 6 (Speed Limit 15)**: "Align vehicle in designated bay and turn off engine." (Remaining: 0.0 mi)
     - Speed should oscillate naturally around the target speed limit.
     - **Mock Obstacle Warning Event**: At CP 3, trigger a mock warning. If speed is not reduced to < 15 mph in 4 seconds, increment mistakes by 1, reduce driving score to 92, increment license points penalty by 2, and play a warning audio beep/visual alert.
     - If the player clicks "END TEST", transition immediately to the Result panel.
3. **Result Panel**:
   - Header badge: Large green glow `LICENSE ISSUED` (if score >= 75) or red glow `TEST FAILED` (if score < 75).
   - Stats row:
     - FINAL SCORE (e.g., 92)
     - MISTAKES count (e.g., 1)
     - POINTS ADDED (e.g., +2 points to license record as penalty if mistakes occurred).
   - Bottom confirmation text: "Congratulations. Your practical certification has been added to your license record."
   - If passed, update the user's driving license status in the Zustand store to `"active"`!
   - Buttons: `RETAKE` and `VIEW RECORD ->`.

---


## 📝 Mock Quiz Questions Data
Store this array of questions in your router file or a separate mock file:
```typescript
const quizQuestions = [
  {
    category: "EMERGENCY VEHICLES",
    question: "You must always yield to emergency vehicles using sirens or lights.",
    options: ["True", "False"],
    correctAnswer: 0
  },
  {
    category: "SPEED LIMITS",
    question: "What is the maximum speed limit in a residential area unless posted otherwise?",
    options: ["25 mph", "35 mph", "45 mph", "55 mph"],
    correctAnswer: 0
  },
  {
    category: "TRAFFIC SCENARIOS",
    question: "A police officer signals you to pull over while you are on a busy highway. What do you do?",
    options: [
      "Accelerate to find a fast exit",
      "Stop immediately in the driving lane",
      "Signal and pull over to the right shoulder safely",
      "Drive to the nearest police station"
    ],
    correctAnswer: 2
  },
  {
    category: "ROAD RULES",
    question: "When approaching a four-way stop at the same time as another vehicle, who has the right of way?",
    options: [
      "The vehicle on the left",
      "The vehicle on the right",
      "The faster vehicle",
      "Whichever vehicle sounds their horn first"
    ],
    correctAnswer: 1
  },
  {
    category: "ROAD SIGNS",
    question: "What action is required when approaching a red octagonal STOP sign?",
    options: [
      "Slow down and roll through if the road is clear",
      "Sound your horn and proceed",
      "Come to a complete stop behind the line",
      "Accelerate to clear the intersection quickly"
    ],
    correctAnswer: 2
  },
  {
    category: "SAFETY",
    question: "It is legal to use a handheld phone while driving in a school zone.",
    options: ["True", "False"],
    correctAnswer: 1
  },
  {
    category: "WEATHER CONDITIONS",
    question: "Hydroplaning is more likely to occur at higher speeds on wet roads.",
    options: ["True", "False"],
    correctAnswer: 0
  },
  {
    category: "ALCOHOL LIMITS",
    question: "The legal blood alcohol concentration (BAC) limit for commercial drivers is lower than for passenger drivers.",
    options: ["True", "False"],
    correctAnswer: 0
  }
];
```

---

## 🔍 Validation Checklist
1. Run `npm run build` to confirm TypeScript compiles clean.
2. Run `npm run lint` to guarantee ESLint checks pass.
3. Verify the DMV layouts scale down gracefully on viewport sizing.
4. Verify keyboard hotkeys work properly during the theory exam quiz state.
5. Check that simulation actions update the database/store state and the UI updates in real-time.
