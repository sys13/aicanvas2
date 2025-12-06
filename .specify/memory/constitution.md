<!--
Sync Impact Report
- Version change: none -> 1.0.0
- Modified principles: placeholders -> I. Code Quality & Maintainability; II. Testing Discipline & Evidence; III. User Experience Consistency & Accessibility; IV. Performance & Efficiency Budgets
- Added sections: Quality Standards & Delivery Gates; Development Workflow & Review Process
- Removed sections: Placeholder Principle 5
- Templates requiring updates (✅ updated / ⚠ pending): ✅ .specify/templates/plan-template.md; ✅ .specify/templates/spec-template.md; ✅ .specify/templates/tasks-template.md; ⚠ .specify/templates/commands (directory not present)
- Follow-up TODOs: None
-->

# MAXSTACK Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Code Quality & Maintainability
Deliver only strongly typed, modular, and reviewable code: TypeScript is mandatory; Biome
linting and formatting must pass before merge; functions and components stay small and
single-purpose; public contracts require clear typings and JSDoc/TSDoc when behavior is
non-obvious; no dead code or untracked TODOs enter main; reviews focus on correctness,
readability, and avoiding hidden coupling. Rationale: quality by construction reduces
regressions and speeds future changes.

### II. Testing Discipline & Evidence
Every change ships with executable evidence: unit tests for all logic branches; integration
tests for cross-module flows; Playwright E2E for primary user journeys; regression tests for
any fixed defect. New code must keep or raise coverage, targeting ≥85% line coverage per
package; flaky tests are treated as defects; CI must run `pnpm run validate` before release.
Rationale: evidence-backed changes prevent silent breakage.

### III. User Experience Consistency & Accessibility
Reuse the established design system: prefer `app/components` and shadcn/ui primitives;
adhere to Tailwind utility patterns; interactions stay consistent across routes. Interfaces
must be accessible (WCAG AA intent): semantic HTML, focus management, keyboard and screen
reader support, and color-contrast compliance. Rationale: consistent UX reduces cognitive
load and prevents regressions for assistive users.

### IV. Performance & Efficiency Budgets
Ship fast defaults: initial render for primary routes stays under 2.5s on a 3G Fast profile;
p95 user interactions complete within 200ms; avoid blocking the main thread with tasks
exceeding 50ms; prefer pagination or streaming over large payloads; measure with built-in
browser tooling or instrumentation before marking done. Rationale: predictable performance
keeps the UX responsive as features grow.

## Quality Standards & Delivery Gates
All work must pass `pnpm run validate` (lint, typecheck, tests) before merge. Introduce
dependencies only with documented justification and license compatibility. Any API contract
changes require typed definitions and migration notes. Documentation updates accompany
non-trivial behavior changes. Security hygiene is mandatory: no secrets in the repo,
sanitize external input, and prefer existing auth/session utilities when available.

## Development Workflow & Review Process
Use focused branches per feature or fix; keep commits logical and reversible. Every PR links
to its spec/plan, states test evidence (commands run, scenarios covered), and notes
performance/UX validation performed. At least one qualified reviewer must approve; blocking
feedback on quality, tests, UX, or performance must be resolved before merge. Post-merge
monitoring or follow-up tasks are recorded when risks remain.

## Governance
This constitution supersedes other practice docs where conflicts arise. Amendments require a
PR describing the change, impact analysis, and updated references in templates; major
changes must be approved by project maintainers. Versioning follows semver: MAJOR for
breaking governance changes, MINOR for new principles or sections, PATCH for clarifications.
Compliance is reviewed on every PR and during release readiness checks; deviations require
documented justification and a plan to return to compliance.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
