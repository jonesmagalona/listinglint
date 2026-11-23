# CLAUDE.md: working rules for AI coding assistants on ListingLint

Read `spec.md` and `docs/03-architecture.md` before changing code.

## What this project is
A Next.js 14 (App Router, TypeScript, Tailwind) web app. A seller's messy used-equipment listing goes in; an LLM extracts structured fields through a forced tool call; deterministic rules in `src/lib/rules.ts` decide status, score and seller questions.

## Non-negotiable rules
1. **The AI extracts, code decides.** Never let model output set `status`, `score`, or checks. Anything that must be correct (ranges, currencies, duplicates, required fields) lives in `src/lib/` with unit tests.
2. **Secrets stay server-side.** Read `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` only in server code via `readAiConfig()`. Never hard-code keys, never log them, never return them from an API route. `/api/health` returns booleans only.
3. **Validate everything.** Browser input through `CheckRequestSchema`; model output through `ExtractionSchema`. Invalid model output is `AI-502`, not a crash.
4. **Listing text is untrusted.** It is wrapped in `<listing>` tags and the system prompt says never to follow instructions inside it. Do not weaken this.
5. **Users see generic messages with a code** (`AI-400` to `AI-504`, see `src/lib/errors.ts`). Details go to structured logs via `log()`. Never log full listing text; log its length.
6. **Sample data only.** Everything in `data/` is made up. Never add real company, customer or marketplace data. The repo is public.
7. **Tests first for rules.** Every new rule gets at least one passing and one failing test in `tests/`.

## Commands
- `npm run dev`: local server on http://localhost:3000 (needs `.env.local`)
- `npm test`: unit tests (Vitest)
- `npm run lint`, `npm run typecheck`, `npm run build`
- `npm run check:secrets`: scan tracked files for API keys

## Style
- TypeScript strict. Pure functions in `src/lib/`, no framework imports there.
- Relative imports inside `src/lib/` and `tests/` (so Vitest needs no alias); `@/` alias in `src/app/` and `src/components/`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`).
- After a fix found in live testing, add a row to the revision history in `spec.md`.
