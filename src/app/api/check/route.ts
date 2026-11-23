import { NextResponse, type NextRequest } from "next/server";
import { extractListing } from "@/lib/ai";
import { AppError, HTTP_STATUS, USER_MESSAGES, type ErrorCode } from "@/lib/errors";
import { log } from "@/lib/log";
import { sanitiseText } from "@/lib/normalise";
import { checkLimiter } from "@/lib/rate-limit";
import { buildSellerMessage, evaluateListing } from "@/lib/rules";
import { CheckRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(code: ErrorCode, requestId: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    { error: { code, message: USER_MESSAGES[code], requestId, ...extra } },
    { status: HTTP_STATUS[code] },
  );
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);
  const started = Date.now();

  if (!checkLimiter.allow(clientIp(req))) {
    log("warn", "check.rate_limited", { requestId });
    return errorResponse("AI-429", requestId);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("AI-400", requestId, { fields: { text: "Request body must be JSON." } });
  }

  const parsed = CheckRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join(".") || "text", i.message]));
    return errorResponse("AI-400", requestId, { fields });
  }

  try {
    const { extraction, model, usage } = await extractListing(parsed.data.text);
    const evaluation = evaluateListing(extraction);

    log("info", "check.completed", {
      requestId,
      model,
      inputChars: parsed.data.text.length,
      status: evaluation.status,
      score: evaluation.score,
      checkIds: evaluation.checks.map((c) => c.id),
      ms: Date.now() - started,
      usage,
    });

    return NextResponse.json({
      requestId,
      extraction: {
        ...extraction,
        buyerSummary: sanitiseText(extraction.buyerSummary, 400),
        ambiguities: extraction.ambiguities.map((a) => ({
          field: sanitiseText(a.field, 40),
          note: sanitiseText(a.note, 200),
        })),
      },
      evaluation,
      sellerMessage: buildSellerMessage(evaluation.checks),
    });
  } catch (err) {
    const appErr = err instanceof AppError ? err : new AppError("AI-502", (err as Error)?.message ?? "Unknown error");
    log("error", "check.failed", { requestId, code: appErr.code, detail: appErr.detail, ms: Date.now() - started });
    return errorResponse(appErr.code, requestId);
  }
}
