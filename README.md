# StadiumFlow AI — FIFA World Cup 2026 Smart Stadium Operations & Navigation

StadiumFlow AI is a secure, highly accessible, and resilient GenAI-enabled command shell designed to optimize venue operations and elevate the tournament experience for fans, volunteers, on-ground staff, and emergency dispatchers at the FIFA World Cup 2026.

This platform combines **deterministic pathfinding and crowd telemetry** with **grounded Generative AI assistance** to coordinate crowd control, step-free emergency routing, and multilingual assistance in real time.

---

## 📸 Interface Screenshots

Humare premium UI design aur dynamic theme options (Light / Dark Mode) ke screenshots:

| Landing Portal | Operations Console |
| :---: | :---: |
| ![Landing Page](/public/screenshots/landing.png) | ![Operations Dashboard](/public/screenshots/operations.png) |

| Smart Routing | AI Copilot Hub |
| :---: | :---: |
| ![Smart Navigation](/public/screenshots/navigation.png) | ![Copilot Assistant](/public/screenshots/assistant.png) |

---

## 🛠️ Key Product Features

### 1. Operations Command Center (HQ)
*   **Concentric Seating Bowl Visualizer:** Replaces abstract boxes with a curved concentric SVG stadium bowl layout. It maps seats inside Gate entrances, VIP suites, lower and upper stands, and public plazas.
*   **Real-time Seating Telemetry:** Renders small seat dots that dynamically color-code based on simulated load metrics (Green for Vacant, Yellow/Orange/Red for occupied & congested states).
*   **Accessible Seating Indicators (`♿`):** Highlights designated step-free, wheelchair-friendly seats in public plazas, lower VIP boxes, and entry gates.
*   **Dispatcher Escalations & AI Briefs:** Integrates a real-time incident queue. Selecting an alert generates a grounded AI severity briefing and an interactive action checklist (e.g., dispatching volunteers, initiating detours).

### 2. Smart Crowd-Aware Navigation
*   **Deterministic Dijkstra Router:** Computes the fastest walking paths between POIs (Gates, Stand sections, Restrooms, First-Aid stations, Transit Plazas) in `O(V log V + E)`.
*   **Accessibility Constraints:** Selecting the **Step-Free** filter dynamically bypasses stairs-only walkways, routing elderly and disabled fans exclusively through ramps, elevators, and step-free plazas.
*   **Congestion Avoidance Detours:** Automatically recalculates paths to divert fans away from active bottlenecks, applying a mathematical penalty multiplier to congested edges.

### 3. Volunteer & Fan Copilot Hub
*   **Multilingual GenAI Chat:** Supports full conversations in **English**, **Español**, and **Hinglish (Roman Hindi)**.
*   **Grounded RAG Queries:** Prompts are injected with structured live system data (active POI states, closed zones, unresolved incidents) to guarantee zero hallucinations.
*   **Resilient Offline Fallback:** If the Gemini API key is missing or calls time out, the system degrades to a local, rules-based dictionary matcher, keeping the UI fully interactive.

---

## 🏗️ Architecture & Data Flow

```mermaid
graph TD
    A[UI Layout Shell] -->|User Actions / Theme Toggle| B[StadiumContext State]
    B -->|Navigation Settings| C[Dijkstra Pathfinding Engine]
    B -->|Occupancy Sliders| D[Concentric Seating Bowl SVG]
    B -->|User Chat Prompt| E[Next.js API route: /api/ai/copilot]
    E -->|IP Rate Limiter| F{API Key & Network OK?}
    F -->|Yes| G[Grounded Gemini SDK Adapter]
    F -->|No / Timeout| H[Deterministic Fallback Engine]
    G -->|Structured JSON Response| I[User Interface Chat Bubble]
    H -->|Local QA Template Match| I
```



## 💻 CLI Commands & Development

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Run Quality Verification Pipeline
Executes linter, TypeScript check, unit tests, and production build:
```bash
npm run verify
```

### 4. Run Unit Tests & Coverage
```bash
# Run tests once
npm run test

# Run tests with HTML coverage report
npm run test:coverage
```

### 5. Run Automated E2E Tests
```bash
# Installs browsers if running for the first time
npx playwright install

# Run E2E tests
npm run test:e2e
```
