import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bầu cử ĐBQH và HĐND các cấp - Phường Ayun Pa",
  description: "Webapp theo dõi tiến độ bầu cử Phường Ayun Pa"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
