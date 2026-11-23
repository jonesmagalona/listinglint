/**
 * Error codes shown to users. Details are logged server-side only.
 * AI-400 bad input, AI-401 key rejected, AI-429 too many requests,
 * AI-500 server not configured, AI-502 AI reply unusable, AI-503 AI service unavailable, AI-504 AI timeout.
 */
export type ErrorCode = "AI-400" | "AI-401" | "AI-429" | "AI-500" | "AI-502" | "AI-503" | "AI-504";

export const USER_MESSAGES: Record<ErrorCode, string> = {
  "AI-400": "Please check your listing text and try again.",
  "AI-401": "The AI service rejected our credentials. Please tell the site owner.",
  "AI-429": "Too many requests. Please wait a minute and try again.",
  "AI-500": "The app is not fully configured yet. Please tell the site owner.",
  "AI-502": "The AI returned something we could not use. Please try again.",
  "AI-503": "The AI service is unavailable right now. Please try again shortly.",
  "AI-504": "The AI took too long to respond. Please try again.",
};

export const HTTP_STATUS: Record<ErrorCode, number> = {
  "AI-400": 400,
  "AI-401": 502,
  "AI-429": 429,
  "AI-500": 500,
  "AI-502": 502,
  "AI-503": 503,
  "AI-504": 504,
};

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    /** Internal detail for logs. Never sent to the browser. */
    public readonly detail: string,
  ) {
    super(`${code}: ${detail}`);
    this.name = "AppError";
  }
}
