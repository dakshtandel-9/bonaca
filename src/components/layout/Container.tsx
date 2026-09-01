import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** Element to render, so containers stay semantically correct. */
  as?: ElementType;
}

/**
 * Structural width wrapper. It only centres content and applies horizontal
 * padding — all visual styling is deliberately left to the design phase.
 */
export default function Container({ children, as: Tag = "div" }: ContainerProps) {
  return <Tag className="container">{children}</Tag>;
}
