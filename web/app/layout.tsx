import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/store";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "رتّب · Rattib — Saudi experiences",
  description:
    "A marketplace for Saudi experiences: local experts publish small-group sessions, customers discover and book them on a map.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col">
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
