import "./globals.css";

export const metadata = {
  title: "Cosmic Clicker - Next.js 16 Game",
  description: "An exciting cosmic-themed clicker game built with Next.js 16",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
