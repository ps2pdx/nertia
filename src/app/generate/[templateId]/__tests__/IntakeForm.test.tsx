import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { CopySchemaField } from "@/templates/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
}));

import { IntakeForm } from "../IntakeForm";

const schema: CopySchemaField[] = [
  {
    key: "hero.headline",
    label: "Headline",
    type: "text",
    placeholder: "Say what you do",
    required: true,
  },
  {
    key: "hero.sub",
    label: "Sub copy",
    type: "textarea",
    placeholder: "One sentence to set the tone",
    required: false,
  },
  {
    key: "hero.primaryCtaLabel",
    label: "CTA label",
    type: "text",
    required: true,
  },
  {
    key: "hero.primaryCtaHref",
    label: "CTA link",
    type: "text",
    required: true,
  },
];

describe("IntakeForm", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  it("renders one input per required schema field", () => {
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);
    expect(screen.getByLabelText(/headline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cta label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cta link/i)).toBeInTheDocument();
  });

  it("renders textarea for textarea fields", () => {
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);
    const sub = screen.getByLabelText(/sub copy/i);
    expect(sub.tagName).toBe("TEXTAREA");
  });

  it("marks required fields with the required attribute", () => {
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);
    const headline = screen.getByLabelText(/headline/i);
    expect(headline).toBeRequired();
    const sub = screen.getByLabelText(/sub copy/i);
    expect(sub).not.toBeRequired();
  });

  it("submits form values to /api/sites with templateId", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ slug: "acme", url: "https://acme.nertia.ai" }),
    });
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);

    fireEvent.change(screen.getByLabelText(/headline/i), { target: { value: "Acme builds stuff" } });
    fireEvent.change(screen.getByLabelText(/cta label/i), { target: { value: "Start" } });
    fireEvent.change(screen.getByLabelText(/cta link/i), { target: { value: "/begin" } });
    fireEvent.submit(screen.getByTestId("intake-form"));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("/api/sites");
    const body = JSON.parse(init.body);
    expect(body.templateId).toBe("precedent");
    expect(body.copy["hero.headline"]).toBe("Acme builds stuff");
    expect(body.copy["hero.primaryCtaLabel"]).toBe("Start");
    expect(body.copy["hero.primaryCtaHref"]).toBe("/begin");
  });

  it("shows an error message when the API returns an error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "slug taken" }),
    });
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);

    fireEvent.change(screen.getByLabelText(/headline/i), { target: { value: "Acme" } });
    fireEvent.change(screen.getByLabelText(/cta label/i), { target: { value: "Start" } });
    fireEvent.change(screen.getByLabelText(/cta link/i), { target: { value: "/" } });
    fireEvent.submit(screen.getByTestId("intake-form"));

    await waitFor(() => expect(screen.getByText(/slug taken/i)).toBeInTheDocument());
  });

  it("shows the template name in the form header", () => {
    render(<IntakeForm templateId="precedent" templateName="Precedent" copySchema={schema} />);
    expect(screen.getByText(/precedent/i)).toBeInTheDocument();
  });
});
