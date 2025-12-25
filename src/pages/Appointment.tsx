import { useState } from "react";
import { Eye, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

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

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Aisha Khan",
      doctor: "Dr. Sharma",
      department: "Gynecology",
      date: today,
      time: "10:45",
      status: "Waiting" as AppointmentStatus,
    },
    {
      id: 2,
      patient: "Rohit Verma",
      doctor: "Dr. Patel",
      department: "Orthopedic",
      date: today,
      time: "11:30",
      status: "With Doctor" as AppointmentStatus,
    },
    {
      id: 3,
      patient: "Meera Shah",
      doctor: "Dr. Gupta",
      department: "Radiology",
      date: tomorrow,
      time: "09:45",
      status: "With Technician" as AppointmentStatus,
    },
  ]);

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "today" && a.date !== today) return false;
    if (filter === "tomorrow" && a.date !== tomorrow) return false;
    if (filter === "yesterday" && a.date !== yesterday) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const updateStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="p-6 space-y-6">
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
            <option value="With Technician">With Technician</option>
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
                    <option>With Technician</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelected(a)}
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
          <div
            key={a.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-semibold">{a.patient}</p>
              <Badge className={statusColors[a.status]}>{a.status}</Badge>
            </div>
            <p className="text-sm text-gray-600">{a.doctor}</p>
            <p className="text-sm">{a.date} • {a.time}</p>

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
                onClick={() => setSelected(a)}
                className="p-2 rounded-lg bg-blue-100 text-blue-700"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS DRAWER */}
      <Drawer open={!!selected} onOpenChange={() => setSelected(null)}>
        <DrawerContent className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>Appointment Details</DrawerTitle>
            <DrawerClose>
              <X />
            </DrawerClose>
          </DrawerHeader>

          {selected && (
            <div className="p-6 space-y-4 text-sm">
              <p><b>Patient:</b> {selected.patient}</p>
              <p><b>Doctor:</b> {selected.doctor}</p>
              <p><b>Department:</b> {selected.department}</p>
              <p><b>Date:</b> {selected.date}</p>
              <p><b>Time:</b> {selected.time}</p>
              <p>
                <b>Status:</b>{" "}
                <Badge className={statusColors[selected.status]}>
                  {selected.status}
                </Badge>
              </p>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
