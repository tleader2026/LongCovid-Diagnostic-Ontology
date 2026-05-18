import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human Regulatory State Engine",
  description: "Adaptive regulatory-state phenotyping MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-line bg-white/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-semibold text-ink">
              Human Regulatory State Engine
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/intake" className="hover:text-ink">Intake</Link>
              <Link href="/admin" className="hover:text-ink">Admin</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
