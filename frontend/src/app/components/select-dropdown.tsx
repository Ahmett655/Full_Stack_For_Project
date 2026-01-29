import React from "react";

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export default function SelectDropdown({ label, value, options, onChange }: Props) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
