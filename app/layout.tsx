import type { Metadata } from "next";
import { Barlow_Condensed, Lora } from "next/font/google";
import "./globals.css";
import styles from "./loader.module.css";

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
        <div id="site-loader" className={styles.loader}>

          {/* Corner labels */}
          <span className={styles.cornerTl}>Est. MMXXV</span>
          <span className={styles.cornerBr}>Nootropic Blend</span>

          {/* Decorative ambient beans */}
          <svg className={`${styles.bean} ${styles.beanLeft}`} viewBox="0 0 40 56" aria-hidden="true">
            <ellipse cx="20" cy="28" rx="16" ry="24" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="1.2" />
            <path d="M20 6 C16 18, 16 38, 20 50 C24 38, 24 18, 20 6" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="0.8" />
          </svg>
          <svg className={`${styles.bean} ${styles.beanRight}`} viewBox="0 0 40 56" aria-hidden="true">
            <ellipse cx="20" cy="28" rx="16" ry="24" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="1.2" />
            <path d="M20 6 C16 18, 16 38, 20 50 C24 38, 24 18, 20 6" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="0.8" />
          </svg>
          <svg className={`${styles.bean} ${styles.beanTopRight}`} viewBox="0 0 40 56" aria-hidden="true">
            <ellipse cx="20" cy="28" rx="16" ry="24" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="1.2" />
            <path d="M20 6 C16 18, 16 38, 20 50 C24 38, 24 18, 20 6" fill="none" stroke="rgba(245,240,232,1)" strokeWidth="0.8" />
          </svg>

          {/* Center stack */}
          <div className={styles.center}>
            <div className={styles.tagline}>Performance Coffee</div>
            <div className={styles.wordmark}>Flow</div>

            {/* Progress bar */}
            <div className={styles.barWrap}>
              <div className={styles.bar} id="loader-bar" />
            </div>

            {/* Percentage */}
            <div className={styles.pct} id="loader-pct">0</div>
          </div>

        </div>

        {children}
      </body>
    </html>
  );
}
