import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePatientById } from "@/hooks/patients/usePatientById";
import { useUpdatePatient } from "@/hooks/patients/useUpdatePatient";

export default function EditPatient() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = usePatientById(id!);

  const updatePatient = useUpdatePatient();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    first_name: "",
    last_name: "",
    maiden_name: "",
    gender: "",
    birth_date: "",
    identity_number: "",
    social_security_number: "",
    email: "",
    phone: "",
    secondary_phone: "",
    other_phone: "",
    occupation: "",
    height: "",
    weight: "",
    blood_group: "",
    smoker: "No",
    cigarettes_per_day: "",
    family_history: "",
    medical_history: "",
    gynecological_history: "",
    allergies: "",
    notes: "",
    primary_doctor: "",
    delivery_location: "",
    legacy_number: "",
    new_patient: true,
  });
  useEffect(() => {
    if (data?.data && !formData.id) {
      setFormData(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="p-6">Loading patient...</div>;
  }

  if (!data?.data) {
    return <div className="p-6 text-red-600">Patient not found</div>;
  }

  // Load patient data from location state

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePatient = () => {
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      alert("Please fill required fields");
      return;
    }

    // ✅ CLEAN PAYLOAD (only backend-allowed fields)
    const payload: any = {
      title: formData.title || null,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,

      maiden_name: formData.maiden_name || null,
      gender: formData.gender || null,
      birth_date: formData.birth_date || null,
      identity_number: formData.identity_number || null,
      social_security_number: formData.social_security_number || null,

      secondary_phone: formData.secondary_phone || null,
      other_phone: formData.other_phone || null,
      occupation: formData.occupation || null,

      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      blood_group: formData.blood_group || null,

      // 🔥 FIXED HERE
      smoker:
        formData.smoker === "Yes"
          ? "Yes"
          : formData.smoker === "No"
          ? "No"
          : "N/A",

      cigarettes_per_day: formData.cigarettes_per_day
        ? Number(formData.cigarettes_per_day)
        : 0,

      family_history: formData.family_history || null,
      medical_history: formData.medical_history || null,
      gynecological_history: formData.gynecological_history || null,
      allergies: formData.allergies || null,
      notes: formData.notes || null,

      primary_doctor: formData.primary_doctor || null,
      delivery_location: formData.delivery_location || null,
    };

    // email only if valid
    if (formData.email && formData.email !== "N/A") {
      payload.email = formData.email.trim();
    }

    /* 🔥 IMPORTANT PART */
    if (formData.email && formData.email !== "N/A") {
      payload.email = formData.email.trim();
    }

    console.log("🟡 FINAL UPDATE PAYLOAD:", payload);

    updatePatient.mutate(
      { id: id!, data: payload },
      {
        onSuccess: () => {
          navigate("/patients");
        },
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/patients")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Patient</h1>
            <p className="text-sm text-gray-500">Update patient information</p>
          </div>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="space-y-8">
        {/* PERSONAL INFO */}
        <Section title="Personal Information">
          <Grid>
            <Input
              label="Title"
              value={formData.title}
              onChange={(value: string) => handleInputChange("title", value)}
            />
            <Input
              label="First Name *"
              value={formData.first_name}
              onChange={(value: string) =>
                handleInputChange("first_name", value)
              }
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(value: string) =>
                handleInputChange("last_name", value)
              }
            />
            <Input
              label="Maiden Name"
              value={formData.maiden_name}
              onChange={(value: string) =>
                handleInputChange("maiden_name", value)
              }
            />
            <Input
              label="Gender"
              value={formData.gender}
              onChange={(value: string) => handleInputChange("gender", value)}
            />
            <Input
              label="Birth Date"
              type="date"
              value={formData.birth_date}
              onChange={(value: string) =>
                handleInputChange("birth_date", value)
              }
            />
            <Input
              label="Identity Number"
              value={formData.identity_number}
              onChange={(value: string) =>
                handleInputChange("identity_number", value)
              }
            />
            <Input
              label="Social Security Number"
              value={formData.social_security_number}
              onChange={(value: string) =>
                handleInputChange("social_security_number", value)
              }
            />
          </Grid>
        </Section>

        {/* CONTACT INFO */}
        <Section title="Contact Information">
          <Grid>
            <Input
              label="Email"
              value={formData.email}
              onChange={(value: string) => handleInputChange("email", value)}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(value: string) => handleInputChange("phone", value)}
            />
            <Input
              label="Secondary Phone"
              value={formData.secondary_phone}
              onChange={(value: string) =>
                handleInputChange("secondary_phone", value)
              }
            />
            <Input
              label="Other Phone"
              value={formData.other_phone}
              onChange={(value: string) =>
                handleInputChange("other_phone", value)
              }
            />
            <Input
              label="Occupation"
              value={formData.occupation}
              onChange={(value: string) =>
                handleInputChange("occupation", value)
              }
            />
          </Grid>
        </Section>

        {/* MEDICAL INFO */}
        <Section title="Medical Information">
          <Grid>
            <Input
              label="Height (cm)"
              value={formData.height}
              onChange={(value: string) => handleInputChange("height", value)}
            />
            <Input
              label="Weight (kg)"
              value={formData.weight}
              onChange={(value: string) => handleInputChange("weight", value)}
            />
            <Input
              label="Blood Group"
              value={formData.blood_group}
              onChange={(value: string) =>
                handleInputChange("blood_group", value)
              }
            />
            <Select
              label="Smoker"
              options={["No", "Yes"]}
              value={formData.smoker}
              onChange={(value: string) => handleInputChange("smoker", value)}
            />
            <Input
              label="Cigarettes Per Day"
              value={formData.cigarettes_per_day}
              onChange={(value: string) =>
                handleInputChange("cigarettes_per_day", value)
              }
            />
          </Grid>
        </Section>

        {/* MEDICAL HISTORY */}
        <Section title="Medical History">
          <Textarea
            label="Family History"
            value={formData.family_history}
            onChange={(value: string) =>
              handleInputChange("family_history", value)
            }
          />
          <Textarea
            label="Medical / Surgical History"
            value={formData.medical_history}
            onChange={(value: string) =>
              handleInputChange("medical_history", value)
            }
          />
          <Textarea
            label="Gynecological History"
            value={formData.gynecological_history}
            onChange={(value: string) =>
              handleInputChange("gynecological_history", value)
            }
          />
          <Textarea
            label="Allergies"
            value={formData.allergies}
            onChange={(value: string) => handleInputChange("allergies", value)}
          />
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(value: string) => handleInputChange("notes", value)}
          />
        </Section>

        {/* OTHER DETAILS */}
        <Section title="Other Details">
          <Grid>
            <Input
              label="Primary Doctor"
              value={formData.primary_doctor}
              onChange={(value: string) =>
                handleInputChange("primary_doctor", value)
              }
            />
            <Input
              label="Delivery Location"
              value={formData.delivery_location}
              onChange={(value: string) =>
                handleInputChange("delivery_location", value)
              }
            />
            <Input
              label="Legacy Number"
              value={formData.legacy_number}
              onChange={(value: string) =>
                handleInputChange("legacy_number", value)
              }
            />
            <Select
              label="New Patient"
              options={["Yes", "No"]}
              value={formData.new_patient ? "Yes" : "No"}
              onChange={(value: string) =>
                handleInputChange("new_patient", value === "Yes")
              }
            />
          </Grid>
        </Section>
      </div>

      {/* BUTTON FOOTER */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate("/patients")}
          className="px-6 py-2 rounded-lg border bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdatePatient}
          disabled={updatePatient.isPending}
          className="px-6 py-2 rounded-lg border bg-green-50 hover:bg-green-600 text-green-600 hover:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updatePatient.isPending ? "Updating..." : "Update Patient"}
        </button>
      </div>
    </div>
  );
}

/* ============ REUSABLE UI COMPONENTS ============ */

function Section({ title, children }: any) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

function Input({ label, type = "text", value = "", onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
      />
    </div>
  );
}

function Textarea({ label, value = "", onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
      />
    </div>
  );
}

function Select({ label, options, value = "", onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
