import { Hono } from "hono";
import { cors } from "hono/cors";
import { APIWorker } from "./workers/api";
import { Env } from "./types";

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

// Root endpoint with API documentation
app.get("/", (c) => {
	return c.json({
		message: "AI Interview Prep Simulator API",
		version: "1.0.0",
		endpoints: {
			health: "/health",
			session: {
				start: "POST /api/session/start",
				get: "GET /api/session/:id",
				message: "POST /api/session/:id/message",
				end: "DELETE /api/session/:id",
			},
			resume: "POST /api/resume/upload",
			jd: "POST /api/jd/analyze",
			memory: "GET /api/memory/:userId",
			voice: {
				stt: "POST /api/voice/stt",
				tts: "POST /api/voice/tts",
			},
		},
	});
});

// Export the Hono app
export default app;
