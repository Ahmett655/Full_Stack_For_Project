import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function PrimaryButton({ loading, className = "", children, ...rest }: Props) {
  return (
    <button className={`btn btn-primary ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? "Please wait..." : children}
    </button>
  );
}
