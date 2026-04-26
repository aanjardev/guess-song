import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Guess The Song - by aanjar",
  description: "A fun and addictive music guessing game built with Next.js, Tailwind CSS, and the iTunes API. Test your music knowledge by guessing songs based on short clips. Challenge yourself and compete with friends to see who can guess the most songs correctly!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        {children}

        {/* Watermark */}
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="text-gray-600 text-lg font-light select-none">
            Made by aanjar.
          </div>
        </div>
      </body>
    </html>
  );
}
