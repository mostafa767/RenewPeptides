import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — RenewPeptides",
    template: "%s | Admin — RenewPeptides",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
