import type { Metadata } from "next";
import { Barlow_Condensed, Lora } from "next/font/google";
import "./globals.css";
import loaderStyles from "./loader.module.css";

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
          className="grainSvg"
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
        <div id="site-loader" className={loaderStyles.loader}>
          <div className={loaderStyles.line} />
        </div>
        {children}
      </body>
    </html>
  );
}
