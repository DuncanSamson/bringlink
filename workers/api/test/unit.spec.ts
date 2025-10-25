import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Import your worker so you can unit test it
import app from "../src";

describe("API Worker Unit Tests", () => {
  it("should return 400 for missing URL in shorten request", async () => {
    const req = app.request("https://example.com/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await app.fetch(req, env as any, createExecutionContext());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", 'Missing "url" in request body');
  });

  it("should return 400 for invalid JSON body", async () => {
    const req = app.request("https://example.com/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalidJson}",
    });

    const res = await app.fetch(req, env as any, createExecutionContext());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", "Invalid JSON body");
  });

  it("should return 400 for invalid URL format", async () => {
    const req = app.request("https://example.com/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "invalid-url" }),
    });

    const res = await app.fetch(req, env as any, createExecutionContext());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error", "Invalid URL");
  });

  it("should return 200 and shortened URL for valid request", async () => {
    const req = app.request("https://example.com/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.example.com/some/long/path" }),
    });

    const res = await app.fetch(req, env as any, createExecutionContext());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("originalUrl", "https://www.example.com/some/long/path");
    expect(json).toHaveProperty("code");
    expect(json).toHaveProperty("shortUrl");
  });
});