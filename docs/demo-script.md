# 2-minute demo script

Record in an incognito window at your live URL. Keep the Vercel environment variables page, `.env.local` and any API key out of shot. Aim for 1:45 to 2:00.

| Time | Show | Say (in your own words) |
|---|---|---|
| 0:00 to 0:15 | Home page | "This is ListingLint. Reviewers at used-equipment marketplaces get listings as messy text. This app turns that text into a clean listing and tells the reviewer exactly what to fix." |
| 0:15 to 0:45 | Click **Try: Taglish listing**, then **Check listing** | "This one mixes English and Tagalog. The AI pulls out the make, model, year, hours, price in pesos and location. CAT is normalised to Caterpillar. But the rules found it's a duplicate of a listing that's already live, so it's blocked, and here is the message to send the seller." |
| 0:45 to 1:05 | **Try: Missing details** | "Here the location is missing and 48,000 on a 2023 loader is far too many hours, probably kilometres. These checks are plain code with unit tests, not the AI guessing." |
| 1:05 to 1:25 | **Try: Prompt injection** | "This listing tells the AI to approve it with a score of 100. It can't: the AI only extracts fields; the status comes from code. It's flagged because $2,000 is far too low for a CNC mill." |
| 1:25 to 1:35 | **Try: Off-topic** | "Off-topic requests are rejected. It isn't a general chatbot." |
| 1:35 to 2:00 | GitHub repo: Actions tab (green run), `tests/` folder, then `/api/health` | "Every push runs a secret scan, lint, type check, unit tests and a build in GitHub Actions, and Vercel deploys automatically. The health check shows the key is configured without revealing it." |

Before recording: run each example once so you know what the live model returns, and adjust your words to match what actually appears. Upload to YouTube (Unlisted), Loom or Google Drive (anyone with the link can view) and put the link in the README.
