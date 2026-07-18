# StadiumFlow AI — Build Phases

Build sequentially. Do not attempt the entire product in one agent prompt.

## Phase 0 — Foundation and Quality Gates
Deliver:
- Next.js/TypeScript strict project
- formatting/linting/typecheck
- testing stack
- Playwright
- accessibility testing
- CI
- environment validation
- centralized errors
- security headers
- base design tokens
- seeded demo mode

Acceptance:
- lint/typecheck/build/test commands work
- CI is green
- no secret required to open the demo shell

## Phase 1 — Domain Models and Deterministic Engines
Deliver:
- venue/zone/POI/edge/incident schemas
- crowd engine
- routing engine
- decision rules
- seeded stadium graph/data

Acceptance:
- pure functions
- comprehensive boundary tests
- no UI dependency
- critical engine coverage target >=95%

## Phase 2 — Application Shell and Design System
Deliver:
- responsive shell
- navigation
- command-center visual language
- reusable cards, buttons, inputs, dialogs, status chips
- skip link
- focus system
- reduced motion
- loading/error/empty patterns

Acceptance:
- keyboard navigation works
- axe has no serious/critical issues on shell
- no copied reference UI

## Phase 3 — Operations Command Center
Deliver:
- venue overview
- zone status visualization
- congestion/risk cards
- prioritized incidents
- operational timeline
- accessible table alternatives

Acceptance:
- all metrics derive from seeded/domain data
- no fake decorative numbers
- mobile layout works
- performance remains within budget

## Phase 4 — Crowd-Aware Navigation
Deliver:
- origin/destination selection
- route calculation
- congestion-aware rerouting
- closure handling
- accessible route mode
- route explanation
- text itinerary equivalent

Acceptance:
- route engine tested
- inaccessible paths excluded in accessible mode
- closed paths excluded
- no AI dependency for route correctness

## Phase 5 — Multilingual GenAI Copilot
Deliver:
- provider abstraction
- Gemini server adapter
- grounded venue context
- intent/output schemas
- multilingual responses
- rate limiting
- deterministic fallback

Acceptance:
- API key never reaches client
- malformed AI output rejected
- failure/timeout fallback tested
- assistant never invents live metrics

## Phase 6 — Operational Decision Support
Deliver:
- incident detail workflow
- deterministic severity
- AI incident brief
- evidence panel
- recommended action set
- escalation workflow

Acceptance:
- AI cannot override hard safety rules
- every recommendation displays evidence/context
- AI-disabled workflow remains usable

## Phase 7 — Sustainability and Transportation Integration
Deliver only credible features:
- transit guidance within demo data
- operational sustainability recommendations
- clear assumptions and methodology

Acceptance:
- no unsupported environmental claims
- feature maps directly to challenge areas

## Phase 8 — Security Hardening
Deliver:
- full input validation review
- auth/authorization review if operator auth exists
- CSP/security headers
- rate-limit tests
- dependency audit
- secret scan
- safe logs
- Docker non-root configuration if Docker used

Acceptance:
- zero known high/critical issues that can reasonably be fixed
- negative API cases tested

## Phase 9 — Accessibility Audit
Deliver:
- automated axe suite
- keyboard audit
- screen-reader semantics review
- 200% zoom review
- contrast review
- reduced-motion review
- accessible chart/map alternatives

Acceptance:
- target Lighthouse Accessibility 100 on tested pages
- zero serious/critical automated violations
- critical workflows keyboard complete

## Phase 10 — Performance and Efficiency
Deliver:
- bundle review
- dynamic imports
- image/font optimization
- render/request cleanup
- cache policy where safe
- Core Web Vitals fixes

Acceptance:
- strong Lighthouse results on deploy
- no unnecessary heavy dependencies
- no major layout shift

## Phase 11 — Full Verification
Run:
- lint
- typecheck
- coverage
- build
- E2E
- AI-disabled E2E
- accessibility E2E
- dependency audit

Fix every avoidable failure before submission.

## Phase 12 — Submission Package
Deliver:
- final README
- architecture diagram
- screenshots
- feature/rubric evidence matrix
- setup/deploy instructions
- demo mode instructions
- known limitations
- test and quality evidence

Important:
Because the challenge allows limited attempts and the last attempt counts, do not submit a later attempt merely to experiment. Run the complete local/deployed verification checklist first.
