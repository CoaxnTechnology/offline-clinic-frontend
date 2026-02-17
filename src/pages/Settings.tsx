import { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";

export default function SettingsPage() {
  console.log("✅ SettingsPage RENDERED");

  const [hospitalName, setHospitalName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [website, setWebsite] = useState("");

  /* =====================
     DIRECT FETCH API
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("🔑 TOKEN:", token);

    if (!token) {
      console.log("❌ No token found");
      return;
    }

    const clinicId = 12; // 🔥 direct for now
    const url = `https://api.clinicalgynecologists.space/api/clinics/${clinicId}`;

    console.log("➡️ FETCH URL:", url);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("⬅️ STATUS:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("⬅️ RESPONSE DATA:", data);

        if (!data?.success) {
          console.log("❌ API failed");
          return;
        }

        const clinic = data.data;

        // ✅ CORRECT MAPPING
        setHospitalName(clinic.name || "");
        setEmail(clinic.email || "");
        setContactNumber(clinic.phone || "");
        setAddress(clinic.address || "");
        setRegistrationNumber(clinic.license_key || "");

        // doctor object se
        setDoctorName(
          clinic.doctor
            ? `${clinic.doctor.first_name || ""} ${
                clinic.doctor.last_name || ""
              }`.trim()
            : "",
        );

        // optional (agar backend me ho)
        setWebsite(""); // backend me website field nahi hai
      })
      .catch((err) => {
        console.error("🔥 FETCH ERROR:", err);
      });
  }, []);

  /* =====================
     LOGO PREVIEW
  ===================== */
  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
    }
  };

  const handleSave = () => {
    console.log("💾 SAVE CLICKED");
  };

  /* =====================
     UI (UNCHANGED)
  ===================== */
  return (
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

            <label className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg cursor-pointer hover:bg-green-600">
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
            className="w-full px-4 py-2 rounded-lg border"
          />
          <input
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Doctor Name"
            className="w-full px-4 py-2 rounded-lg border"
          />
          <input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Contact Number"
            className="w-full px-4 py-2 rounded-lg border"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border"
          />
          <input
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Registration Number"
            className="w-full px-4 py-2 rounded-lg border"
          />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website"
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Hospital Address"
          className="w-full px-4 py-2 rounded-lg border"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-green-600"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
