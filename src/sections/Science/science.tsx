import { forwardRef, useMemo } from "react";
import { type Lang, t } from "@/lib/translations";
import styles from "./science.module.css";

const getPillars = (lang: Lang) => [
  { title: t("pillar1Title", lang), subtitle: t("pillar1Sub", lang), description: t("pillar1Desc", lang), stat: t("pillar1Stat", lang), statLabel: t("pillar1StatLabel", lang) },
  { title: t("pillar2Title", lang), subtitle: t("pillar2Sub", lang), description: t("pillar2Desc", lang), stat: t("pillar2Stat", lang), statLabel: t("pillar2StatLabel", lang) },
  { title: t("pillar3Title", lang), subtitle: t("pillar3Sub", lang), description: t("pillar3Desc", lang), stat: t("pillar3Stat", lang), statLabel: t("pillar3StatLabel", lang) },
  { title: t("pillar4Title", lang), subtitle: t("pillar4Sub", lang), description: t("pillar4Desc", lang), stat: t("pillar4Stat", lang), statLabel: t("pillar4StatLabel", lang) },
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

      <div className={styles.pillarsStack}>
        {pillars.map((pillar, i) => {
          const isReversed = i % 2 === 1;
          return (
            <div
              key={i}
              className={`science-pillar ${styles.pillar} ${isReversed ? styles.pillarReversed : ""}`}
            >
              <div className={`pillar-icon ${styles.pillarIndex}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className={`pillar-title ${styles.pillarTitle}`}>
                {pillar.title}
              </h3>
              <div className={`pillar-rule ${styles.pillarRule}`} />
              <div className={styles.pillarBody}>
                <div className={`pillar-subtitle ${styles.pillarSubtitle}`}>
                  {pillar.subtitle}
                </div>
                <p className={`pillar-desc body-lg ${styles.pillarDesc}`}>
                  {pillar.description}
                </p>
                <div className={`pillar-stat ${styles.pillarStat} ${isReversed ? styles.pillarStatReversed : ""}`}>
                  <span className={styles.pillarStatValue}>{pillar.stat}</span>
                  <span className={styles.pillarStatLabel}>{pillar.statLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Science;
