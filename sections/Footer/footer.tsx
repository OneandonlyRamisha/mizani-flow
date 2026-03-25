import { forwardRef } from "react";
import { type Lang, t } from "@/lib/translations";
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
      <button className={`footer-cta ${styles.cta}`}>
        {t("footerCta", lang)}
      </button>
      <div className={`footer-copy ${styles.copy}`}>
        {t("footerCopy", lang)}
      </div>
    </div>
  );
});

export default Footer;
