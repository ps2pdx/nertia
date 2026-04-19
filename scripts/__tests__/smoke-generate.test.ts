import { describe, it, expect, vi, beforeEach } from "vitest";
import { runSmoke, SMOKE_HEADLINE } from "../smoke-generate";

type FetchCall = { url: string; init?: RequestInit };

function makeFetch(handlers: Array<(call: FetchCall) => Response>) {
  const calls: FetchCall[] = [];
  let i = 0;
  const fn: typeof fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : input.toString();
    const call = { url, init };
    calls.push(call);
    const handler = handlers[i++];
    if (!handler) throw new Error(`unexpected fetch call #${i} to ${call.url}`);
    return handler(call);
  };
  return Object.assign(vi.fn(fn), { calls });
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function htmlResp(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/html" } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("runSmoke", () => {
  it("POSTs the templated payload to /api/sites then GETs the rendered site", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ slug: "smoke-abc", url: "https://smoke-abc.nertia.ai" }),
      () => htmlResp(`<h1>${SMOKE_HEADLINE}</h1>`),
    ]);
    const result = await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.slug).toBe("smoke-abc");

    expect(fetchImpl.calls[0].url).toBe("http://localhost:3000/api/sites");
    expect(fetchImpl.calls[0].init?.method).toBe("POST");
    const posted = JSON.parse(String(fetchImpl.calls[0].init?.body));
    expect(posted.templateId).toBe("precedent");
    expect(posted.copy["hero.headline"]).toBe(SMOKE_HEADLINE);

    // Hits the local _sites path (not the wildcard host) until DNS ships
    expect(fetchImpl.calls[1].url).toBe("http://localhost:3000/_sites/smoke-abc");
  });

  it("fails when the create call returns non-2xx", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ error: "boom" }, 500),
    ]);
    const result = await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/create.*500/i);
  });

  it("fails when the rendered site returns non-2xx", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ slug: "smoke-x", url: "https://smoke-x.nertia.ai" }),
      () => htmlResp("not found", 404),
    ]);
    const result = await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/render.*404/i);
  });

  it("fails when the rendered HTML does not contain the headline", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ slug: "smoke-y", url: "https://smoke-y.nertia.ai" }),
      () => htmlResp("<h1>something else entirely</h1>"),
    ]);
    const result = await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/headline/i);
  });

  it("fails when the create response is missing slug", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ url: "https://x" }),
    ]);
    const result = await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/slug/i);
  });

  it("uses the override templateId when provided", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ slug: "p", url: "https://p" }),
      () => htmlResp(`<h1>${SMOKE_HEADLINE}</h1>`),
    ]);
    await runSmoke({ baseUrl: "http://localhost:3000", fetchImpl, templateId: "portfolio" });
    const posted = JSON.parse(String(fetchImpl.calls[0].init?.body));
    expect(posted.templateId).toBe("portfolio");
  });

  it("strips a trailing slash from baseUrl", async () => {
    const fetchImpl = makeFetch([
      () => jsonResp({ slug: "s", url: "x" }),
      () => htmlResp(`<h1>${SMOKE_HEADLINE}</h1>`),
    ]);
    await runSmoke({ baseUrl: "http://localhost:3000/", fetchImpl });
    expect(fetchImpl.calls[0].url).toBe("http://localhost:3000/api/sites");
    expect(fetchImpl.calls[1].url).toBe("http://localhost:3000/_sites/s");
  });
});
