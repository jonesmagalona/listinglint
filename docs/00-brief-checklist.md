# Brief checklist: where each requirement is met

Maps every item in "Week 4 – Graded Assignment 4.2: AI-Powered Web Application Instructions" to the evidence in this repo. Status: ✅ done in repo · 🟡 needs Jones · ⬜ not started.

## Project constraints
| Requirement | Evidence | Status |
|---|---|---|
| Solve a real problem for a specific user | `docs/01-idea-validation.md` Steps 1 to 2 (listing reviewers and the marketplaces that employ them) | ✅ (user tests 🟡) |
| At least one AI capability | Extraction and classification with a forced tool call, `src/lib/ai.ts` | ✅ |
| Usable web UI | `src/components/ListingChecker.tsx` | ✅ |
| Deployed to a live URL | Vercel, link in `README.md` | 🟡 |
| Public GitHub repo | `gh repo create ... --public` | 🟡 |
| GitHub Actions workflow | `.github/workflows/ci.yml` | ✅ (green run 🟡) |
| No hardcoded secrets | `.env.example`, `.gitignore`, `scripts/check-secrets.sh` runs in CI | ✅ |
| Proper README | `README.md` | ✅ (links 🟡) |

## Phase 1: Validate and define
| Requirement | Evidence | Status |
|---|---|---|
| All 7 idea validation steps | `docs/01-idea-validation.md`, following the Week 4A cheat sheet: problem, target customer, market size, competition, edge, cheap test, stress test | ✅ |
| User, problem and market evidence | Step 1 problem; Step 2 customer; Step 3 cited market and fraud sources; Step 6 cheap-test results table | Market ✅, test results 🟡 |
| Differentiating angle | Step 5: "AI extracts, code decides", why you, why now | ✅ (why you 🟡) |
| 1-page PRD | `docs/02-prd.md` | ✅ |

## Phase 2: Spec and architecture
| Requirement | Evidence | Status |
|---|---|---|
| Architecture notes | `docs/03-architecture.md` (diagram, layers, data flow, decisions, security) | ✅ |
| spec.md | `spec.md` (inputs, outputs, AI behaviour, constraints and errors, acceptance criteria) | ✅ |
| CLAUDE.md or agents.md | `CLAUDE.md` | ✅ |
| .cursorrules | `.cursorrules` | ✅ |
| Revise the spec after review | `spec.md` revision history: v0.2 AI review and v0.3 live-test revision done; v0.4 human review by Paul (developer and QA professional) planned | ✅ / 🟡 |

## Phase 3: Build
| Requirement | Evidence | Status |
|---|---|---|
| Scaffold the application | Next.js 14 + Tailwind + TypeScript | ✅ |
| Core AI feature | `POST /api/check` | ✅ |
| At least 5 meaningful commits | 7 planned commits in NEXT-STEPS step 7, plus live-test fixes | 🟡 |
| At least 3 unit tests | 36 tests in `tests/` | ✅ |
| Check secrets and input validation | Secret scan; zod for input and AI output; rate limit | ✅ |

## Phase 4: Deploy
| Requirement | Evidence | Status |
|---|---|---|
| Configure GitHub Actions | `.github/workflows/ci.yml` | ✅ |
| Deploy to a live host | Vercel | 🟡 |
| Set environment variables | Vercel: OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL | 🟡 |
| Test the live app | Four example buttons, `/api/health`; record fixes in `spec.md` | 🟡 |
| Basic monitoring or analytics | Vercel Web Analytics, `/api/health`, structured JSON logs | ✅ (enable in Vercel 🟡) |

## Phase 5: Document and reflect
| Requirement | Evidence | Status |
|---|---|---|
| Complete README | `README.md` | ✅ (links 🟡) |
| 2-minute demo | Script in `docs/demo-script.md` | 🟡 |
| 1-page reflection | Outline in `docs/reflection.md` | 🟡 |
| One GitHub issue for v2 | Text in `docs/v2-issue.md`; create with `gh issue create` | 🟡 |

## What not to build
| Avoid | How ListingLint avoids it |
|---|---|
| Generic chatbot wrapper | AI only extracts; tested rules over reference data decide; off-topic input is rejected |
| Real payment processing | None |
| Landing page with no AI | Core AI feature is the main screen |
| CLI-only tool | Web UI |

## Before submission
- [ ] Live URL works in an incognito window
- [ ] GitHub repo opens while signed out
- [ ] All deliverables complete (no TODOs left: search the repo)
- [ ] Secrets not exposed (`npm run check:secrets`; old key rotated)
- [ ] Demo link plays for someone else
- [ ] Reflection attached or linked

## Optional extras from the recommended stack
The brief recommends, but does not require, the Vercel AI SDK, Supabase and Clerk. ListingLint calls the OpenAI-compatible API with `fetch` so the course's Vocareum endpoint works without an extra SDK (see `docs/03-architecture.md`). It needs no database or login for a single-listing check; both are noted as v2 options.
