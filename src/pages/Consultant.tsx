import { useState } from "react";
import { X, Download, Printer } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
// helpers (Section, InfoRow) are defined below in this file

type AppointmentStatus =
  | "Waiting"
  | "With Doctor"
  | "With Technician"
  | "Completed";

const statusColors: Record<AppointmentStatus, string> = {
  Waiting: "bg-yellow-100 text-yellow-800",
  "With Doctor": "bg-blue-100 text-blue-800",
  "With Technician": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export default function Appointments() {
  const [filter, setFilter] = useState<
    "today" | "tomorrow" | "yesterday" | "all"
  >("today");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );
  const [selected, setSelected] = useState<any>(null);
  const [dicomOpen, setDicomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [appointments, setAppointments] = useState([
    {
      id: "P001",
      patient: "Ms. Aisha Khan",
      title: "Ms.",
      firstName: "Aisha",
      lastName: "Khan",
      gender: "Female",
      birthDate: "1990-05-12",
      identityNumber: "ID123456",
      email: "aisha.khan@example.com",
      phone: "+91 98765 43210",
      height: "165",
      weight: "60",
      bloodGroup: "A+",
      smoker: "No",
      notes: "No known allergies",
      primaryDoctor: "Dr. Sharma",
      doctor: "Dr. Sharma",
      date: today,
      time: "09:00",
      legacyNumber: "L-1001",
      newPatient: "Yes",

      status: "With Doctor" as AppointmentStatus,
      prescription: "",
    },
    {
      id: 2,
      patient: "Rohit Verma",
      age: 38,
      gender: "Male",
      doctor: "Dr. Patel",
      department: "Orthopedic",
      date: today,
      time: "11:30",
      status: "Waiting" as AppointmentStatus,
      prescription: "",
    },
  ]);

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "today" && a.date !== today) return false;
    if (filter === "tomorrow" && a.date !== tomorrow) return false;
    if (filter === "yesterday" && a.date !== yesterday) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const updateStatus = (id: any, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };
  const [prescriptionItems, setPrescriptionItems] = useState([
    {
      name: "Paracetamol 500mg",
      dosage: "1-0-1",
      duration: "5 Days",
      notes: "After food",
    },
  ]);
  const addMedicine = () => {
    setPrescriptionItems((prev) => [
      ...prev,
      { name: "", dosage: "", duration: "", notes: "" },
    ]);
  };
  const updatePrescription = (id: any, value: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, prescription: value } : a))
    );
  };
  const updateMedicine = (index: number, key: string, value: string) => {
    setPrescriptionItems((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [key]: value } : m))
    );
  };

  const removeMedicine = (index: number) => {
    setPrescriptionItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Appointments</h1>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border px-3 py-2 rounded-lg w-full sm:w-auto"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="yesterday">Yesterday</option>
            <option value="all">All</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border px-3 py-2 rounded-lg w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="Waiting">Waiting</option>
            <option value="With Doctor">With Doctor</option>
            <option value="With Technician">With Technician</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* TABLE / MOBILE LIST */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {/* Mobile / Tablet: card list (visible on small screens) */}
        <div className="space-y-4 p-4 sm:hidden">
          {filteredAppointments.map((a) => (
            <div
              key={a.id}
              className="p-3 border rounded-lg flex items-start gap-3"
              onClick={() => setSelected(a)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-blue-600 truncate">
                    {a.patient}
                  </div>
                  <div className="text-xs text-gray-500">{a.time}</div>
                </div>

                <div className="text-sm text-gray-600 truncate">
                  {a.doctor} • {a.date}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={a.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateStatus(a.id, e.target.value as AppointmentStatus)
                    }
                    className={`px-2 py-1 rounded-lg text-xs ${
                      statusColors[a.status]
                    }`}
                  >
                    <option>Waiting</option>
                    <option>With Doctor</option>
                    <option>With Technician</option>
                    <option>Completed</option>
                  </select>
                </div>

                {/* MOBILE: Prescription quick add/view */}
                <div className="mt-3">
                  <Section title="Prescription">
                    <div className="space-y-2">
                      {prescriptionItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateMedicine(index, "name", e.target.value)
                            }
                            placeholder="Medicine"
                            className="flex-1 border rounded-lg px-2 py-1 text-sm"
                          />

                          <input
                            value={item.dosage}
                            onChange={(e) =>
                              updateMedicine(index, "dosage", e.target.value)
                            }
                            placeholder="Dose"
                            className="w-20 border rounded-lg px-2 py-1 text-sm"
                          />

                          <button
                            onClick={() => removeMedicine(index)}
                            className="text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={addMedicine}
                        className="text-sm text-cyan-600 font-semibold"
                      >
                        + Add Medicine
                      </button>
                    </div>
                  </Section>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setDicomOpen(true);
                    setZoom(1);
                  }}
                  className="h-14 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden border bg-black cursor-zoom-in"
                >
                  <img
                    src="https://images.unsplash.com/photo-1582719478181-2c6e4c2b5a8b"
                    alt="DICOM Preview"
                    className="h-full w-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Laptop: table (hidden on small screens) */}
        <table className="min-w-full text-sm hidden sm:table">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Patient</th>
              <th className="px-6 py-3 text-left">Doctor</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Prescription</th>
              <th className="px-6 py-3 text-left">DICOM</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.id} className="border-t">
                {/* NAME → OPEN LEFT DRAWER */}
                <td
                  onClick={() => setSelected(a)}
                  className="px-6 py-4 font-semibold cursor-pointer text-blue-600 hover:underline"
                >
                  <div className="max-w-[140px] sm:max-w-[300px] md:max-w-[420px] lg:max-w-[520px] truncate">
                    {a.patient}
                  </div>
                </td>

                <td className="px-6 py-4">{a.doctor}</td>
                <td className="px-6 py-4">{a.date}</td>
                <td className="px-6 py-4">{a.time}</td>

                {/* STATUS INLINE */}
                <td className="px-6 py-4">
                  <select
                    value={a.status}
                    onChange={(e) =>
                      updateStatus(a.id, e.target.value as AppointmentStatus)
                    }
                    className={`px-3 py-1 rounded-lg text-xs ${
                      statusColors[a.status]
                    }`}
                  >
                    <option>Waiting</option>
                    <option>With Doctor</option>
                    <option>With Technician</option>
                    <option>Completed</option>
                  </select>
                </td>

                {/* PRESCRIPTION QUICK */}
                <Section title="Prescription">
                  <div className="space-y-4">
                    {/* TABLE HEADER */}
                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500">
                      <div className="col-span-12 sm:col-span-4">Medicine</div>
                      <div className="col-span-6 sm:col-span-2">Dosage</div>
                      <div className="col-span-6 sm:col-span-2">Duration</div>
                      <div className="col-span-12 sm:col-span-3">Notes</div>
                      <div className="col-span-12 sm:col-span-1"></div>
                    </div>

                    {/* MEDICINE ROWS */}
                    {prescriptionItems.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <input
                          value={item.name}
                          onChange={(e) =>
                            updateMedicine(index, "name", e.target.value)
                          }
                          placeholder="Paracetamol 500mg"
                          className="col-span-12 sm:col-span-4 border rounded-lg px-3 py-2 text-sm"
                        />

                        <input
                          value={item.dosage}
                          onChange={(e) =>
                            updateMedicine(index, "dosage", e.target.value)
                          }
                          placeholder="1-0-1"
                          className="col-span-6 sm:col-span-2 border rounded-lg px-2 py-2 text-sm"
                        />

                        <input
                          value={item.duration}
                          onChange={(e) =>
                            updateMedicine(index, "duration", e.target.value)
                          }
                          placeholder="5 Days"
                          className="col-span-6 sm:col-span-2 border rounded-lg px-2 py-2 text-sm"
                        />

                        <input
                          value={item.notes}
                          onChange={(e) =>
                            updateMedicine(index, "notes", e.target.value)
                          }
                          placeholder="After food"
                          className="col-span-12 sm:col-span-3 border rounded-lg px-2 py-2 text-sm"
                        />

                        <button
                          onClick={() => removeMedicine(index)}
                          className="col-span-12 sm:col-span-1 text-red-500 text-sm hover:underline text-left sm:text-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* ADD MEDICINE */}
                    <button
                      onClick={addMedicine}
                      className="text-sm text-cyan-600 font-semibold hover:underline"
                    >
                      + Add Medicine
                    </button>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Download size={16} /> Download PDF
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Printer size={16} /> Print
                      </button>
                    </div>
                  </div>
                </Section>

                {/* FAKE DICOM */}
                <td className="px-6 py-4">
                  <div
                    onClick={() => {
                      setDicomOpen(true);
                      setZoom(1);
                    }}
                    className="relative h-14 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden border bg-black cursor-zoom-in"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1582719478181-2c6e4c2b5a8b"
                      alt="DICOM Preview"
                      className="h-full w-full object-cover opacity-80"
                    />

                    <div className="absolute bottom-1 left-1 text-[9px] text-green-400 font-mono">
                      Slice 12 / 64
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dicomOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">
            {/* Large absolute close for small screens */}
            <button
              onClick={() => setDicomOpen(false)}
              aria-label="Close DICOM viewer"
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm"
            >
              <X />
            </button>
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 text-white">
              <p className="text-sm font-mono text-green-400">
                DICOM Viewer • Zoom {zoom.toFixed(1)}x
              </p>

              <button
                onClick={() => setDicomOpen(false)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* IMAGE AREA */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582719478181-2c6e4c2b5a8b"
                alt="DICOM"
                style={{ transform: `scale(${zoom})` }}
                className="transition-transform duration-200 max-h-full max-w-full object-contain"
              />
            </div>

            {/* CONTROLS */}
            <div className="flex justify-center gap-4 p-4">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                className="px-4 py-2 text-sm bg-white/10 text-white rounded-lg"
              >
                Zoom −
              </button>

              <button
                onClick={() => setZoom((z) => z + 0.2)}
                className="px-4 py-2 text-sm bg-white/10 text-white rounded-lg"
              >
                Zoom +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LEFT DRAWER – CONSULTATION */}
      {/* LEFT DRAWER – CONSULTATION DETAILS */}
      <Drawer
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-2xl md:top-0 md:bottom-0 md:left-auto md:right-0 md:h-full md:w-[420px] md:rounded-tr-none md:rounded-l-2xl">
          {/* HEADER */}
          <DrawerHeader className="border-b bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg">
                Consultation Details
              </DrawerTitle>
              <DrawerClose className="p-2 rounded-full hover:bg-gray-100">
                <X />
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* BODY */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm">
            {selected && (
              <>
                {/* PATIENT BASIC INFO */}
                <Section title="Patient Information">
                  <InfoRow
                    label="Patient Name"
                    value={`${selected.title} ${selected.firstName} ${selected.lastName}`}
                  />
                  <InfoRow label="Gender" value={selected.gender} />
                  <InfoRow label="Birth Date" value={selected.birthDate} />
                  <InfoRow label="Blood Group" value={selected.bloodGroup} />
                </Section>

                {/* CONTACT INFO */}
                <Section title="Contact Information">
                  <InfoRow label="Phone" value={selected.phone} />
                  <InfoRow label="Email" value={selected.email} />
                </Section>

                {/* MEDICAL DETAILS */}
                <Section title="Medical Details">
                  <InfoRow label="Height" value={`${selected.height} cm`} />
                  <InfoRow label="Weight" value={`${selected.weight} kg`} />
                  <InfoRow label="Smoker" value={selected.smoker} />
                  <InfoRow
                    label="Primary Doctor"
                    value={selected.primaryDoctor}
                  />
                </Section>

                {/* CONSULTATION */}
                <Section title="Consultation">
                  <InfoRow label="Doctor" value={selected.primaryDoctor} />
                  <InfoRow label="Status" value={selected.status} />
                </Section>

                {/* OTHER DETAILS */}
                <Section title="Other Details">
                  <InfoRow
                    label="Legacy Number"
                    value={selected.legacyNumber}
                  />
                  <InfoRow label="Notes" value={selected.notes} />
                </Section>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

/* Reusable local UI components used by this page */
function Section({ title, children }: any) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700">
      <div className="text-gray-500 mb-1 sm:mb-0">{label}</div>
      <div className="font-medium max-w-full sm:max-w-[60%] text-right truncate">
        {value ?? "—"}
      </div>
    </div>
  );
}
