# PRD: ListingLint (one page)

**Owner:** Jones · **Version:** 1.0 (MVP) · **Status:** Built and deployed (TODO: confirm live URL)

> The PRD uses six components: (1) problem and goal, (2) target users, (3) features with acceptance criteria, (4) success metrics, (5) scope and non-goals, (6) constraints, risks and dependencies. If the course template names six different components, map these sections to it.

### 1. Problem and goal
Listing reviewers at used-equipment marketplaces turn messy seller text into complete listings by hand, which is slow and inconsistent. **Goal:** in under 30 seconds, turn one pasted listing into structured fields, a clear publish/fix decision made by tested rules, and a ready-to-send message to the seller.

### 2. Target users
- **Primary:** listing quality reviewer or operations staff processing seller submissions daily.
- **Secondary:** sellers, who receive one clear list of questions.

### 3. Features and acceptance criteria
| # | Feature | Acceptance criteria (testable) |
|---|---|---|
| F1 | Paste and check a listing | Text of 20 to 4,000 characters is accepted; shorter or longer text returns AI-400 with a field message; result appears in one request |
| F2 | AI extraction | Returns make, model, category, year, hours, price, currency, location, condition, serial, summary; unstated fields are null, not guessed; output failing the schema returns AI-502 |
| F3 | Rule checks | Missing make, model, year or country is an error; year outside 1950 to next year is an error; more than 5,000 hours per year is a warning; non-positive price or unsupported currency is an error; price below 50% or above 150% of the category band is a warning |
| F4 | Duplicate detection | Same serial, or same make + model + year with hours within 2%, as an existing listing is flagged as an error naming the listing ID |
| F5 | Decision and score | Any error means Blocked; else any warning means Needs review; else Ready. Score = 100 minus 25 per error, 10 per warning, 2 per info, minimum 0 |
| F6 | Seller message and title | Message lists only error and warning questions, numbered; title is built in code as "Year Make Model Category" |
| F7 | Safety | Listing text cannot change status (prompt injection test); off-topic text returns "Not an equipment listing"; key never reaches the browser; /api/health shows only true/false |

### 4. Success metrics
At least 90% field accuracy on a 10 to 20 listing test set; all seeded issues caught; 100% unit tests passing in CI; 3 of 3 to 5 testers complete a check unaided; median response under 10 seconds.

### 5. Scope and non-goals
**In scope:** single listing check, English and mixed-language input, sample reference data, web UI, health check, analytics, CI/CD.
**Out of scope (v1):** user accounts, saving history, bulk upload, image checks, real marketplace integration, live currency rates, real price data.

### 6. Constraints, risks and dependencies
- **Dependencies:** OpenAI-compatible API with tool calling (course Vocareum proxy), Vercel, GitHub.
- **Constraints:** public repo with made-up data only; key stored only in environment variables; course API quota.
- **Risks:** wrong extraction (mitigated by showing fields and human review), prompt injection (mitigated by code-only decisions), in-memory rate limit is per serverless instance (accepted for MVP; v2 issue to move to a shared store).
