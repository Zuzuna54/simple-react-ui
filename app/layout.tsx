import type { Metadata } from "next";
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import "./globals.css";

export const metadata: Metadata = {
  title: "Semantic Tree Visualization Dashboard",
  description: "Interactive visualization of conversation flows and semantic relationships",
  keywords: ["conversation", "semantic", "visualization", "tree", "graph", "NLP"],
  authors: [{ name: "Semantic Tree Team" }],
  creator: "Semantic Tree Visualization",
  publisher: "Semantic Tree Dashboard",
  applicationName: "Semantic Tree Visualization",
  generator: "Next.js",
  viewport: "width=device-width, initial-scale=1",
  robots: "index,follow",
  openGraph: {
    title: "Semantic Tree Visualization Dashboard",
    description: "Interactive visualization of conversation flows and semantic relationships",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="antialiased bg-gray-50">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
