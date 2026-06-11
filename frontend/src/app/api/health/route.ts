import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(request: Request) {
  return proxyToBackend("/api/health", request);
}
