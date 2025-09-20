import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata = { title: "Quiet Hours Scheduler" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
