import { forwardRef } from "react";

const CustomCursor = forwardRef<HTMLDivElement>(function CustomCursor(_, ref) {
  return <div ref={ref} className="custom-cursor" />;
});

export default CustomCursor;
