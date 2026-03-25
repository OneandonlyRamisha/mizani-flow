import { forwardRef } from "react";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  children: React.ReactNode;
  variant?: "reveal" | "scroll";
}

const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { children, variant = "reveal" },
  ref
) {
  return (
    <div
      ref={ref}
      className={`marquee-divider ${styles.wrap} ${variant === "scroll" ? styles.wrapScroll : ""}`}
    >
      <div
        className={`marquee-text ${styles.text} ${variant === "scroll" ? styles.textScroll : ""}`}
      >
        {children}
      </div>
    </div>
  );
});

export default Marquee;
