import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Plus, Search, X, Edit2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "../components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { usePatients } from "@/hooks/patients/usePatients";
import { useSearchPatients } from "@/hooks/patients/useSearchPatients";
import { useAddPatient } from "@/hooks/patients/useAddPatient";
import { useCreateAppointment } from "@/hooks/appointments/useCreateAppointment";
import { useDeletePatient } from "@/hooks/patients/useDeletePatient";

export default function Patients() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { state, isMobile } = useSidebar();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPatient, setBookingPatient] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const collapsed = state === "collapsed";
  const { data: patientsData, isLoading } = usePatients(1, 20);

  const { data: searchData, isLoading: isSearching } = useSearchPatients(
    search.trim(),
  );

  const addPatient = useAddPatient();
  const createAppointment = useCreateAppointment();
  const deletePatient = useDeletePatient();

  // Patient form state
  const [formData, setFormData] = useState({
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
  const handleAddPrescription = (appointment: any) => {
    navigate(`/prescription/${appointment.id}`, {
      state: {
        patient: appointment.fullPatient,
        doctor: appointment.doctor,
        department: appointment.department,
      },
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
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
  };

  // Debounced search: call API when search changes

  // Helper function to get field value or show N/A
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

  const patients = search ? searchData?.data || [] : patientsData?.data || [];
  console.log("patientsData:", patientsData);
  const totalPatients = search
    ? searchData?.pagination?.total || 0
    : patientsData?.pagination?.total || 0;
  const handleDeletePatient = (patientId: string) => {
    Swal.fire({
      title: "Delete Patient",
      text: `Are you sure you want to delete ${selectedPatient?.first_name} ${selectedPatient?.last_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      backdrop: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Deleting patient...");

        deletePatient.mutate(patientId, {
          onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Patient deleted successfully!");
            Swal.fire({
              title: "Deleted!",
              text: "Patient has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setDrawerOpen(false);
            setSelectedPatient(null);
          },
          onError: (error: any) => {
            toast.dismiss(toastId);
            const errorMsg =
              error?.response?.data?.message || "Failed to delete patient";
            toast.error(errorMsg);
            Swal.fire({
              title: "Error",
              text: errorMsg,
              icon: "error",
              confirmButtonColor: "#ef4444",
            });
          },
        });
      }
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Patients</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Total Patients: {totalPatients}
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            toast.info("Fill out all patient details carefully");
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient"
          className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border focus:ring-2 focus:ring-[#06b6c9]"
        />
      </div>

      {/* LOADING */}
      {(isLoading || isSearching) && (
        <div className="bg-white rounded-2xl shadow-md text-sm overflow-hidden">
          {/* DESKTOP SKELETON */}
          <div className="hidden lg:block">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...Array(5)].map((_, idx) => (
                  <tr key={idx} className="hover:bg-cyan-50">
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="min-w-0 flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE SKELETON */}
          <div className="lg:hidden space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="border rounded-2xl p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between">
                  <div className="flex gap-3 flex-1">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIST PLACEHOLDER */}
      {!isLoading && !isSearching && patients.length === 0 && (
        <div className="text-center py-6 text-gray-500">No patients found</div>
      )}
      {/* LIST */}
      {!isLoading && !isSearching && (
        <div className="bg-white rounded-2xl shadow-md text-sm overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setDrawerOpen(true);
                    }}
                    className="hover:bg-cyan-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-3 min-w-0 items-center">
                        <Avatar>
                          <AvatarFallback>
                            {p.first_name?.[0]}
                            {p.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {p.first_name} {p.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block max-w-[160px] truncate">
                        {p.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block max-w-[200px] truncate">
                        {p.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[160px]">
                        <Badge className="truncate block">
                          {getFieldValue(p.primary_doctor)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Loading patient details for editing...");
                          navigate(`/patients/${p.id}/edit`);
                        }}
                        className="px-4 py-2 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 mr-2 transition-colors"
                      >
                        <Edit2 size={14} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Loading patient history...");
                          navigate(`/patient-history/${p.id}`);
                        }}
                        className="px-4 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2 transition-colors"
                      >
                        View History
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingPatient(p);
                          setBookingOpen(true);
                          toast.info(
                            `Ready to book appointment for ${p.first_name}`,
                          );
                        }}
                        className="px-4 py-2 text-xs bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4">
            {" "}
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p);
                  setDrawerOpen(true);
                }}
                className="border rounded-2xl p-4 shadow-sm bg-white transition hover:shadow-md"
              >
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {p.first_name?.[0]}
                        {p.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{p.id}</p>
                    </div>
                  </div>
                  <Badge>{getFieldValue(p.primary_doctor)}</Badge>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p className="truncate">📞 {p.phone}</p>
                  <p className="truncate">📧 {p.email}</p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Loading patient details for editing...");
                      navigate("/edit-patient", { state: { patient: p } });
                    }}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Edit2 size={14} className="inline mr-1" />
                    Edit Patient
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Loading patient history...");
                      navigate("/patient-history", { state: { patient: p } });
                    }}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View History
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingPatient(p);
                      setBookingOpen(true);
                      toast.info(
                        `Ready to book appointment for ${p.first_name}`,
                      );
                    }}
                    className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <DrawerFooter className="border-t bg-white flex gap-3">
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex-1 py-2 rounded-lg border hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>

            <button
              onClick={() => {
                setDrawerOpen(false);
                toast.info("Loading patient details for editing...");
                navigate(`/patients/${selectedPatient?.id}/edit`);
              }}
              className="flex-1 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors font-medium"
            >
              <Edit2 size={14} className="inline mr-2" />
              Edit
            </button>

            <button
              onClick={() => handleDeletePatient(selectedPatient.id)}
              disabled={deletePatient.isPending}
              className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
            >
              {deletePatient.isPending ? "Deleting..." : "Delete"}
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

            {/* DATE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Appointment Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            {/* TIME */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Appointment Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          <DrawerFooter>
            <button
              onClick={() => {
                if (!date || !time) {
                  toast.error(
                    "Please select both date and time for the appointment",
                  );
                  return;
                }

                const toastId = toast.loading("Booking appointment...");

                createAppointment.mutate(
                  {
                    patient_id: bookingPatient.id,
                    date,
                    time,
                  },
                  {
                    onSuccess: () => {
                      toast.dismiss(toastId);
                      toast.success("Appointment booked successfully!");

                      Swal.fire({
                        title: "Success!",
                        text: `Appointment scheduled for ${date} at ${time}`,
                        icon: "success",
                        timer: 2500,
                        showConfirmButton: false,
                      });

                      setBookingOpen(false);
                      setDate("");
                      setTime("");
                    },
                    onError: (error: any) => {
                      toast.dismiss(toastId);
                      const errorMsg =
                        error?.response?.data?.message ||
                        "Failed to book appointment";
                      toast.error(errorMsg);
                    },
                  },
                );
              }}
              disabled={createAppointment.isPending}
              className="w-full py-3 bg-cyan-600 text-white rounded-lg disabled:opacity-50 hover:bg-cyan-700 transition-colors"
            >
              {createAppointment.isPending
                ? "Booking..."
                : "Confirm Appointment"}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className={`
    fixed
    top-0 md:top-[64px]
    inset-x-0 bottom-0
    z-[9999]
    flex items-center justify-center
    bg-black/50
    transition-all duration-300

    ${
      isMobile
        ? "px-0" // ✅ mobile full screen
        : collapsed
        ? "px-6"
        : "pl-[240px] pr-6"
    }
  `}
        >
          {/* MODAL CONTAINER */}
          <div
            className={`
    bg-white
    w-full
    h-full md:h-auto
    transition-all duration-300

    ${
      isMobile
        ? "rounded-none" // ✅ mobile fullscreen
        : collapsed
        ? "max-w-none rounded-2xl"
        : "max-w-5xl rounded-2xl"
    }

    md:max-h-[calc(100vh-120px)]
    shadow-2xl
    flex flex-col
  `}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-xl font-semibold">Add New Patient</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X />
              </button>
            </div>

            {/* MODAL BODY (ONLY THIS SCROLLS) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 ">
              {/* PERSONAL INFO */}
              <Section title="Personal Information">
                <Grid>
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(value: string) =>
                      handleInputChange("title", value)
                    }
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
                    onChange={(value: string) =>
                      handleInputChange("gender", value)
                    }
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
                    onChange={(value: string) =>
                      handleInputChange("email", value)
                    }
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(value: string) =>
                      handleInputChange("phone", value)
                    }
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
                    onChange={(value: string) =>
                      handleInputChange("height", value)
                    }
                  />
                  <Input
                    label="Weight (kg)"
                    value={formData.weight}
                    onChange={(value: string) =>
                      handleInputChange("weight", value)
                    }
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
                    onChange={(value: string) =>
                      handleInputChange("smoker", value)
                    }
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
                  onChange={(value: string) =>
                    handleInputChange("allergies", value)
                  }
                />
                <Textarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(value: string) =>
                    handleInputChange("notes", value)
                  }
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

            {/* MODAL FOOTER (ALWAYS VISIBLE) */}
            <div className="flex justify-end gap-4 px-6 py-4 border-t bg-white  shrink-0">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-2 rounded-lg border bg-white-400 hover:bg-red-600 text-black font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Validation
                  if (!formData.first_name.trim()) {
                    toast.error("First name is required");
                    return;
                  }

                  if (!formData.email && !formData.phone) {
                    toast.error(
                      "Please provide at least email or phone number",
                    );
                    return;
                  }

                  const toastId = toast.loading("Adding patient...");

                  addPatient.mutate(formData, {
                    onSuccess: () => {
                      toast.dismiss(toastId);
                      toast.success(
                        `${formData.first_name} ${formData.last_name} added successfully!`,
                      );

                      Swal.fire({
                        title: "Patient Added!",
                        text: `${formData.first_name} ${formData.last_name} has been added to the system.`,
                        icon: "success",
                        timer: 2500,
                        showConfirmButton: false,
                      });

                      resetForm();
                      setShowModal(false);
                    },
                    onError: (error: any) => {
                      toast.dismiss(toastId);
                      const errorMsg =
                        error?.response?.data?.message ||
                        "Failed to add patient. Please try again.";
                      toast.error(errorMsg);
                    },
                  });
                }}
                disabled={addPatient.isPending}
                className="px-6 py-2 rounded-lg border bg-white-600 hover:bg-green-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addPatient.isPending ? "Saving..." : "Save Patient"}
              </button>
            </div>
          </div>
        </div>
      )}
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
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">
        {value || "-"}
      </span>
    </div>
  );
}
