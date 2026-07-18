# StadiumFlow AI — Architecture

## 1. Architecture Principles
- Deterministic systems own facts and safety-critical calculations.
- GenAI explains, structures and communicates verified context.
- Every external input is validated.
- Every AI output is treated as untrusted until schema validation.
- The app works in deterministic demo mode without AI/cloud dependencies.
- Architecture must be testable by design.

## 2. Recommended Stack
- Framework: Next.js App Router + React + TypeScript strict
- Styling: Tailwind CSS
- Accessible primitives: Radix UI or equivalent headless accessible primitives
- Validation: Zod
- Charts: Recharts or a lightweight equivalent, always with text/table alternatives
- AI: Gemini server-side through a provider abstraction
- Data: repository abstraction with in-memory demo adapter; optional Firestore/PostgreSQL production adapter
- Auth: optional for public fan experience; protected operator portal using a proven auth provider if implemented
- Unit/integration: Vitest + Testing Library
- Accessibility: vitest-axe + axe in Playwright
- E2E: Playwright
- CI: GitHub Actions
- Deployment: platform compatible with Next.js; Docker if required

Do not add infrastructure merely to look complex. Every dependency must earn its place.

## 3. Logical Architecture

Browser
  -> Fan Experience
  -> Operations Command Center
  -> Accessible Navigation
  -> Multilingual Copilot
        |
        v
Next.js Server/API Boundary
  -> Request validation
  -> Authentication/authorization where required
  -> Rate limiting
  -> Central error handler
        |
        +-> Crowd Service -> Crowd Engine
        +-> Navigation Service -> Routing Engine
        +-> Incident Service -> Decision Rules
        +-> Venue Service -> Repository
        +-> AI Service -> Prompt/Context Builder -> Gemini -> Output Schema Validator
                                      |
                                      v
                              Deterministic fallback

Repository Layer
  -> In-memory seeded demo adapter
  -> Optional production database adapter

## 4. Domain Engines

### Crowd Engine
Pure functions only.
Inputs:
- zone capacity
- current occupancy
- inflow/outflow
- closure state
- recent trend

Outputs:
- occupancy ratio
- congestion band
- trend
- deterministic risk flags
- recommended operational action IDs

### Routing Engine
Graph-based deterministic routing.
Node examples:
- gates
- sections
- concourses
- washrooms
- medical points
- exits
- transit pickup points

Edge attributes:
- distance
- accessibility
- closure
- congestion penalty

The engine returns the selected route plus explainable cost factors.

### Decision Engine
Rules transform verified signals into:
- severity
- priority
- escalation requirement
- allowed action set

AI can phrase the brief but cannot override hard rules.

## 5. AI Architecture
Create a provider interface so the rest of the app does not depend directly on Gemini.

AI tasks:
- `parseFanIntent`
- `translateGroundedAnswer`
- `summarizeIncident`
- `explainRoute`
- `generateOperatorBrief`

For each task:
1. Build minimal verified context.
2. Apply strict system instruction.
3. Request structured JSON when applicable.
4. Validate with Zod.
5. Reject unknown fields where practical.
6. Apply timeout.
7. Handle provider errors.
8. Use deterministic fallback.
9. Never expose raw provider errors or secrets.

## 6. Suggested Folder Structure

src/
  app/
    (public)/
      page.tsx
      navigate/
      accessibility/
      assistant/
    operations/
      page.tsx
      zones/
      incidents/
    api/
      crowd/
      routes/
      incidents/
      ai/
  components/
    ui/
    layout/
    command-center/
    navigation/
    crowd/
    assistant/
    accessibility/
  lib/
    domain/
      crowd/
      routing/
      decisions/
    ai/
      provider.ts
      gemini.ts
      prompts.ts
      schemas.ts
      fallbacks.ts
    server/
      auth.ts
      errors.ts
      rate-limit.ts
      security.ts
    repositories/
      interfaces.ts
      memory/
      production/
    schemas/
    config/
  data/
    demo-stadium.ts
    venue-graph.ts
  types/

tests/
  domain/
  api/
  components/
  a11y/
  security/

e2e/
  fan-navigation.spec.ts
  operator-incident.spec.ts
  ai-disabled.spec.ts
  accessibility.spec.ts

docs/
  screenshots/
  evidence/

.github/workflows/
  ci.yml

## 7. API Contract Principles
- Version or clearly stabilize API shapes.
- Validate body, params and query.
- Return a consistent error envelope:
  `{ "error": { "code": "...", "message": "...", "fields": {} } }`
- Never return stack traces to clients.
- Use correct status codes.
- Limit payload sizes.
- Rate-limit AI and mutation endpoints.

## 8. Security Architecture
- Secrets server-side only.
- `.env.example` contains names, never real secrets.
- CSP and standard security headers.
- Input validation.
- Output encoding through framework defaults.
- Authorization checked server-side.
- Avoid storing unnecessary personal data.
- Sanitize/limit user-provided text before sending to AI.
- Prompt-injection resistance: retrieved/user content is data, never instructions.
- AI cannot call privileged actions directly.
- Dependency audit before submission.
- Non-root container if Docker is used.

## 9. Performance Architecture
- Server-render the shell where useful.
- Dynamically import maps/charts/heavy modules.
- Avoid large animation libraries unless justified.
- Memoize expensive pure calculations.
- Cache safe read-only derived data.
- Debounce rapid search inputs.
- Keep route payloads small.
- Optimize fonts and images.
- Prevent layout shift with fixed dimensions.
- Measure rather than guess.

## 10. Accessibility Architecture
- Semantic HTML first.
- One clear page heading.
- Landmarks and skip navigation.
- Accessible dialogs/menus.
- Map has a list/text equivalent.
- Charts have hidden/visible data tables.
- Status changes use polite live regions.
- Never encode status by color alone.
- Touch targets and focus indicators must be adequate.
- Reduced-motion mode disables nonessential motion.

## 11. Reliability and Demo Strategy
If Gemini is unavailable:
- routing still works,
- crowd intelligence still works,
- command center still works,
- incident severity still works,
- assistant returns deterministic grounded help/fallback.

If production database is unavailable in local/demo:
- seeded in-memory repository runs complete demo flows.

## 12. CI Pipeline
On every push/PR:
1. install with lockfile
2. lint
3. typecheck
4. unit/integration tests with coverage
5. build
6. E2E smoke tests
7. accessibility E2E
8. dependency/security audit policy

Submission branch must be green.
