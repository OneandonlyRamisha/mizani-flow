import { forwardRef } from "react";
import styles from "./customCursor.module.css";

// Import ensures CSS module is included in the bundle.
// The actual styles use :global(.custom-cursor) so FlowSite.tsx
// can continue to manipulate classList directly.
void styles;

const CustomCursor = forwardRef<HTMLDivElement>(function CustomCursor(_, ref) {
  return <div ref={ref} className="custom-cursor" />;
});

export default CustomCursor;
