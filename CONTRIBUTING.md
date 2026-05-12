# Contributing to Vybe

## Competition Period
This repository is under active competition submission.
External contributions are not accepted during this period.

## Development Setup
See README.md for full setup instructions.

## Code Standards
- TypeScript strict mode — no `any` types
- All colors from `src/theme/colors.ts` — no hardcoded hex values
- All spacing from `src/theme/spacing.ts`
- Components under 200 lines — extract sub-components aggressively
- Every async function must have try/catch error handling
- Every screen must handle: loading, error, and empty states

## Branch Naming
- feature/[feature-name]
- fix/[bug-description]
- chore/[task-description]

## Commit Message Format
Follow Conventional Commits:
  feat: add winner reveal confetti animation
  fix: resolve vote count not updating in real-time
  chore: update dependencies to latest compatible versions
  docs: update README with setup instructions
  style: fix caption text overflow on long handles
  refactor: extract VideoCard overlay into sub-component
  perf: optimize FlatList windowSize for smoother scroll
  security: move tokens from AsyncStorage to encrypted MMKV
