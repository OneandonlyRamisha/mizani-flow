import { forwardRef } from "react";
import { type Lang, t } from "@/app/components/translations";
import styles from "./hero.module.css";

// Coffee bean positions — distributed around hero edges, away from center text
export const BEANS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + 0.3;
  const radius = 28 + (i % 5) * 8;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  const size = 18 + (i % 4) * 10;
  const rotation = (i * 47 + 15) % 360;
  const variant = i % 4;
  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(3, Math.min(97, y)),
    size,
    rotation,
    variant,
    delay: i * 0.12,
  };
});

interface HeroProps {
  lang: Lang;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(function Hero({ lang }, ref) {
  return (
    <div ref={ref} className={styles.section}>
      {/* Animated radial rings */}
      {[1, 2, 3, 4, 5].map((ring) => (
        <div
          key={ring}
          className={`hero-ring ${styles.ring}`}
          style={{
            width: `${ring * 18}vmin`,
            height: `${ring * 18}vmin`,
            border: `1px solid rgba(107, 31, 42, ${0.15 - ring * 0.02})`,
          }}
        />
      ))}

      {/* Floating particles */}
      <div className={styles.particles}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`hero-particle ${styles.particle}`}
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              background: i % 4 === 0
                ? "rgba(107, 31, 42, 0.4)"
                : "rgba(245, 240, 232, 0.15)",
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              opacity: i % 3 === 0 ? 0.5 : 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating coffee beans — cursor reactive */}
      <div className={styles.beansContainer}>
        {BEANS.map((bean, i) => (
          <svg
            key={i}
            className={`hero-bean ${styles.bean}`}
            viewBox="0 0 40 56"
            style={{
              left: `${bean.x}%`,
              top: `${bean.y}%`,
              width: `${bean.size}px`,
              height: `${bean.size * 1.4}px`,
              transform: `translate(-50%, -50%) rotate(${bean.rotation}deg)`,
              opacity: bean.variant === 0 ? 0.7 : bean.variant === 2 ? 0.5 : 0.6,
            }}
          >
            <ellipse
              cx="20" cy="28" rx="16" ry="24"
              fill={
                bean.variant === 0 ? "rgba(107, 31, 42, 0.25)"
                  : bean.variant === 2 ? "rgba(107, 31, 42, 0.10)"
                    : "none"
              }
              stroke={
                bean.variant === 1 ? "rgba(107, 31, 42, 0.3)"
                  : bean.variant === 3 ? "rgba(245, 240, 232, 0.1)"
                    : bean.variant === 0 ? "rgba(107, 31, 42, 0.35)"
                      : "rgba(107, 31, 42, 0.15)"
              }
              strokeWidth="1"
            />
            <path
              d="M20 6 C16 18, 16 38, 20 50 C24 38, 24 18, 20 6"
              fill="none"
              stroke={
                bean.variant === 1 || bean.variant === 3
                  ? "rgba(107, 31, 42, 0.2)"
                  : "rgba(107, 31, 42, 0.3)"
              }
              strokeWidth="0.8"
            />
          </svg>
        ))}
      </div>

      {/* Corner accents */}
      <div className={`hero-corner hero-corner-tl ${styles.cornerTl}`}>
        <div className={styles.cornerLine} />
        <div className={styles.cornerText}>{t("heroEst", lang)}</div>
      </div>
      <div className={`hero-corner hero-corner-tr ${styles.cornerTr}`}>
        <div className={`${styles.cornerLine} ${styles.cornerLineRight}`} />
        <div className={styles.cornerText}>{t("heroBlend", lang)}</div>
      </div>
      <div className={`hero-corner hero-corner-bl ${styles.cornerBl}`}>
        <div className={`${styles.cornerText} ${styles.cornerVertical}`}>
          {t("heroNootropic", lang)}
        </div>
      </div>
      <div className={`hero-corner hero-corner-br ${styles.cornerBr}`}>
        <div className={`${styles.cornerText} ${styles.cornerVerticalRight}`}>
          {t("heroCornerBR", lang)}
        </div>
      </div>

      {/* Horizontal rule expanding from center */}
      <div className={`hero-rule ${styles.rule}`} />

      {/* Main text content */}
      <div className={`hero-text-reveal ${styles.labelText}`}>
        {t("heroLabel", lang)}
      </div>

      {/* FLOW wordmark — letter split */}
      <div className={`hero-wordmark ${styles.wordmark}`}>
        {t("heroWordmark", lang).split("").map((letter, i) => (
          <span key={i} className={`hero-letter ${styles.letter}`}>
            {letter}
          </span>
        ))}
      </div>

      <h2 className={`hero-text-reveal display-md ${styles.heroTitle}`}>
        {t("heroTitle", lang)}
      </h2>

      <div className={`hero-text-reveal ${styles.subtitle}`}>
        {t("heroSubtitle", lang)}
      </div>

      {/* Scroll indicator */}
      <div className={`scroll-indicator ${styles.scrollIndicator}`}>
        <span className={styles.scrollText}>{t("heroScroll", lang)}</span>
        <div className={styles.scrollLine} />
      </div>
    </div>
  );
});

export default Hero;
