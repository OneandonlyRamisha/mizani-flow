import { forwardRef, useMemo } from "react";
import { type Lang, t } from "@/app/components/translations";
import styles from "./ingredients.module.css";

const getIngredients = (lang: Lang) => [
  { label: t("ing1Label", lang), name: t("ing1Name", lang), dose: t("ing1Dose", lang), description: t("ing1Desc", lang), detail: t("ing1Detail", lang) },
  { label: t("ing2Label", lang), name: t("ing2Name", lang), dose: t("ing2Dose", lang), description: t("ing2Desc", lang), detail: t("ing2Detail", lang) },
  { label: t("ing3Label", lang), name: t("ing3Name", lang), dose: t("ing3Dose", lang), description: t("ing3Desc", lang), detail: t("ing3Detail", lang) },
  { label: t("ing4Label", lang), name: t("ing4Name", lang), dose: t("ing4Dose", lang), description: t("ing4Desc", lang), detail: t("ing4Detail", lang) },
  { label: t("ing5Label", lang), name: t("ing5Name", lang), dose: t("ing5Dose", lang), description: t("ing5Desc", lang), detail: t("ing5Detail", lang) },
];

interface IngredientsProps {
  lang: Lang;
}

const Ingredients = forwardRef<HTMLDivElement, IngredientsProps>(function Ingredients({ lang }, ref) {
  const ingredients = useMemo(() => getIngredients(lang), [lang]);

  return (
    <div ref={ref} className={styles.section}>
      <div className={styles.header}>
        <span className={`label ${styles.label}`}>
          {t("ingredientsLabel", lang)}
        </span>
        <h2 className={`display-lg ${styles.title}`}>
          {t("ingredientsTitle", lang)}
        </h2>
      </div>

      {ingredients.map((item, i) => (
        <div
          key={i}
          className={`ingredient-item ${styles.item}`}
          style={{ flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
        >
          <div className={styles.itemContent}>
            <span className={`ingredient-label label ${styles.itemLabel}`}>
              {item.label}
            </span>
            <h3 className={`ingredient-heading ${styles.itemHeading}`}>
              {item.name}
              <span className={styles.itemDose}>{item.dose}</span>
            </h3>
            <p className={`ingredient-desc body-lg ${styles.itemDesc}`}>
              {item.description}
            </p>
            <p className={`ingredient-detail ${styles.itemDetail}`}>
              {item.detail}
            </p>
          </div>
          <div className={styles.itemSpacer} />
        </div>
      ))}
    </div>
  );
});

export default Ingredients;
