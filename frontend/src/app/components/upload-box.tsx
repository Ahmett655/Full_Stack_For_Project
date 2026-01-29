import React, { useMemo, useState } from "react";

type Props = {
  label: string;
  hint?: string;
  onFileSelect: (f: File | null) => void;
};

export default function UploadBox({ label, hint, onFileSelect }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  return (
    <div className="field">
      <label className="field-label">{label}</label>

      <div className="upload-box">
        <div className="upload-preview">
          {file ? (
            <img className="upload-img" src={previewUrl} alt="preview" />
          ) : (
            <div className="upload-empty">No image selected</div>
          )}
        </div>

        <div className="upload-actions">
          <input
            className="upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              onFileSelect(f);
            }}
          />
          {hint && <div className="upload-hint">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
