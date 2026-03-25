import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  labelClassName?: string;
  titleClassName?: string;
  descClassName?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  className,
  labelClassName,
  titleClassName,
  descClassName,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <span className={`label ${styles.label} ${labelClassName || ""}`.trim()}>{label}</span>
      <h2 className={`display-lg ${titleClassName || ""}`.trim()}>{title}</h2>
      {description && (
        <p className={`body-lg ${descClassName || ""}`.trim()}>{description}</p>
      )}
    </div>
  );
}
