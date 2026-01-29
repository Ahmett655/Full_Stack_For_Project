import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SecondaryButton({ className = "", children, ...rest }: Props) {
  return (
    <button className={`btn btn-secondary ${className}`} {...rest}>
      {children}
    </button>
  );
}
