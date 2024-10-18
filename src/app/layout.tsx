import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { CSPostHogProvider } from "./_analytics/provider";

export const metadata: Metadata = {
  title: "Acin.dev",
  description: "Personal protfolio website",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <CSPostHogProvider>
        <body className="flex flex-col items-center px-6">{children}</body>
      </CSPostHogProvider>
    </html>
  );
}
