// app/layout.tsx
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "GearGuard",
  description: "GearGuard Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
