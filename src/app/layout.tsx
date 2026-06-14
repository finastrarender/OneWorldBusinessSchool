import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: {
    default: "One World Business School & Incubation Centre",
    template: "%s | OWBS FZE",
  },
  description:
    "One World Business School & Incubation Centre",
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* suppressHydrationWarning on html/body: browser extensions often inject attrs (e.g. cz-shortcut-listen). */
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
