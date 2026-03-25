import { type Lang } from "@/lib/translations";
import styles from "./languageToggle.module.css";

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
}

export default function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button className={styles.toggle} onClick={onToggle}>
      {lang === "en" ? "GE" : "EN"}
    </button>
  );
}
