import PageTemplate from "@/components/PageTemplate";
import ComingSoonBanner from "@/components/sections/ComingSoonBanner";
import { IntakeFlow } from "./IntakeFlow";

export const metadata = {
  title: "Zero-Point · nertia",
  description: "Answer a few questions. Watch your brand emerge.",
  robots: "noindex",
};

export default function IntakePage() {
  return (
    <PageTemplate>
      <ComingSoonBanner />
      <IntakeFlow />
    </PageTemplate>
  );
}
