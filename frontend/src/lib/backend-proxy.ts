const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

/** Server-side proxy — no Origin header, avoids backend CORS errors from browsers. */
export async function proxyToBackend(
  path: string,
  request: Request
): Promise<Response> {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const res = await fetch(`${BACKEND_URL}${path}`, init);
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}

/** Proxy when request body was already read as text. */
export async function proxyToBackendWithBody(
  path: string,
  method: string,
  bodyText: string
): Promise<Response> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: bodyText,
  });

  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}
