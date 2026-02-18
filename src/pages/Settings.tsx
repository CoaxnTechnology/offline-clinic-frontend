import { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast, Toaster } from "sonner";

/* =====================
   JWT TYPE
===================== */
interface DecodedToken {
  clinic_id?: number;
  role?: string;
  exp: number;
}

export default function SettingsPage() {
  console.log("✅ SettingsPage RENDERED");

  const [clinicId, setClinicId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [hospitalName, setHospitalName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [website, setWebsite] = useState("");

  const [saving, setSaving] = useState(false);

  /* =====================
     JWT DECODE
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("🧠 [SETTINGS] access_token:", token);

    if (!token) {
      console.error("❌ [SETTINGS] No token found");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("🧠 [SETTINGS] decoded token:", decoded);

      if (!decoded.clinic_id) {
        console.error("❌ [SETTINGS] clinic_id missing in token");
        return;
      }

      setClinicId(decoded.clinic_id);
      setRole(decoded.role || null);
    } catch (err) {
      console.error("❌ [SETTINGS] token decode failed", err);
    }
  }, []);

  /* =====================
     FETCH CLINIC DATA
  ===================== */
  useEffect(() => {
    if (!clinicId || !role) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const baseUrl =
      role === "super_admin"
        ? "https://api.clinicalgynecologists.space/api/super-admin/clinics"
        : "https://api.clinicalgynecologists.space/api/clinics";

    const url = `${baseUrl}/${clinicId}`;

    console.log("➡️ [SETTINGS] FETCH URL:", url);
    console.log("➡️ [SETTINGS] ROLE:", role);

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("⬅️ [SETTINGS] STATUS:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("⬅️ [SETTINGS] RESPONSE:", data);

        if (!data?.success) {
          toast.error("Failed to load clinic data ❌");
          return;
        }

        const clinic = data.data;

        setHospitalName(clinic.hospital_name || clinic.name || "");
        setEmail(clinic.email || "");
        setContactNumber(clinic.contact_number || clinic.phone || "");
        setAddress(clinic.clinic_address || clinic.address || "");
        setRegistrationNumber(clinic.license_name || clinic.license_key || "");

        setDoctorName(
          clinic.doctor
            ? `${clinic.doctor.first_name || ""} ${
                clinic.doctor.last_name || ""
              }`.trim()
            : "",
        );

        // ✅ LOGO (NO /logo API CALL)
        if (clinic.logo_url) {
          console.log("🖼️ Fetching logo with auth:", clinic.logo_url);

          fetch(clinic.logo_url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              console.log("🖼️ Logo status:", res.status);
              return res.blob();
            })
            .then((blob) => {
              const objectUrl = URL.createObjectURL(blob);
              setLogo(objectUrl);
            })
            .catch((err) => {
              console.error("❌ Logo load failed", err);
            });
        }
      })
      .catch((err) => {
        console.error("🔥 [SETTINGS] FETCH ERROR:", err);
        toast.error("Clinic fetch error ❌");
      });
  }, [clinicId, role]);

  /* =====================
     LOGO PREVIEW
  ===================== */
  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
    }
  };

  /* =====================
     CONFIRM SAVE
  ===================== */
  const handleSave = () => {
    if (!clinicId || !role) return;

    toast("Confirm update?", {
      description: "Do you want to save these hospital settings?",
      action: {
        label: "Yes, Save",
        onClick: () => updateClinic(),
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  /* =====================
     UPDATE CLINIC
  ===================== */
  const updateClinic = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !clinicId || !role) return;

    setSaving(true);

    const baseUrl =
      role === "super_admin"
        ? "https://api.clinicalgynecologists.space/api/super-admin/clinics"
        : "https://api.clinicalgynecologists.space/api/clinics";

    const url = `${baseUrl}/${clinicId}`;

    console.log("➡️ [SETTINGS] UPDATE URL:", url);

    const formData = new FormData();
    formData.append("hospital_name", hospitalName);
    formData.append("doctor_name", doctorName);
    formData.append("contact_number", contactNumber);
    formData.append("email", email);
    formData.append("license_name", registrationNumber);
    formData.append("clinic_address", address);
    formData.append("website", website);

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("⬅️ [SETTINGS] UPDATE STATUS:", res.status);

      const data = await res.json();
      console.log("⬅️ [SETTINGS] UPDATE RESPONSE:", data);

      if (!res.ok || !data.success) {
        throw new Error();
      }

      toast.success("Settings updated successfully ✅");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error("Failed to update settings ❌");
    } finally {
      setSaving(false);
    }
  };

  /* =====================
     UI (UNCHANGED)
  ===================== */
  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Hospital Settings</h1>
          <p className="text-sm text-gray-500">
            Manage hospital information and branding
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 max-w-4xl">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Hospital Logo</h2>

            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-xl border flex items-center justify-center overflow-hidden bg-gray-50">
                {logo ? (
                  <img
                    src={logo}
                    alt="logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Logo</span>
                )}
              </div>

              <label className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg cursor-pointer">
                <Upload size={16} />
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Hospital Name"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Doctor Name"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Contact Number"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Registration Number"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website"
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Hospital Address"
            className="border px-4 py-2 rounded-lg w-full"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
//new code