import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battlezone - nertia",
};

export default function BattlezoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
