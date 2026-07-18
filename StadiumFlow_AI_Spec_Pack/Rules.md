# StadiumFlow AI — AI Coding Rules

These rules are mandatory for every coding agent working on this repository.

## 1. Originality
- Build StadiumFlow AI for the Smart Stadiums & Tournament Operations problem.
- External repositories are reference material for quality and general design polish only.
- Do not copy source code, components, assets, text, branding, screenshots, unique layouts or proprietary implementation.
- Write original implementation suited to this problem statement.
- Record meaningful external libraries and licenses.

## 2. Rubric-First Engineering
Every change must protect or improve:
- Code Quality
- Security
- Efficiency
- Testing
- Accessibility
- Problem Statement Alignment

Do not trade one axis away for cosmetic polish.

## 3. Code Quality
- TypeScript strict mode.
- No `any` unless documented and unavoidable.
- No unused code, commented-out dead code or duplicate logic.
- Domain logic belongs in pure modules, not React components.
- Use clear names and small focused functions.
- Route -> service -> repository/domain separation for nontrivial backend flows.
- Centralize schemas and error handling.
- Prefer composition over giant components.
- Do not overengineer.

## 4. Security
- Never hardcode secrets.
- Never expose AI keys to the browser.
- Validate every external input.
- Validate AI outputs.
- Enforce authorization server-side.
- Add rate limits to AI/expensive endpoints.
- Do not log tokens, secrets or sensitive user content.
- Return safe errors, never stack traces.
- Treat prompt/user/retrieved text as untrusted data.
- AI output can never directly perform privileged operational actions.

## 5. Efficiency
- Do not add a library for a task the platform can handle cleanly.
- Lazy-load heavy visualizations.
- Avoid unnecessary client components.
- Avoid repeated network requests.
- Memoize only measured expensive computations.
- Keep demo datasets bounded.
- Prevent animation from harming interaction or Core Web Vitals.
- Maintain explicit performance budgets.

## 6. Testing
No feature is complete without tests appropriate to its risk.
- Pure domain logic: unit tests including boundaries and invalid inputs.
- API: success plus 400/401/403/404/429/500 where applicable.
- AI: valid response, malformed response, timeout/failure and fallback.
- Accessibility: automated axe checks plus keyboard flow.
- Critical user journeys: Playwright E2E.
- Bug fixes require regression tests.
- Never delete a meaningful failing test just to make CI green.

## 7. Accessibility
- Target WCAG 2.2 AA.
- All actions keyboard accessible.
- Visible focus.
- Correct labels and descriptions.
- No icon-only control without accessible name.
- No color-only status.
- Respect reduced motion.
- Charts/maps require nonvisual equivalents.
- Dynamic alerts use appropriate live regions.
- Test at 200% zoom and mobile widths.

## 8. Problem Alignment
Before implementing a feature, answer:
- Which target user needs it?
- Which challenge focus area does it address?
- What measurable operational/fan outcome does it improve?
- Is GenAI genuinely useful here?
- Can the claim be demonstrated?

If these cannot be answered, the feature is probably scope noise and should not be built.

## 9. AI Usage Rules
- Deterministic engines own numbers, routing and hard safety decisions.
- AI must be grounded in supplied context.
- Never invent live stadium data.
- Label simulated/demo data clearly.
- AI features require deterministic fallbacks.
- Use structured outputs where possible.
- Keep prompts server-side.
- Minimize context and token usage.
- Do not send unnecessary personal data.

## 10. UI Rules
- Use the reference project only as a benchmark for clarity, polish, spacing, hierarchy and product-level finish.
- Do not clone its layout.
- StadiumFlow must have its own visual identity.
- Every screen must have a clear primary action.
- Avoid dashboard clutter and meaningless glassmorphism.
- Motion must communicate state or spatial flow, not decorate everything.
- Provide loading, empty, error and degraded states.

## 11. Error Handling
- Never silently swallow errors.
- User-facing errors must be actionable.
- Developer logs may contain diagnostic IDs, not secrets.
- AI failure must degrade gracefully.
- Network-dependent screens must show retry options.
- Unexpected errors must not break the entire shell.

## 12. Agent Workflow
Before coding:
1. Read PRD.md, Architecture.md, Rules.md, Phases.md, Design.md and Memory.md.
2. State the current phase.
3. Inspect existing code before modifying it.
4. Make the smallest coherent implementation.
5. Run relevant quality checks.
6. Update Memory.md with facts only.
7. Do not claim a test passed unless it was actually run.

## 13. Definition of Done
A phase is not done until:
- functionality works,
- edge/error states exist,
- tests pass,
- lint/typecheck pass,
- accessibility is checked,
- docs/memory are updated,
- no secrets are committed,
- the feature visibly supports the challenge.
