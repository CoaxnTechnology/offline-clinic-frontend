import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Image } from "lucide-react";
import { usePatientHistory } from "@/hooks/patients/usePatientHistory";
import { useState } from "react";
import DicomViewer from "./DicomViewer";

export default function PatientHistory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = usePatientHistory(id || "");

  const timeline = data?.timeline || [];
  const patient = data?.patient;
  const dicoms = data?.dicom || [];

  // 🔥 SINGLE source of truth for opened DICOM
  const [openDicomId, setOpenDicomId] = useState<number | null>(null);

  const downloadPrescription = (prescription: any) => {
    if (!prescription.pdf_path) {
      alert("PDF not available");
      return;
    }
    window.open(prescription.pdf_path, "_blank");
  };

  // ✅ GET DICOMs FOR APPOINTMENT
  const getDicomsForAppointment = (appointmentId: number) => {
    return dicoms.filter((d: any) => d.visit_id === appointmentId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md border hover:bg-gray-50"
        >
          <ArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            {patient?.first_name} {patient?.last_name}
          </h1>
          <div className="text-sm text-gray-500">
            ID: {patient?.id || "-"}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10 text-gray-500">
          Loading history...
        </div>
      )}

      {!isLoading && timeline.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No visit history found.
        </div>
      )}

      {/* TIMELINE */}
      <div className="space-y-8">
        {timeline.map((day: any) => (
          <div key={day.date} className="space-y-4">
            <h2 className="font-bold text-lg text-gray-700">{day.date}</h2>

            {/* APPOINTMENTS */}
            {day.appointments?.map((appointment: any) => {
              const appointmentDicoms =
                getDicomsForAppointment(appointment.id);

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">
                        {appointment.doctor}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </div>
                    <div className="text-sm px-3 py-1 bg-gray-100 rounded">
                      {appointment.status}
                    </div>
                  </div>

                  {/* PRESCRIPTIONS */}
                  {day.prescriptions?.map((p: any) => (
                    <div
                      key={p.id}
                      className="mt-4 border-t pt-4 flex justify-between items-center"
                    >
                      <div className="text-sm">
                        {p.medicine} — {p.duration_days} Days
                      </div>
                      <button
                        onClick={() => downloadPrescription(p)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  ))}

                  {/* 🔥 DICOM BUTTON */}
                  {appointmentDicoms.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          setOpenDicomId(
                            openDicomId === appointmentDicoms[0].id
                              ? null
                              : appointmentDicoms[0].id
                          )
                        }
                        className="flex items-center gap-2 text-cyan-600 text-sm"
                      >
                        <Image size={14} />
                        {openDicomId === appointmentDicoms[0].id
                          ? "Hide DICOM"
                          : "View DICOM"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 🔥 SINGLE DICOM VIEWER */}
            {openDicomId &&
              dicoms.some((d: any) => d.id === openDicomId) && (
                <DicomViewer
                  fileUrl={`https://api.clinicalgynecologists.space${
                    dicoms.find((d: any) => d.id === openDicomId).file_url
                  }`}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
