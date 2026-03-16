import { forwardRef } from "react";
import { type Lang, t } from "@/app/components/translations";
import styles from "./footer.module.css";

interface FooterProps {
  lang: Lang;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(function Footer({ lang }, ref) {
  return (
    <div ref={ref} data-persist="true" className={styles.section}>
      <div className={`footer-brand display-xl ${styles.brand}`}>
        {t("footerBrand", lang)}
      </div>
      <button
        className={`footer-cta ${styles.cta}`}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1.05)";
          (e.target as HTMLElement).style.background = "var(--maroon-light)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1)";
          (e.target as HTMLElement).style.background = "var(--maroon)";
        }}
      >
        {t("footerCta", lang)}
      </button>
      <div className={`footer-copy ${styles.copy}`}>
        {t("footerCopy", lang)}
      </div>
    </div>
  );
});

export default Footer;
