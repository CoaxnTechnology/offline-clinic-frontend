import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreatePrescription } from "@/hooks/prescriptions/useCreatePrescription";
import { useLocation } from "react-router-dom";

export default function Prescription() {
  const { id } = useParams();
  const createPrescriptionMutation = useCreatePrescription();
  const location = useLocation();
  const patient = location.state?.patient;
  const doctor = location.state?.doctor;
  const department = location.state?.department;

  const [items, setItems] = useState([
    {
      medicine: "",
      dosage: "",
      duration_days: "",
      notes: "",
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { medicine: "", dosage: "", duration_days: "", notes: "" },
    ]);
  };

  const updateItem = (index: number, key: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };
  const navigate = useNavigate();
  const handleSave = () => {
    if (!id) {
      alert("Invalid appointment ❌");
      return;
    }

    const payload = {
      appointment_id: Number(id),
      patient_id: patient?.id,
      items: items.map((item) => ({
        medicine: item.medicine,
        dosage: item.dosage,
        duration_days: parseInt(item.duration_days) || 0,
        notes: item.notes,
      })),
    };

    console.log("Sending Prescription:", payload);

    createPrescriptionMutation.mutate(payload, {
      onSuccess: () => {
        alert("Prescription saved successfully ✅");
        navigate("/consultant");
      },
      onError: () => {
        alert("Failed to save prescription ❌");
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 print:shadow-none">
        {/* 🔹 HOSPITAL HEADER */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Hospital Logo"
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Sunshine Multispeciality Hospital
              </h1>
              <p className="text-sm text-gray-600">
                123 Medical Road, Ahmedabad, Gujarat
              </p>
              <p className="text-sm text-gray-600">Phone: +91 99999 99999</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Prescription ID: {id}</p>
            <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* 🔹 PATIENT DETAILS */}
        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p>
              <strong>Patient Name:</strong>{" "}
              {patient ? `${patient.first_name} ${patient.last_name}` : "N/A"}
            </p>

            <p>
              <strong>Patient ID:</strong> {patient?.id || "N/A"}
            </p>

            <p>
              <strong>Age / Gender:</strong>{" "}
              {patient?.birth_date
                ? `${
                    new Date().getFullYear() -
                    new Date(patient.birth_date).getFullYear()
                  }`
                : "N/A"}{" "}
              / {patient?.gender || "N/A"}
            </p>
          </div>

          <div>
            <strong>Doctor:</strong> {doctor || "N/A"}
            <p>
              <strong>Department:</strong> {department || "N/A"}
            </p>
          </div>
        </div>

        {/* 🔹 MEDICINES TABLE */}
        <div className="mt-8">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Medicine</th>
                <th className="border px-3 py-2 text-left">Dosage</th>
                <th className="border px-3 py-2 text-left">Duration (Days)</th>
                <th className="border px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-2">
                    <input
                      value={item.medicine}
                      onChange={(e) =>
                        updateItem(index, "medicine", e.target.value)
                      }
                      className="w-full outline-none"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      value={item.dosage}
                      onChange={(e) =>
                        updateItem(index, "dosage", e.target.value)
                      }
                      className="w-full outline-none"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    {/* Editable in screen */}
                    <input
                      value={item.duration_days}
                      onChange={(e) =>
                        updateItem(index, "duration_days", e.target.value)
                      }
                      className="w-full outline-none print:hidden"
                    />

                    {/* Visible in PDF */}
                    <span className="hidden print:block">
                      {item.duration_days ? `${item.duration_days} Days` : ""}
                    </span>
                  </td>

                  <td className="border px-2 py-2">
                    <input
                      value={item.notes}
                      onChange={(e) =>
                        updateItem(index, "notes", e.target.value)
                      }
                      className="w-full outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Add Medicine
          </button>
        </div>

        {/* 🔹 SIGNATURE */}
        <div className="mt-16 flex justify-between">
          <div>
            <p className="border-t pt-2 w-40 text-center text-sm">
              Patient Signature
            </p>
          </div>
          <div>
            <p className="border-t pt-2 w-40 text-center text-sm">
              Doctor Signature
            </p>
          </div>
        </div>

        {/* 🔹 PRINT BUTTON (Hidden in PDF) */}
        <div className="mt-10 text-right print:hidden">
          <div className="mt-10 flex justify-end gap-4 print:hidden">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Download / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
