import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

const rewriteSpy = vi.spyOn(NextResponse, "rewrite");
const nextSpy = vi.spyOn(NextResponse, "next");

import { middleware } from "@/../middleware";

function req(host: string, path = "/") {
  return new Request(`https://${host}${path}`, { headers: { host } });
}

describe("middleware", () => {
  beforeEach(() => {
    rewriteSpy.mockClear();
    nextSpy.mockClear();
  });

  it("passes through apex host", () => {
    const out = middleware(req("nertia.ai"));
    expect(nextSpy).toHaveBeenCalled();
    expect(rewriteSpy).not.toHaveBeenCalled();
  });

  it("passes through localhost", () => {
    const out = middleware(req("localhost:3000"));
    expect(nextSpy).toHaveBeenCalled();
  });

  it("rewrites subdomain to /_sites/[slug]", () => {
    middleware(req("acme.nertia.ai", "/"));
    expect(rewriteSpy).toHaveBeenCalled();
    const url = rewriteSpy.mock.calls[0]![0] as URL;
    expect(url.pathname).toBe("/_sites/acme");
  });

  it("rewrites subdomain preserving path", () => {
    rewriteSpy.mockClear();
    middleware(req("acme.nertia.ai", "/about"));
    const url = rewriteSpy.mock.calls[0]![0] as URL;
    expect(url.pathname).toBe("/_sites/acme/about");
  });

  it("ignores www subdomain", () => {
    nextSpy.mockClear();
    middleware(req("www.nertia.ai"));
    expect(nextSpy).toHaveBeenCalled();
  });
});
