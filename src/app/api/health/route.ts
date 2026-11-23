import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Reports only true/false for configuration. Never returns secret values. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    aiKeyConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    baseUrlConfigured: Boolean(process.env.OPENAI_BASE_URL?.trim()),
    modelConfigured: Boolean(process.env.OPENAI_MODEL?.trim()),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    time: new Date().toISOString(),
  });
}
