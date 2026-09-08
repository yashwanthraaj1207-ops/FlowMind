# FlowMind — Productivity Intelligence System
> **iQOO Hackathon 2026 — Productivity Track**
> An AI-driven contextual productivity intelligence system designed on the core principle:
> *"The same application can be productive or distracting depending on the user's current intention and workflow context."*

---

## 🚀 Key Features & Pipeline

FlowMind operates across the 6-stage intelligence pipeline:
$$\textbf{Observe} \longrightarrow \textbf{Understand} \longrightarrow \textbf{Detect} \longrightarrow \textbf{Intervene} \longrightarrow \textbf{Recommend} \longrightarrow \textbf{Measure}$$

1. **Dual Telemetry Observation (Observe)**:
   - **Real Desktop Telemetry**: Electron desktop shell observes active foreground OS windows (`VS Code`, `Google Chrome`, `Terminal`, `Spotify`, `Discord`, etc.) and real context switch transitions.
   - **Demo Simulation Telemetry**: Deterministic scenario engine (Scenarios A, B, C, D) for guaranteed, reproducible demonstrations.
2. **Context-Aware Productivity Leak Engine (Understand & Detect)**:
   - Evaluates activities against current Flow Mode and user intentions.
   - Evidence-weighted **Detection Confidence** calculation (not hardcoded).
   - Zero distraction penalty for entertainment applications in Entertainment Mode.
3. **Context-Aware Focus Barrier (Intervene)**:
   - Non-blocking 3–5 minute countdown barrier with 10× prototype acceleration, user override (*"Continue Anyway"*), and 60-second anti-spam cooldown.
4. **Intelligent Recommendations Layer (Recommend)**:
   - Explainable coaching breakdowns (*What happened / Why it matters / Suggested next step / Evidence breakdown*).
5. **Flow Analytics & Impact Engine (Measure)**:
   - Dynamic **Workflow Efficiency Score (0–100)**, **Focus Consistency (0–100%)**, Time Distribution, and Before/After Impact metrics computed from actual telemetry.
6. **Privacy-First On-Device Architecture**:
   - 100% Local processing. Zero page content or keystrokes captured. Zero external API calls or AI cloud keys required.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ / npm
- Windows 10/11 (for native Win32 P/Invoke foreground window tracking in Electron)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Desktop Application (Electron + Vite)
```bash
npm run electron:dev
```
*This starts the Vite dev server and opens the FlowMind Electron desktop application.*

### Alternative: Run as Browser Web App (Localhost)
```bash
npm run dev
```
*Access at:* `http://localhost:5173`

---

## 🧪 Testing & Verification

Run the automated test suites validating all intelligence engines:
```bash
npm test
```
*Executes 33 tests across:*
1. `ProductivityLeakEngine` Validation
2. `FocusBarrierService` Validation
3. `RecommendationEngine` Validation
4. `AnalyticsEngine` Validation

Build production bundle:
```bash
npm run build
```

---

## 🎯 Hackathon Demonstration Procedures

### Demo Scenario 1: Real Desktop Telemetry (Electron)
1. Launch via `npm run electron:dev`.
2. Select **Study Mode** and set goal: `Complete Java Assignment`.
3. Click **Start Focus Session**.
4. In the telemetry panel, select **REAL DESKTOP**. Status will display: `● DESKTOP TELEMETRY ACTIVE`.
5. Alt-Tab / switch between **VS Code**, **Google Chrome** (viewing Java docs), **WhatsApp**, and **Instagram**.
6. Observe real-time desktop window transitions, switch count increments, focus duration tracking, and dynamic leak alerts.
7. Click **Pause Session** $\to$ Desktop observation stops immediately (`○ DESKTOP TELEMETRY OFF`).

### Demo Scenario 2: Guaranteed Demo Simulation Mode
1. On the Session page, toggle to **DEMO SIMULATION**.
2. Select **Scenario B (Study With Productivity Leak)** at `2×` or `4×` speed.
3. Click **Start Simulation**.
4. Watch the deterministic pipeline:
   - `VS Code` $\to$ `Chrome` $\to$ `Java Docs` (*Goal Relevant*)
   - `WhatsApp` (*Context Interruption*)
   - `Instagram Reels` (*Potential Leak with 80% Detection Confidence*)
   - Triggers Focus Barrier $\to$ surfaces *"Return to Complete Java Assignment"* recommendation $\to$ updates real-time analytics.

### Demo Scenario 3: Contextual Relativity (Guilt-Free Entertainment)
1. Switch to **Entertainment Mode**.
2. Run Scenario C (Entertainment Flow) or open YouTube/Instagram on your desktop.
3. Notice that YouTube and Instagram receive **zero distraction penalty** and are classified as *Contextually Appropriate* ($100/100$ efficiency).

---

## 🔒 Known OS Notes & Privacy Assurances
- **Privacy Assurance**: Telemetry collection is restricted strictly to active window process names and window titles. FlowMind never captures keystrokes, form inputs, passwords, or document contents.
- **Session-Bound Observation**: Desktop window observation runs exclusively while a user's focus session is in the `running` state. Observation terminates automatically on `pause`, `end`, or `reset`.
- **Operating System Compatibility**: Native foreground window tracking utilizes Windows Win32 P/Invoke APIs via PowerShell background child process. On macOS/Linux, browser simulation mode operates as the cross-platform demonstration environment.
