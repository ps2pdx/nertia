import { IntakeFlow } from "./IntakeFlow";

export const metadata = {
  title: "Zero-Point · nertia",
  description: "Answer a few questions. Watch your brand emerge.",
  robots: "noindex",
};

export default function IntakePage() {
  return <IntakeFlow templateId="precedent" />;
}
