import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Import your worker so you can unit test it
import app from "../src";

describe("API Worker Integration Tests", () => {
  it("should return 400 for empty body", async () => {
    const res = await app.request("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", "Invalid JSON body");
  });

  it("should return 400 for invalid JSON body", async () => {
    const res = await app.request("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalidJson}",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", "Invalid JSON body");
  });

  it("should return 400 for missing URL in shorten request", async () => {
    const res = await app.request("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", 'Missing "url" in request body');
  });

  it("should return 400 for invalid URL format", async () => {
    const res = await app.request("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "invalid-url" }),
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", "Invalid URL");
  });
  it("should return 200 and shortened URL for valid request", async () => {
    const res = await app.request("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.example.com/some/long/path" }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("shortUrl");
  });
});
