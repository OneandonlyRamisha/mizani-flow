import { forwardRef } from "react";
import { type Lang, t } from "@/lib/translations";
import styles from "./stats.module.css";
import SectionHeader from "@/components/SectionHeader/SectionHeader";

interface StatsProps {
  lang: Lang;
}

const Stats = forwardRef<HTMLDivElement, StatsProps>(function Stats({ lang }, ref) {
  const statItems = [
    { value: "3", suffix: "X", label: t("stat1Label", lang) },
    { value: "94", suffix: "%", label: t("stat2Label", lang) },
    { value: "12", suffix: "HR", label: t("stat3Label", lang) },
    { value: "0", suffix: "", label: t("stat4Label", lang) },
  ];

  const ingredientItems = [
    { name: t("statsIng1Name", lang), dose: "500", unit: "MG", desc: t("statsIng1Desc", lang) },
    { name: t("statsIng2Name", lang), dose: "200", unit: "MG", desc: t("statsIng2Desc", lang) },
    { name: t("statsIng3Name", lang), dose: "500", unit: "MG", desc: t("statsIng3Desc", lang) },
    { name: t("statsIng4Name", lang), dose: "200", unit: "MG", desc: t("statsIng4Desc", lang) },
    { name: t("statsIng5Name", lang), dose: "5", unit: "G", desc: t("statsIng5Desc", lang) },
  ];

  return (
    <div ref={ref} className={styles.section}>
      <SectionHeader
        label={t("statsLabel", lang)}
        title={t("statsTitle", lang)}
        className={styles.heading}
        labelClassName="science-label"
        titleClassName={`science-heading ${styles.title}`}
      />

      <div className={`stats-row ${styles.statsRow}`}>
        {statItems.map((stat, i) => (
          <div
            key={i}
            className={styles.statItem}
          >
            <div className={styles.statValue}>
              <span
                className={`stat-number ${styles.statNumber}`}
                data-value={stat.value}
                data-decimals="0"
              >
                {stat.value}
              </span>
              {stat.suffix && (
                <span className={styles.statSuffix}>{stat.suffix}</span>
              )}
            </div>
            <span className={`label ${styles.statLabel}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.ingredientsHeading}>
        <span className={`label ${styles.ingredientsLabel}`}>
          {t("statsInsideLabel", lang)}
        </span>
      </div>

      <div className={`ingredients-strip ${styles.ingredientsStrip}`}>
        {ingredientItems.map((ing, i) => (
          <div key={i} className={styles.ingredientCard}>
            <div className={styles.ingredientValue}>
              <span
                className={`stat-number ${styles.ingredientNumber}`}
                data-value={ing.dose}
                data-decimals="0"
              >
                {ing.dose}
              </span>
              <span className={styles.ingredientUnit}>{ing.unit}</span>
            </div>
            <div className={styles.ingredientName}>{ing.name}</div>
            <div className={styles.ingredientDesc}>{ing.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Stats;
