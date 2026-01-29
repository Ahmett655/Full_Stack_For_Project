// frontend/src/pages/UserRequestNewPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

type CreateReqRes = {
  _id: string;
  fullName: string;
  placeOfBirth: string;
  yearOfBirth: number;
  vehicleName: string;
  vehicleType?: string;
  image?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
};

export default function UserRequestNewPage() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("A1");

  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim() &&
      placeOfBirth.trim() &&
      yearOfBirth.trim() &&
      vehicleName.trim() &&
      vehicleType.trim()
    );
  }, [fullName, placeOfBirth, yearOfBirth, vehicleName, vehicleType]);

  const onPickPhoto = (f: File | null) => {
    setPhoto(f);
    if (!f) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fullName", fullName.trim());
      fd.append("placeOfBirth", placeOfBirth.trim());
      fd.append("yearOfBirth", yearOfBirth.trim());
      fd.append("vehicleName", vehicleName.trim());
      fd.append("vehicleType", vehicleType.trim());
      if (photo) fd.append("image", photo); // ✅ backend multer field name: "image"

      const res = await api.post<CreateReqRes>("/api/requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ after submit -> go to pay page (or show your modal in your own logic)
      nav(`/app/user/pay/${res.data._id}`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 0px)",
        padding: "28px 24px", // ✅ space from wall
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 14, // ✅ space under top buttons
        }}
      >
        <button
          type="button"
          className="btn"
          style={{ padding: "8px 14px" }}
          onClick={() => nav("/app/user/dashboard")}
        >
          Back
        </button>

        <button
          type="button"
          className="btn"
          style={{ padding: "8px 14px" }}
          onClick={() => nav("/app/user/requests")}
        >
          My Requests
        </button>
      </div>

      {/* Main card */}
      <div
        className="card"
        style={{
          padding: "22px 22px", // ✅ space inside card (fix wall sticking)
          borderRadius: 14,
        }}
      >
        <h2 style={{ margin: "0 0 8px 0" }}>Request License Card</h2>
        <p style={{ margin: "0 0 16px 0", opacity: 0.9 }}>
          Fill the form below to request your driving license
        </p>

        {err && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,90,90,.35)",
              background: "rgba(255,90,90,.08)",
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 14, // ✅ space between inputs
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="input"
                style={{ padding: "12px 12px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Place of Birth</label>
              <input
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="Enter place of birth"
                className="input"
                style={{ padding: "12px 12px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Year of Birth</label>
              <input
                value={yearOfBirth}
                onChange={(e) => setYearOfBirth(e.target.value)}
                placeholder="e.g. 2000"
                className="input"
                style={{ padding: "12px 12px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Vehicle Name</label>
              <input
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="e.g. V8"
                className="input"
                style={{ padding: "12px 12px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Vehicle Category</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="input"
                style={{ padding: "12px 12px" }}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Upload row */}
            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Upload Photo</label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 16, // ✅ space between preview and chooser
                  alignItems: "center",
                }}
              >
                {/* Preview box */}
                <div
                  style={{
                    width: 160,
                    height: 120,
                    borderRadius: 12,
                    border: "1px dashed rgba(255,255,255,.20)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "rgba(0,0,0,.15)",
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>No image selected</div>
                  )}
                </div>

                {/* Choose file */}
                <div style={{ display: "grid", gap: 8 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickPhoto(e.target.files?.[0] || null)}
                  />
                  <small style={{ opacity: 0.75 }}>
                    Upload passport-size photo (JPG or PNG)
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18, // ✅ space before buttons
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              type="button"
              className="btn"
              style={{ padding: "10px 14px" }}
              onClick={() => nav("/app/user/dashboard")}
            >
              Back
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !canSubmit}
              style={{ padding: "10px 16px", minWidth: 160 }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
