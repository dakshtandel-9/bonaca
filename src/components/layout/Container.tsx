import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** Element to render, so containers stay semantically correct. */
  as?: ElementType;
  /** "wide" removes the max-width cap for full-bleed bands. */
  width?: "default" | "wide" | "narrow";
  className?: string;
}

/** Structural width wrapper: centring and horizontal gutters, nothing more. */
export default function Container({
  children,
  as: Tag = "div",
  width = "default",
  className,
}: ContainerProps) {
  return (
    <Tag className={className ? `container ${className}` : "container"} data-width={width}>
      {children}
    </Tag>
  );
}
