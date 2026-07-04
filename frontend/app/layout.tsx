import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "./lib/store";

export const metadata: Metadata = {
  title: "OrbitX · HRMS Enterprise Workspace",
  description: "Human Resource Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
