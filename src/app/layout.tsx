import type { Metadata } from "next";
import { Barlow_Condensed, Lora } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FLOW | Performance Coffee",
  description:
    "Premium performance coffee enhanced with nootropics for sustained focus, clarity, and endurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Record page load start time before anything renders */}
        <script dangerouslySetInnerHTML={{ __html: "window.__LOAD_START=Date.now();" }} />
      </head>
      <body className={`${barlowCondensed.variable} ${lora.variable}`}>
        <svg
          style={{ position: "absolute", width: 0, height: 0 }}
          aria-hidden="true"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        {/* Loader — server-rendered, visible instantly before JS */}
        <div
          id="site-loader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="loader-line-el" />
        </div>
        {children}
      </body>
    </html>
  );
}
