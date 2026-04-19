import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";
import { IntakeForm } from "./IntakeForm";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  return (
    <IntakeForm
      templateId={template.id}
      templateName={template.displayName}
      copySchema={template.copySchema}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  return {
    title: template ? `${template.displayName} — generate · nertia` : "Generate · nertia",
    robots: "noindex",
  };
}
