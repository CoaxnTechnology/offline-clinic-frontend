import { useState } from "react";
import { X, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDicomImagesPolling } from "@/hooks/Dicom/useDicomImagesPolling";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
// helpers (Section, InfoRow) are defined below in this file
import { useWithDoctorAppointments } from "@/hooks/appointments/useWithDoctorAppointments";
import { useUpdateAppointmentStatus } from "@/hooks/appointments/useUpdateAppointmentStatus";
import { useSendToDicomMWL } from "@/hooks/Dicom/useSendToDicomMWL";
type AppointmentStatus =
  | "Waiting"
  | "With Doctor"
  | "Sent to DICOM"
  | "Study Completed"
  | "Completed";

const statusColors: Record<AppointmentStatus, string> = {
  Waiting: "bg-yellow-100 text-yellow-800",
  "With Doctor": "bg-blue-100 text-blue-800",
  "Sent to DICOM": "bg-orange-100 text-orange-800",
  "Study Completed": "bg-indigo-100 text-indigo-800",
  Completed: "bg-green-100 text-green-800",
};

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export default function Appointments() {
  const { data, isLoading } = useWithDoctorAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const sendToDicomMutation = useSendToDicomMWL();

  const [filter, setFilter] = useState<
    "today" | "tomorrow" | "yesterday" | "all"
  >("today");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const navigate = useNavigate();

  const [selected, setSelected] = useState<any>(null);
  const [dicomOpen, setDicomOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const apiAppointments =
    data?.map((item: any) => ({
      id: item.id,
      patient: item.patient
        ? `${item.patient.first_name} ${item.patient.last_name}`
        : "N/A",
      doctor: item.doctor,
      department: item.department || "General",
      date: item.date,
      time: item.time,
      status: item.status,
      fullPatient: item.patient,
      prescriptionId: item.prescription_id,
      prescriptionPdf: item.prescription_pdf_path,
    })) || [];

  console.log("Fetched Appointments from doctor:", apiAppointments);
  const selectedPatient = selected?.fullPatient;
  const filteredAppointments = apiAppointments
    .filter((a) => a.status !== "Completed") // 🔥 hide completed
    .filter((a) => {
      if (filter === "today" && a.date !== today) return false;
      if (filter === "tomorrow" && a.date !== tomorrow) return false;
      if (filter === "yesterday" && a.date !== yesterday) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  console.log("STATUS FILTER:", statusFilter);
  console.log("FILTERED:", filteredAppointments);

  const handleSendToDicom = (id: number) => {
    sendToDicomMutation.mutate(id, {
      onSuccess: () => {
        updateStatusMutation.mutate({
          id,
          status: "Sent to DICOM",
        });

        setStatusFilter("all"); // 🔥 important
      },
    });
  };

  const updateStatus = (id: number, status: AppointmentStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          if (status === "Completed") {
            // remove from selected immediately
            if (selected?.id === id) {
              setSelected(null);
            }
          }
        },
      },
    );
  };

  const handleAddPrescription = (appointment: any) => {
    navigate(`/prescription/${appointment.id}`, {
      state: {
        patient: appointment.fullPatient,
        doctor: appointment.doctor,
        department: appointment.department,
      },
    });
  };

  const getFieldValue = (value: any) => {
    // Handle null, undefined, empty strings, "N/A", and 0 (for numeric fields)
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "N/A" ||
      value === 0
    ) {
      return "N/A";
    }
    return value;
  };
  function DicomImageWatcher({
    patientId,
    appointmentId,
  }: {
    patientId: string;
    appointmentId: number;
  }) {
    useDicomImagesPolling(
      patientId,
      appointmentId,
      true, // enabled
    );

    return null;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Consultant Dashboard</h1>

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
            <option>Sent to DICOM</option>
            <option>Study Completed</option>
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
                    <option value="Sent to DICOM">Sent to DICOM</option>
                    <option value="Study Completed">Study Completed</option>
                    <option>Completed</option>
                  </select>
                </div>

                {/* MOBILE: Prescription quick add/view */}
                <div className="mt-3">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/prescription/${a.id}`)}
                      className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                    >
                      Add Prescription
                    </button>
                  </td>
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
                    <option value="Sent to DICOM">Sent to DICOM</option>
                    <option value="Study Completed">Study Completed</option>
                    <option>Completed</option>
                  </select>
                </td>

                {/* PRESCRIPTION QUICK */}
                <td className="px-6 py-4 space-x-2">
                  {/* ADD BUTTON if no prescription */}
                  {!a.prescriptionId && (
                    <button
                      onClick={() => handleAddPrescription(a)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs"
                    >
                      Add Prescription
                    </button>
                  )}

                  {/* PRINT BUTTON if prescription exists */}
                  {a.prescriptionId && (
                    <button
                      onClick={() => window.open(a.prescriptionPdf, "_blank")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                    >
                      Print / Download
                    </button>
                  )}
                </td>

                {/* FAKE DICOM */}
                <td className="px-6 py-4 space-y-2">
                  {/* 🔥 SEND BUTTON */}
                  {a.status === "With Doctor" && (
                    <button
                      onClick={() => handleSendToDicom(a.id)}
                      className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs"
                    >
                      Send to DICOM
                    </button>
                  )}

                  {/* 🔥 POLLING STATE */}
                  {a.status === "Sent to DICOM" && (
                    <>
                      {/* 👇 This component starts polling automatically */}
                      <DicomImageWatcher
                        patientId={a.fullPatient?.id}
                        appointmentId={a.id}
                      />

                      <span className="text-xs text-gray-500 animate-pulse">
                        Waiting for Study...
                      </span>
                    </>
                  )}

                  {/* 🔥 STUDY COMPLETED */}
                  {a.status === "Study Completed" && (
                    <button
                      onClick={() => navigate(`/pacs/${a.id}`)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs"
                    >
                      View DICOM
                    </button>
                  )}
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
            {selectedPatient ? (
              <>
                {/* PERSONAL INFO */}
                <Section title="Personal Information">
                  <InfoRow label="Patient ID" value={selectedPatient.id} />
                  <InfoRow
                    label="Title"
                    value={getFieldValue(selectedPatient.title)}
                  />
                  <InfoRow
                    label="Gender"
                    value={getFieldValue(selectedPatient.gender)}
                  />
                  <InfoRow
                    label="Birth Date"
                    value={getFieldValue(selectedPatient.birth_date)}
                  />
                  <InfoRow
                    label="Identity Number"
                    value={getFieldValue(selectedPatient.identity_number)}
                  />
                  <InfoRow
                    label="Maiden Name"
                    value={getFieldValue(selectedPatient.maiden_name)}
                  />
                </Section>

                {/* CONTACT INFO */}
                <Section title="Contact Information">
                  <InfoRow
                    label="Phone"
                    value={getFieldValue(selectedPatient.phone)}
                  />
                  <InfoRow
                    label="Secondary Phone"
                    value={getFieldValue(selectedPatient.secondary_phone)}
                  />
                  <InfoRow
                    label="Other Phone"
                    value={getFieldValue(selectedPatient.other_phone)}
                  />
                  <InfoRow
                    label="Email"
                    value={getFieldValue(selectedPatient.email)}
                  />
                </Section>

                {/* MEDICAL INFO */}
                <Section title="Medical Information">
                  <InfoRow
                    label="Blood Group"
                    value={getFieldValue(selectedPatient.blood_group)}
                  />
                  <InfoRow
                    label="Height"
                    value={
                      selectedPatient.height && selectedPatient.height > 0
                        ? `${selectedPatient.height} cm`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Weight"
                    value={
                      selectedPatient.weight && selectedPatient.weight > 0
                        ? `${selectedPatient.weight} kg`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Smoker"
                    value={getFieldValue(selectedPatient.smoker)}
                  />
                  <InfoRow
                    label="Cigarettes Per Day"
                    value={getFieldValue(selectedPatient.cigarettes_per_day)}
                  />
                  <InfoRow
                    label="Primary Doctor"
                    value={getFieldValue(selectedPatient.primary_doctor)}
                  />
                </Section>

                {/* MEDICAL HISTORY */}
                <Section title="Medical History">
                  <InfoRow
                    label="Family History"
                    value={getFieldValue(selectedPatient.family_history)}
                  />
                  <InfoRow
                    label="Medical / Surgical History"
                    value={getFieldValue(selectedPatient.medical_history)}
                  />
                  <InfoRow
                    label="Gynecological History"
                    value={getFieldValue(selectedPatient.gynecological_history)}
                  />
                  <InfoRow
                    label="Allergies"
                    value={getFieldValue(selectedPatient.allergies)}
                  />
                </Section>

                {/* OTHER */}
                <Section title="Other Details">
                  <InfoRow
                    label="Delivery Location"
                    value={getFieldValue(selectedPatient.delivery_location)}
                  />
                  <InfoRow
                    label="Legacy Number"
                    value={getFieldValue(selectedPatient.legacy_number)}
                  />
                  <InfoRow
                    label="Social Security Number"
                    value={getFieldValue(
                      selectedPatient.social_security_number,
                    )}
                  />
                  <InfoRow
                    label="Notes"
                    value={getFieldValue(selectedPatient.notes)}
                  />
                </Section>
              </>
            ) : (
              <div className="text-gray-500">No patient selected</div>
            )}
          </div>

          {/* FOOTER */}
          <DrawerFooter className="border-t bg-white">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full py-2 rounded-lg border hover:bg-gray-50"
            >
              Close
            </button>
          </DrawerFooter>
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
