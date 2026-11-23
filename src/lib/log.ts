type Level = "info" | "warn" | "error";

/**
 * Structured JSON logs (one line per event) that show up in Vercel's Logs tab.
 * Never pass API keys or full listing text here; log lengths and codes instead.
 */
export function log(level: Level, event: string, fields: Record<string, unknown> = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
