"use client";

import { forwardRef, useMemo, useState, useCallback } from "react";
import { type Lang, t } from "@/lib/translations";
import styles from "./faq.module.css";

const getFaqs = (lang: Lang) => [
  { q: t("faq1Q", lang), a: t("faq1A", lang) },
  { q: t("faq2Q", lang), a: t("faq2A", lang) },
  { q: t("faq3Q", lang), a: t("faq3A", lang) },
  { q: t("faq4Q", lang), a: t("faq4A", lang) },
  { q: t("faq5Q", lang), a: t("faq5A", lang) },
  { q: t("faq6Q", lang), a: t("faq6A", lang) },
  { q: t("faq7Q", lang), a: t("faq7A", lang) },
];

interface FaqProps {
  lang: Lang;
}

const Faq = forwardRef<HTMLDivElement, FaqProps>(function Faq({ lang }, ref) {
  const faqs = useMemo(() => getFaqs(lang), [lang]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div ref={ref} className={`faq-section ${styles.section}`}>
      {/* Left — accordion */}
      <div className={`faq-left ${styles.left}`}>
        <h2 className={`faq-heading display-lg ${styles.heading}`}>
          {t("faqTitle1", lang)}
          <br />
          {t("faqTitle2", lang)}
        </h2>

        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${styles.item}`}
          >
            <button
              className={`faq-question ${styles.question}`}
              aria-expanded={openFaq === i}
              onClick={() => toggleFaq(i)}
            >
              <span className={styles.questionText}>{faq.q}</span>
              <span
                className={`${styles.questionIcon} ${openFaq === i ? styles.questionIconOpen : ""}`}
              >
                +
              </span>
            </button>
            <div
              className={`${styles.answer} ${openFaq === i ? styles.answerOpen : ""}`}
            >
              <div className={styles.answerInner}>
                <p className={`body ${styles.answerText}`}>{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right — sticky coffee cup illustration */}
      <div className={`faq-right ${styles.right}`}>
        <div className={styles.illustration}>
          <svg viewBox="0 0 200 220" width="100%" height="100%">
            {/* Steam lines */}
            <path d="M70 50 Q75 30 70 10" fill="none" stroke="rgba(107,31,42,0.35)" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="d" values="M70 50 Q75 30 70 10;M70 50 Q65 25 70 5;M70 50 Q75 30 70 10" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M100 45 Q105 25 100 5" fill="none" stroke="rgba(107,31,42,0.3)" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="d" values="M100 45 Q105 25 100 5;M100 45 Q95 20 100 0;M100 45 Q105 25 100 5" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.6;0.25" dur="3.5s" repeatCount="indefinite" />
            </path>
            <path d="M130 50 Q135 30 130 10" fill="none" stroke="rgba(107,31,42,0.25)" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="d" values="M130 50 Q135 30 130 10;M130 50 Q125 25 130 5;M130 50 Q135 30 130 10" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
            </path>

            {/* Cup body */}
            <path d="M40 60 L45 170 Q50 190 100 190 Q150 190 155 170 L160 60 Z" fill="none" stroke="rgba(245,240,232,0.18)" strokeWidth="1.5" />
            {/* Coffee surface */}
            <ellipse cx="100" cy="62" rx="60" ry="12" fill="rgba(107,31,42,0.15)" stroke="rgba(107,31,42,0.3)" strokeWidth="1" />
            {/* Cup handle */}
            <path d="M160 85 Q190 85 190 120 Q190 155 160 155" fill="none" stroke="rgba(245,240,232,0.15)" strokeWidth="1.5" />
            {/* Saucer */}
            <ellipse cx="100" cy="195" rx="80" ry="14" fill="none" stroke="rgba(245,240,232,0.12)" strokeWidth="1" />
          </svg>

          {/* Floating beans around the cup */}
          {[
            { x: "5%", y: "8%", size: 28, rot: -30, dur: 3 },
            { x: "82%", y: "22%", size: 24, rot: 45, dur: 3.6 },
            { x: "8%", y: "60%", size: 22, rot: 15, dur: 4 },
            { x: "85%", y: "65%", size: 26, rot: -60, dur: 3.3 },
            { x: "42%", y: "90%", size: 20, rot: 25, dur: 3.8 },
            { x: "65%", y: "5%", size: 18, rot: -15, dur: 4.2 },
            { x: "20%", y: "35%", size: 16, rot: 70, dur: 3.4 },
          ].map((bean, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              width={bean.size}
              height={bean.size}
              className={styles.floatingBean}
              style={{
                left: bean.x,
                top: bean.y,
                transform: `rotate(${bean.rot}deg)`,
                animation: `faqBeanFloat ${bean.dur}s ease-in-out ${i * 0.3}s infinite alternate`,
              }}
            >
              <ellipse cx="12" cy="12" rx="8" ry="11" fill="none" stroke="rgba(107,31,42,0.5)" strokeWidth="1" />
              <path d="M12 3 Q9 12 12 21" fill="none" stroke="rgba(107,31,42,0.4)" strokeWidth="0.8" />
            </svg>
          ))}

          <div className={styles.craftedLabel}>
            <div className={`label ${styles.craftedTitle}`}>
              {t("faqCraftedLabel", lang)}
            </div>
            <div className={styles.craftedDesc}>
              {t("faqCraftedDesc1", lang)}
              <br />
              {t("faqCraftedDesc2", lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Faq;
