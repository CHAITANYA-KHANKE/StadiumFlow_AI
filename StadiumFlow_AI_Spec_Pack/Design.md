# StadiumFlow AI — Design System

## 1. Design Direction
Create a premium real-time stadium operations product: energetic enough for a global tournament, disciplined enough for an operations command center.

The supplied reference repository is only a benchmark for product polish, hierarchy, clarity, responsive behavior and finish. Do not reproduce its screens or distinctive layout.

## 2. Product Personality
- Fast
- Trustworthy
- Spatial
- Inclusive
- Operational
- Modern

Avoid:
- generic AI purple gradients everywhere,
- excessive glassmorphism,
- cyberpunk clutter,
- animations without purpose,
- tiny low-contrast dashboard text.

## 3. Visual Concept
Use a dark operations canvas for the command center with high-legibility surfaces and restrained luminous accents. Fan-facing navigation may use a lighter, calmer surface while retaining the same tokens.

Suggested token direction:
- Background: deep neutral/navy
- Surface: elevated neutral panels
- Primary accent: electric cyan/blue-green family
- Secondary accent: tournament-energy lime or warm highlight
- Success/warning/danger: semantic colors meeting contrast requirements
- Text: near-white on dark, near-black on light

Exact values should be tested for WCAG contrast before locking.

## 4. Typography
Use a performant variable sans font available through the framework font system.
- Display: strong condensed or geometric feel only if performance/accessibility remain good.
- Body/UI: highly readable sans.
- Numeric metrics: tabular numerals.

Keep typography to at most two families.

## 5. Layout
### Desktop Operations
- Left navigation rail/sidebar
- Top operational status bar
- Main responsive grid
- Primary venue visualization receives the most space
- Right contextual rail only when it adds value

### Mobile
- Bottom/compact navigation
- No squeezed desktop dashboard
- Cards stack by decision priority
- Critical alerts remain visible
- Navigation actions reachable by thumb

## 6. Signature Experiences
### Live Venue Pulse
A central stadium/zone visualization showing status and congestion. It must have an accessible list/table equivalent.

### AI Operations Brief
A concise briefing panel that visibly separates:
- verified facts,
- deterministic risk,
- AI explanation,
- recommended actions.

### Smart Route Experience
Show:
- destination,
- ETA/distance,
- congestion level,
- accessibility status,
- route steps,
- reason for reroute.

### Incident Focus Mode
When an incident opens, reduce visual noise and emphasize evidence, severity and action.

## 7. Motion
Motion should communicate:
- route progression,
- changing congestion,
- panel transitions,
- alert priority.

Rules:
- use transform/opacity where possible,
- avoid continuous decorative loops,
- respect `prefers-reduced-motion`,
- never make critical information depend on animation.

## 8. Components
Required reusable components:
- Button
- IconButton
- Input/Search
- Select/Combobox
- Dialog/Drawer
- Tooltip
- Tabs
- StatusBadge
- MetricCard
- AlertCard
- ZoneCard
- RouteStep
- AccessibleDataTable
- EmptyState
- ErrorState
- Skeleton
- AIStatus/DegradedMode indicator

Every interactive component needs hover, focus, active, disabled and error states where applicable.

## 9. Accessibility-by-Design
- Minimum readable text sizes.
- Strong focus ring.
- 44x44-ish touch targets where practical.
- Contrast-tested tokens.
- Icons paired with labels for critical meaning.
- Do not rely on red/green alone.
- Accessible chart legends and tables.
- Map interactions mirrored by searchable lists.
- Language switcher must have explicit labels.

## 10. Performance-by-Design
- Prefer CSS over heavy animation packages.
- Avoid video backgrounds.
- Avoid huge hero assets.
- Lazy-load map/chart modules.
- Use SVG/icons efficiently.
- Keep above-the-fold command center immediately useful.

## 11. Page Blueprint
### Landing / Demo Entry
Value proposition -> challenge areas solved -> enter fan experience / operations demo -> architecture trust strip.

### Command Center
Status bar -> venue pulse -> priority alerts -> crowd trends -> operational brief.

### Navigate
Search -> preferences -> route -> route explanation -> accessibility details.

### Assistant
Language selector -> contextual prompts -> conversation -> source/context indicator -> fallback status.

### Accessibility
Preferences -> accessible navigation shortcuts -> venue accessibility information.

## 12. Quality Standard
The UI is complete only when:
- no dead controls,
- no placeholder lorem ipsum,
- all breakpoints work,
- all states exist,
- keyboard flows work,
- contrast passes,
- loading does not cause layout chaos,
- screenshots look coherent without needing explanation.
