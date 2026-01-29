import { useState } from "react";
import { api } from "../lib/api";
import GlassCard from "../app/components/glass-card";
import InputField from "../app/components/input-field";
import SelectDropdown from "../app/components/select-dropdown";
import UploadBox from "../app/components/upload-box";
import PrimaryButton from "../app/components/primary-button";
import SecondaryButton from "../app/components/secondary-button";
import Modal from "../app/components/modal";
import { useNavigate } from "react-router-dom";

export default function RequestForm() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    placeOfBirth: "",
    yearOfBirth: "",
    vehicleName: "",
    category: "A1",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submit = async () => {
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("placeOfBirth", form.placeOfBirth);
      fd.append("yearOfBirth", form.yearOfBirth);
      fd.append("vehicleName", form.vehicleName);
      fd.append("vehicleType", form.category);
      if (image) fd.append("image", image);

      await api.post("/api/requests", fd);
      setShowSuccess(true);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlassCard className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-1">Request License Card</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Fill the form below to request your driving license
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />

          <InputField
            label="Place of Birth"
            value={form.placeOfBirth}
            onChange={(v) => setForm({ ...form, placeOfBirth: v })}
          />

          <InputField
            label="Year of Birth"
            type="number"
            value={form.yearOfBirth}
            onChange={(v) => setForm({ ...form, yearOfBirth: v })}
          />

          <InputField
            label="Vehicle Name"
            value={form.vehicleName}
            onChange={(v) => setForm({ ...form, vehicleName: v })}
          />

          <SelectDropdown
            label="Vehicle Category"
            value={form.category}
            options={["A1", "A", "B", "C", "D"]}
            onChange={(v) => setForm({ ...form, category: v })}
          />
        </div>

        <div className="mt-6">
          <UploadBox
            label="Upload Photo"
            hint="Upload passport-size photo (JPG or PNG)"
            onFileSelect={(f) => setImage(f)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <SecondaryButton onClick={() => nav(-1)}>
            Back
          </SecondaryButton>

          <PrimaryButton loading={loading} onClick={submit}>
            Submit Request
          </PrimaryButton>
        </div>
      </GlassCard>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <h3 className="text-lg font-semibold mb-2">
            Request Submitted
          </h3>
          <p className="text-sm mb-4">
            Your request has been processed. If you want to complete, Pay Now.
          </p>

          <div className="flex justify-end gap-3">
            <SecondaryButton onClick={() => setShowSuccess(false)}>
              Later
            </SecondaryButton>

            <PrimaryButton
              className="bg-green-500 hover:bg-green-600"
              onClick={() => nav("/app/user/requests")}
            >
              Pay Now
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </>
  );
}
