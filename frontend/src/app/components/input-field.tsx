import React from "react";

type Props = {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
};

export default function InputField({ label, value, type = "text", onChange }: Props) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
