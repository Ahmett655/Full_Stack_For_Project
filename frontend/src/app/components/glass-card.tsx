import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function GlassCard({ className = "", children }: Props) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}
