import { forwardRef, useMemo } from "react";
import { type Lang, t } from "@/lib/translations";
import styles from "./testimonials.module.css";

const getTestimonials = (lang: Lang) => [
  { quote: t("test1Quote", lang), author: t("test1Author", lang), role: t("test1Role", lang) },
  { quote: t("test2Quote", lang), author: t("test2Author", lang), role: t("test2Role", lang) },
  { quote: t("test3Quote", lang), author: t("test3Author", lang), role: t("test3Role", lang) },
  { quote: t("test4Quote", lang), author: t("test4Author", lang), role: t("test4Role", lang) },
  { quote: t("test5Quote", lang), author: t("test5Author", lang), role: t("test5Role", lang) },
];

interface TestimonialsProps {
  lang: Lang;
}

const Testimonials = forwardRef<HTMLDivElement, TestimonialsProps>(function Testimonials({ lang }, ref) {
  const testimonials = useMemo(() => getTestimonials(lang), [lang]);

  return (
    <div ref={ref} className={styles.section}>
      <div className={styles.viewport}>
        <div className={`testimonial-track ${styles.track}`}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className={`testimonial-card ${styles.card}`}>
              <p className={styles.quote}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <div className={styles.author}>{testimonial.author}</div>
                <div className={`label ${styles.role}`}>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Testimonials;
