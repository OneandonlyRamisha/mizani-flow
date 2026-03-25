import { forwardRef, useMemo } from "react";
import { type Lang, t } from "@/lib/translations";
import styles from "./brew.module.css";

const getBrewSteps = (lang: Lang) => [
  { step: "01", title: t("brew1Title", lang), instruction: t("brew1Instruction", lang), detail: t("brew1Detail", lang), duration: t("brew1Duration", lang) },
  { step: "02", title: t("brew2Title", lang), instruction: t("brew2Instruction", lang), detail: t("brew2Detail", lang), duration: t("brew2Duration", lang) },
  { step: "03", title: t("brew3Title", lang), instruction: t("brew3Instruction", lang), detail: t("brew3Detail", lang), duration: t("brew3Duration", lang) },
  { step: "04", title: t("brew4Title", lang), instruction: t("brew4Instruction", lang), detail: t("brew4Detail", lang), duration: t("brew4Duration", lang) },
];

interface BrewProps {
  lang: Lang;
}

const Brew = forwardRef<HTMLDivElement, BrewProps>(function Brew({ lang }, ref) {
  const steps = useMemo(() => getBrewSteps(lang), [lang]);

  return (
    <div ref={ref} className={styles.section}>
      <div className={styles.header}>
        <span className={`label ${styles.label}`}>
          {t("brewLabel", lang)}
        </span>
        <h2 className={`brew-heading display-lg ${styles.title}`}>
          {t("brewTitle", lang)}
        </h2>
      </div>

      <div className={styles.stepList}>
        {steps.map((s, i) => (
          <div
            key={i}
            className={`brew-step ${styles.step}`}
            style={i === steps.length - 1 ? { borderBottom: "1px solid rgba(245,240,232,0.08)" } : undefined}
          >
            <div className={styles.stepNumberWrap}>
              <span className={`brew-step-number ${styles.stepNumber}`}>
                {s.step}
              </span>
            </div>

            <div className={styles.stepContent}>
              <div className={styles.stepTitleRow}>
                <h3 className={`brew-step-title ${styles.stepTitle}`}>
                  {s.title}
                </h3>
                <span className={`brew-step-duration ${styles.stepDuration}`}>
                  {s.duration}
                </span>
              </div>
              <p className={`brew-step-instruction body-lg ${styles.stepInstruction}`}>
                {s.instruction}
              </p>
              <p className={`brew-step-detail body ${styles.stepDetail}`}>
                {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Brew;
