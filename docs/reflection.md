# Reflection (1 page): outline to complete in your own words

> This is an outline, not a finished reflection. Replace every TODO with what actually happened to you. Keep it to one page. Be honest about how AI was used: the course expects AI-assisted building, but the reflection must be yours.

## What I built
ListingLint, a web app that turns messy used-equipment listings into structured fields with an LLM, then uses unit-tested rules to decide whether the listing is ready, needs review, or is blocked, and drafts the questions for the seller. Live at TODO (URL).

## How I used AI
- TODO: which tools (for example Claude for planning, code and document drafts; the course's Vocareum OpenAI endpoint inside the app).
- TODO: what you decided yourself (the idea and user, which rules matter, what to cut).
- TODO: what you reviewed, changed or rejected in the AI's output, with one concrete example.

## Key learnings
- TODO: for example, why splitting work between the AI (extraction) and code (decisions) made the app testable and resistant to prompt injection.
- TODO: something you learned about CI/CD, environment variables or deployment.
- TODO: something you learned from user testing.

## Challenges
- TODO: real problems you hit (for example a CI failure, the course endpoint needing OPENAI_BASE_URL, an extraction mistake found in live testing) and how you fixed them.

## What I would improve next (v2)
- Shared rate limiting (for example Upstash Redis) instead of per-instance memory.
- Bulk checking of a CSV of listings, and saving results.
- An evaluation set of 50+ labelled listings to measure extraction accuracy on every model change.
- TODO: one improvement that came from your user tests.

## Responsible AI note
All data in the repo is made up; no employer or client data was used. The API key was kept in environment variables. TODO: one sentence on the main risk of this kind of tool (wrong extraction) and why a person still reviews before publishing.
