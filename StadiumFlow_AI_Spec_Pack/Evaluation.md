# StadiumFlow AI — Evaluation Strategy

This document turns the six target quality axes into implementation evidence. It is a target checklist, not a promise that an external evaluator will award 100/100.

## 1. Code Quality
Evidence required:
- TypeScript strict.
- Clean domain separation.
- Pure deterministic engines.
- Central schemas/errors.
- Zero lint warnings.
- No dead/duplicate code.
- Clear README and architecture.
- Consistent naming and small modules.

Pre-submission proof:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## 2. Security
Evidence required:
- server-only secrets,
- Zod validation,
- validated AI outputs,
- authz where required,
- AI endpoint rate limiting,
- CSP/security headers,
- safe error envelopes,
- prompt-injection boundaries,
- dependency audit,
- no secrets in repository.

Adversarial tests:
- malformed JSON,
- oversized input,
- unauthorized operator endpoint,
- repeated AI requests,
- prompt injection attempt,
- malformed AI provider response.

## 3. Efficiency
Evidence required:
- bounded dependencies,
- lazy-loaded heavy UI,
- optimized fonts/images,
- no unnecessary client rendering,
- efficient deterministic engines,
- caching where correct,
- measured Lighthouse/Core Web Vitals.

Do not claim 100 performance without measuring the deployed app.

## 4. Testing
Minimum test classes:
- domain unit tests,
- API integration tests,
- AI fallback tests,
- accessibility tests,
- E2E critical journeys,
- regression tests.

Target:
- critical engines >=95% coverage,
- meaningful overall coverage >=85%,
- all quality gates green.

Coverage percentage alone is not enough; evaluator-facing edge cases must be tested.

## 5. Accessibility
Evidence required:
- WCAG 2.2 AA design target,
- keyboard-complete critical journeys,
- semantic HTML,
- visible focus,
- reduced motion,
- accessible charts/maps,
- automated axe tests,
- Lighthouse accessibility target 100.

Manual checks remain mandatory because automated tools cannot prove full accessibility.

## 6. Problem Statement Alignment

| Challenge Area | StadiumFlow Capability | Evidence |
|---|---|---|
| Navigation | Crowd-aware deterministic routing | Route demo + routing tests |
| Crowd management | Zone risk and congestion engine | Command center + engine tests |
| Accessibility | Step-free routing and accessible UI | A11y tests + route mode |
| Transportation | Venue/transit guidance where data exists | Demo flow |
| Sustainability | Evidence-based operational recommendations | Methodology/assumptions |
| Multilingual assistance | Grounded GenAI Copilot | Multilingual demo + fallback |
| Operational intelligence | Command center and incident evidence | Operator workflow |
| Real-time decision support | Deterministic rules + AI operational brief | Incident E2E |

The strongest submission should demonstrate depth across connected areas rather than eight superficial tabs.

## 7. Final 100-Point Defense Checklist
Before final submission:
- Every visible button works.
- No console-breaking errors.
- No fake “live” claims for simulated data.
- AI failure does not break core flows.
- Production build is green.
- Deployed URL is tested on desktop and mobile.
- No exposed secrets.
- No high/critical unresolved dependency vulnerability.
- Critical routes pass E2E.
- Accessibility scan is clean for critical pages.
- Keyboard-only walkthrough succeeds.
- README matches actual implementation.
- Architecture diagram matches actual implementation.
- Screenshots are current.
- Rubric evidence is linked or documented.
- Originality is defensible.
