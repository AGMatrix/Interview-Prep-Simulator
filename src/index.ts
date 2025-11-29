import { Hono } from "hono";
import { cors } from "hono/cors";
import { APIWorker } from "./workers/api";
import { Env } from "./types";
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

// Export Durable Object
export { UserMemoryDO } from "./durable-objects/user-memory";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use("/*", cors());

// Health check endpoint
app.get("/health", (c) => {
	return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Route all API requests to APIWorker
app.all("/api/*", async (c) => {
	const apiWorker = new APIWorker(c.env);
	return await apiWorker.handleRequest(c.req.raw);
});

// Serve static files for frontend
app.get("/*", async (c) => {
	try {
		return await getAssetFromKV(
			{
				request: c.req.raw,
				waitUntil: () => {},
			} as any,
			{
				ASSET_NAMESPACE: (c.env as any).__STATIC_CONTENT,
				ASSET_MANIFEST: (c.env as any).__STATIC_CONTENT_MANIFEST,
			}
		);
	} catch (e) {
		// If asset not found, serve index.html for SPA routing
		try {
			const indexRequest = new Request(new URL("/index.html", c.req.url));
			return await getAssetFromKV(
				{
					request: indexRequest,
					waitUntil: () => {},
				} as any,
				{
					ASSET_NAMESPACE: (c.env as any).__STATIC_CONTENT,
					ASSET_MANIFEST: (c.env as any).__STATIC_CONTENT_MANIFEST,
				}
			);
		} catch (e) {
			return c.json({ error: "Not found" }, 404);
		}
	}
});

// Export the Hono app
export default app;
