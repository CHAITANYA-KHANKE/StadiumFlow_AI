# StadiumFlow AI

> GenAI-enabled smart stadium operations and fan experience platform for the FIFA World Cup 2026 challenge context.

## What It Solves
StadiumFlow AI connects crowd intelligence, crowd-aware navigation, accessibility, multilingual assistance and operational decision support into one coherent stadium experience.

Instead of asking an LLM to invent operational facts, the system follows a safer architecture:

**Verified/Simulated Venue Data -> Deterministic Engines -> GenAI Explanation & Communication -> Actionable Experience**

Crowd metrics, routes and hard operational rules remain deterministic. GenAI is used where it adds genuine value: understanding intent, multilingual communication, grounded summaries and operator briefings.

## Core Experiences
- Operations Command Center
- Crowd Intelligence
- Crowd-Aware Smart Navigation
- Accessible/Step-Free Routing
- Multilingual Venue Copilot
- Operational Decision Support
- Resilient AI-disabled Demo Mode
- Credible Transportation/Sustainability guidance where supported by data

## Quality Strategy
The project is intentionally engineered around six evaluation axes:
- Code Quality
- Security
- Efficiency
- Testing
- Accessibility
- Problem Statement Alignment

See `Evaluation.md` for the evidence plan.

## Architecture
Core layers:
- UI and route layer
- validated API boundary
- service layer
- deterministic domain engines
- repository abstraction
- isolated GenAI provider with schema validation and fallbacks

See `Architecture.md` for the full design.

## Documentation
- `PRD.md` — product requirements and scope
- `Architecture.md` — technical architecture and folder structure
- `Rules.md` — mandatory rules for AI coding agents
- `Phases.md` — sequential implementation plan
- `Design.md` — original visual system and UX requirements
- `Memory.md` — implementation handoff memory
- `Evaluation.md` — six-axis scoring defense plan

## Recommended Development Workflow
1. Read all specification files.
2. Build one phase at a time from `Phases.md`.
3. Run relevant tests after every phase.
4. Update `Memory.md` with verified progress.
5. Never move to submission while a quality gate is failing.

## Target Quality Gates
The final implementation should provide scripts equivalent to:
```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run test:e2e
npm run build
npm run verify
```

Exact scripts must reflect the final implementation rather than documentation fiction.

## AI Safety and Reliability
- AI does not own crowd numbers, route correctness or hard safety decisions.
- AI output is validated before use.
- Secrets remain server-side.
- AI endpoints are rate-limited.
- Core functionality degrades gracefully when AI is unavailable.
- Demo/simulated data is clearly labeled.

## Originality
This product must be implemented specifically for the Smart Stadiums & Tournament Operations challenge. External repositories may be studied for general engineering quality and visual polish, but their source code, assets, branding, copy and distinctive implementations must not be copied.

## Status
Specification complete. Implementation should begin with Phase 0.

## License
Choose and add an appropriate license before public release.
