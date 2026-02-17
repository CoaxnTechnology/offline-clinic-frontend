import { useState } from "react";
import { Upload, Save } from "lucide-react";

export default function SettingsPage() {
  const [hospitalName, setHospitalName] = useState("City Care Hospital");
  const [logo, setLogo] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [website, setWebsite] = useState("");

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
    }
  };

  const handleSave = () => {
    const settingsData = {
      hospitalName,
      address,
      contactNumber,
      email,
      doctorName,
      registrationNumber,
      website,
      logo,
    };

    console.log("Saving Settings:", settingsData);

    alert("Settings Saved Successfully ✅");
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Hospital Settings</h1>
        <p className="text-sm text-gray-500">
          Manage hospital information and branding
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 max-w-4xl">

        {/* LOGO SECTION */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Hospital Logo</h2>

          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-xl border flex items-center justify-center overflow-hidden bg-gray-50">
              {logo ? (
                <img src={logo} alt="logo" className="h-full w-full object-cover" />
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

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Doctor Name
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="hospital@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Registration Number
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="REG-123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="https://hospital.com"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Hospital Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
            rows={3}
            placeholder="Enter full hospital address"
          />
        </div>

        {/* SAVE BUTTON */}
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
