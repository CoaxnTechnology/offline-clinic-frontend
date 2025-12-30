import { useState } from "react";
import {
  X,
  CheckCircle,
  Upload,
  Download,
  Printer,
  Loader2,
} from "lucide-react";

/* ================= TYPES ================= */

type AppointmentStatus =
  | "With Technician"
  | "With Doctor"
  | "Completed";

const statusColors: Record<AppointmentStatus, string> = {
  "With Technician": "bg-purple-100 text-purple-800",
  "With Doctor": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};

/* ================= PAGE ================= */

export default function TechnicianPage() {
  const [selected, setSelected] = useState<any>(null);
  const [dicomOpen, setDicomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);

  const [patients, setPatients] = useState([
    {
      id: "T001",
      patient: "Aisha Khan",
      age: 32,
      gender: "Female",
      doctor: "Dr. Sharma",
      study: "Ultrasound Abdomen",
      status: "With Technician" as AppointmentStatus,
      dicomUploaded: true,
      reportStatus: "Finalized",
      report: "",
      timestamps: {
        started: "10:32 AM",
        dicom: "10:41 AM",
        completed: "—",
      },
    },
    {
      id: "T002",
      patient: "Rohit Verma",
      age: 38,
      gender: "Male",
      doctor: "Dr. Patel",
      study: "Ultrasound KUB",
      status: "With Technician" as AppointmentStatus,
      dicomUploaded: false,
      reportStatus: "Draft",
      report: "",
      timestamps: {
        started: "11:10 AM",
        dicom: "—",
        completed: "—",
      },
    },
  ]);

  /* ================= ACTIONS ================= */

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status } : p
      )
    );
    setSelected((prev: any) => (prev ? { ...prev, status } : prev));
  };

  const updateReport = (id: string, value: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, report: value } : p
      )
    );
    setSelected((prev: any) => (prev ? { ...prev, report: value } : prev));
  };

  const simulateDicomUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setPatients((prev) =>
        prev.map((p) =>
          p.id === selected.id
            ? {
                ...p,
                dicomUploaded: true,
                timestamps: {
                  ...p.timestamps,
                  dicom: "11:25 AM",
                },
              }
            : p
        )
      );
      setSelected((prev: any) =>
        prev
          ? {
              ...prev,
              dicomUploaded: true,
              timestamps: {
                ...prev.timestamps,
                dicom: "11:25 AM",
              },
            }
          : prev
      );
    }, 2000);
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Technician Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ultrasound & DICOM Processing
        </p>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* MOBILE */}
        <div className="sm:hidden p-4 space-y-4">
          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="border rounded-lg p-4 space-y-2 cursor-pointer"
            >
              <div className="flex justify-between">
                <p className="font-semibold text-blue-600">{p.patient}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${statusColors[p.status]}`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {p.study} • {p.doctor}
              </p>

              <div className="text-xs">
                {p.dicomUploaded ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> DICOM Loaded
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <Upload size={14} /> Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <table className="hidden sm:table min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Patient</th>
              <th className="px-6 py-3 text-left">Study</th>
              <th className="px-6 py-3 text-left">Doctor</th>
              <th className="px-6 py-3 text-left">DICOM</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="border-t hover:bg-purple-50 cursor-pointer"
              >
                <td className="px-6 py-4 font-semibold text-blue-600">
                  {p.patient}
                </td>
                <td className="px-6 py-4">{p.study}</td>
                <td className="px-6 py-4">{p.doctor}</td>
                <td className="px-6 py-4">
                  {p.dicomUploaded ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Loaded
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <Upload size={14} /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusColors[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIDE PANEL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full sm:w-[420px] bg-white h-full flex flex-col">
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between">
              <h2 className="font-semibold">Ultrasound Details</h2>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-5 overflow-y-auto text-sm">
              <Section title="Patient Info">
                <InfoRow label="Name" value={selected.patient} />
                <InfoRow label="Age" value={selected.age} />
                <InfoRow label="Gender" value={selected.gender} />
                <InfoRow label="Study" value={selected.study} />
                <InfoRow label="Doctor" value={selected.doctor} />
              </Section>

              <Section title="DICOM">
                {selected.dicomUploaded ? (
                  <div
                    onClick={() => {
                      setDicomOpen(true);
                      setZoom(1);
                    }}
                    className="h-40 bg-black rounded-lg flex items-center justify-center cursor-zoom-in"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1582719478181-2c6e4c2b5a8b"
                      className="h-full object-contain opacity-80"
                    />
                  </div>
                ) : (
                  <button
                    onClick={simulateDicomUpload}
                    disabled={uploading}
                    className="w-full py-2 border rounded-lg flex justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Upload DICOM
                      </>
                    )}
                  </button>
                )}
              </Section>

              <Section title="Ultrasound Report">
                <textarea
                  rows={6}
                  value={selected.report}
                  onChange={(e) =>
                    updateReport(selected.id, e.target.value)
                  }
                  placeholder={`Findings:
• Liver normal
• Gall bladder normal

Impression:
No abnormality detected`}
                  className="w-full border rounded-lg p-3"
                />

                <div className="flex gap-3 mt-3">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                    <Download size={16} /> PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </Section>

              <Section title="Workflow">
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateStatus(selected.id, e.target.value as AppointmentStatus)
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="With Technician">With Technician</option>
                  <option value="With Doctor">Send to Doctor</option>
                  <option value="Completed">Completed</option>
                </select>
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN DICOM */}
      {dicomOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
          <div className="p-4 flex justify-between text-white">
            <p className="text-sm font-mono text-green-400">
              DICOM Viewer • Zoom {zoom.toFixed(1)}x
            </p>
            <button onClick={() => setDicomOpen(false)}>
              <X />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1582719478181-2c6e4c2b5a8b"
              style={{ transform: `scale(${zoom})` }}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="p-4 flex justify-center gap-4">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="px-4 py-2 bg-white/10 text-white rounded"
            >
              Zoom −
            </button>
            <button
              onClick={() => setZoom((z) => z + 0.2)}
              className="px-4 py-2 bg-white/10 text-white rounded"
            >
              Zoom +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
