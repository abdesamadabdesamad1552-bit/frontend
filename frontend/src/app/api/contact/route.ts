import { saveContactMessage, type ContactInput } from "@/lib/db";

export async function POST(request: Request) {
  let body: ContactInput;
  try {
    body = (await request.json()) as ContactInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    console.warn("[contact] DATABASE_URL not set — message logged only:", body);
    return Response.json({ success: true });
  }

  try {
    await saveContactMessage(body);
    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact] save failed:", message);

    if (message.includes("Missing required fields")) {
      return Response.json({ error: message }, { status: 400 });
    }

    return Response.json(
      { error: "تعذر إرسال رسالتك. يرجى المحاولة بعد قليل أو مراسلتنا عبر البريد الإلكتروني." },
      { status: 503 }
    );
  }
}
