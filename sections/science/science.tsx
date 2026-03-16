import { forwardRef, useMemo } from "react";
import { type Lang, t } from "@/app/components/translations";
import styles from "./science.module.css";

const getPillars = (lang: Lang) => [
  { icon: "\u25CE", title: t("pillar1Title", lang), subtitle: t("pillar1Sub", lang), description: t("pillar1Desc", lang) },
  { icon: "\u25C7", title: t("pillar2Title", lang), subtitle: t("pillar2Sub", lang), description: t("pillar2Desc", lang) },
  { icon: "\u25CB", title: t("pillar3Title", lang), subtitle: t("pillar3Sub", lang), description: t("pillar3Desc", lang) },
  { icon: "\u25BD", title: t("pillar4Title", lang), subtitle: t("pillar4Sub", lang), description: t("pillar4Desc", lang) },
];

interface ScienceProps {
  lang: Lang;
}

const Science = forwardRef<HTMLDivElement, ScienceProps>(function Science({ lang }, ref) {
  const pillars = useMemo(() => getPillars(lang), [lang]);

  return (
    <div ref={ref} className={styles.section}>
      <div className={`science-header ${styles.header}`}>
        <span className={`label ${styles.label}`}>
          {t("scienceLabel", lang)}
        </span>
        <h2 className={`science-section-heading display-lg ${styles.title}`}>
          {t("scienceTitle", lang)}
        </h2>
        <p className={`body-lg science-desc ${styles.desc}`}>
          {t("scienceDesc", lang)}
        </p>
      </div>

      <div className={`pillars-grid ${styles.grid}`}>
        {pillars.map((pillar, i) => (
          <div
            key={i}
            className={`science-pillar ${styles.pillar}`}
            style={{
              borderLeft: i % 2 === 1 ? "1px solid rgba(107,31,42,0.2)" : "none",
              borderTop: i >= 2 ? "1px solid rgba(107,31,42,0.2)" : "none",
            }}
          >
            <div className={`pillar-icon ${styles.pillarIcon}`}>
              {pillar.icon}
            </div>
            <h3 className={`pillar-title ${styles.pillarTitle}`}>
              {pillar.title}
            </h3>
            <div className={`pillar-subtitle ${styles.pillarSubtitle}`}>
              {pillar.subtitle}
            </div>
            <p className={`pillar-desc body ${styles.pillarDesc}`}>
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Science;
