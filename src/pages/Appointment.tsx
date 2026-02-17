import { useState } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { useUpdateAppointmentStatus } from "@/hooks/appointments/useUpdateAppointmentStatus";
import { useFilteredAppointments } from "@/hooks/appointments/useFilteredAppointments";

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

// Mock data

// Helper functions
const getFieldValue = (value: any) => {
  if (!value) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

// Section Component
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b pb-6 last:border-b-0">
    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

// InfoRow Component
const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-start gap-2">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 text-right">{getFieldValue(value)}</span>
  </div>
);

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export default function Appointments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<
    "today" | "tomorrow" | "yesterday" | "all"
  >("today");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [selected, setSelected] = useState<any>(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Booking drawer states
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPatient, setBookingPatient] = useState<any>(null);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // 🔥 Fetch today's appointments from API
  const {
    data: todayData,
    isLoading: isTodayLoading,
    isError: isTodayError,
  } = useAppointments(today);
  const {
    data: filteredData,
    isLoading: isFilterLoading,
    isError: isFilterError,
  } = useFilteredAppointments(
    filter,
    statusFilter === "all" ? "all" : statusFilter,
  );

  /* ================= DATA SOURCE DECISION ================= */

  const isUsingFilterAPI = filter !== "today" || statusFilter !== "all";

  const finalData = isUsingFilterAPI ? filteredData : todayData;
  const isLoading = isUsingFilterAPI ? isFilterLoading : isTodayLoading;
  const isError = isUsingFilterAPI ? isFilterError : isTodayError;
  // 🔥 Mutation for updating status
  const updateStatusMutation = useUpdateAppointmentStatus();

  const updateStatus = (id: number, status: AppointmentStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const apiAppointments =
    finalData?.map((item: any) => ({
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
    })) || [];

  console.log("Fetched Appointments:", apiAppointments);
  const filteredAppointments = apiAppointments.filter((a: any) => {
    if (filter === "today" && a.date !== today) return false;
    if (filter === "tomorrow" && a.date !== tomorrow) return false;
    if (filter === "yesterday" && a.date !== yesterday) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {isLoading && (
        <div className="text-center py-6 text-gray-500">
          Loading today's appointments...
        </div>
      )}

      {isError && (
        <div className="text-center py-6 text-red-500">
          Failed to load appointments from server
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Appointments</h1>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="yesterday">Yesterday</option>
            <option value="all">All</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Waiting">Waiting</option>
            <option value="With Doctor">With Doctor</option>
            <option value="Sent to DICOM">Sent to DICOM</option>
            <option value="Study Completed">Study Completed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Patient</th>
              <th className="px-6 py-3 text-left">Doctor</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-6 py-4">{a.patient}</td>
                <td className="px-6 py-4">{a.doctor}</td>
                <td className="px-6 py-4">{a.date}</td>
                <td className="px-6 py-4">{a.time}</td>
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
                    <option>Sent to DICOM</option>
                    <option>Study Completed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelected(a);
                      setSelectedPatient(a.fullPatient);
                      setDrawerOpen(true);
                    }}
                    className="p-2 rounded-lg bg-blue-100 text-blue-700"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredAppointments.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="flex justify-between">
              <p className="font-semibold">{a.patient}</p>
              <Badge className={statusColors[a.status]}>{a.status}</Badge>
            </div>
            <p className="text-sm text-gray-600">{a.doctor}</p>
            <p className="text-sm">
              {a.date} • {a.time}
            </p>

            <div className="flex justify-between items-center mt-2">
              <select
                value={a.status}
                onChange={(e) =>
                  updateStatus(a.id, e.target.value as AppointmentStatus)
                }
                className="border px-3 py-2 rounded-lg text-sm"
              >
                <option>Waiting</option>
                <option>With Doctor</option>
                <option>With Technician</option>
                <option>Completed</option>
              </select>

              <button
                onClick={() => {
                  setSelected(a);
                  setSelectedPatient(a);
                  setDrawerOpen(true);
                }}
                className="p-2 rounded-lg bg-blue-100 text-blue-700"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS DRAWER */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent
          className="
           fixed
            bottom-0
            left-0
            right-0
            h-[85vh]
            bg-white
            rounded-t-2xl
      
            md:w-[420px]
            md:ml-auto        /* 🔥 THIS IS THE MAGIC */
            md:rounded-tr-none
            md:rounded-l-2xl
          "
        >
          {/* HEADER */}
          <DrawerHeader className="border-b bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-lg">
                  {selectedPatient?.first_name?.[0]}
                  {selectedPatient?.last_name?.[0]}
                </div>

                <div>
                  <DrawerTitle className="text-lg">
                    {selectedPatient
                      ? `${getFieldValue(selectedPatient.title)} ${
                          selectedPatient.first_name
                        } ${selectedPatient.last_name}`
                      : "Patient Details"}
                  </DrawerTitle>

                  {selectedPatient && (
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                        {getFieldValue(selectedPatient.blood_group)}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          selectedPatient.new_patient === true
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {selectedPatient.new_patient === true
                          ? "New Patient"
                          : "Existing"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

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

      <Drawer open={bookingOpen} onOpenChange={setBookingOpen}>
        <DrawerContent
          className="
          fixed bottom-0 left-0 right-0
          md:right-0 md:left-auto md:w-[420px]
          h-[90vh] bg-white
          rounded-t-2xl md:rounded-l-2xl
        "
        >
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Book Appointment</DrawerTitle>
            <DrawerClose>
              <X />
            </DrawerClose>
          </DrawerHeader>

          <div className="p-6 space-y-5 overflow-y-auto">
            <p className="text-sm text-gray-600">
              Patient:{" "}
              <b>
                {bookingPatient?.first_name} {bookingPatient?.last_name}
              </b>
            </p>
          </div>

          <DrawerFooter>
            <button
              onClick={() => {
                if (!doctor || !date || !time) {
                  alert("Please fill all fields");
                  return;
                }
                alert("Appointment Booked ✅");
                setBookingOpen(false);
              }}
              className="w-full py-3 bg-cyan-600 text-white rounded-lg"
            >
              Confirm Appointment
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
