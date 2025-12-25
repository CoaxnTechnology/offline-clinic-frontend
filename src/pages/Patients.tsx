import { useEffect, useState } from "react";
import { Info, Plus, Search, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "../components/ui/drawer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

export default function Patients() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const doctors = [
    { id: "d1", name: "Dr. Sharma" },
    { id: "d2", name: "Dr. Patel" },
    { id: "d3", name: "Dr. Gupta" },
  ];

  // Slots per doctor per date
  const slotsByDoctorAndDate: Record<string, Record<string, string[]>> = {
    d1: {
      "2025-12-26": ["09:00", "09:30", "10:00", "11:00", "12:00"],
      "2025-12-27": ["10:00", "10:30", "12:00"],
    },
    d2: {
      "2025-12-26": ["09:45", "11:15", "13:00"],
      "2025-12-27": ["10:00", "16:00"],
    },
    d3: {
      "2025-12-26": ["09:00", "10:00", "11:00"],
    },
  };

  // Already booked slots
  const bookedSlots: Record<string, boolean> = {
    "d1_2025-12-26_09:30": true,
    "d1_2025-12-26_10:00": true,
    "d2_2025-12-26_11:15": true,
  };

  const initialPatients = [
    {
      id: "P001",
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
      legacyNumber: "L-1001",
      newPatient: "Yes",
    },
    {
      id: "P002",
      title: "Mr.",
      firstName: "Rohit",
      lastName: "Verma",
      gender: "Male",
      birthDate: "1985-11-02",
      identityNumber: "ID223344",
      email: "rohit.verma@example.com",
      phone: "+91 91234 56789",
      height: "172",
      weight: "78",
      bloodGroup: "B+",
      smoker: "Yes",
      notes: "Diabetic",
      primaryDoctor: "Dr. Patel",
      legacyNumber: "L-1002",
      newPatient: "No",
    },
    {
      id: "P003",
      title: "Mrs.",
      firstName: "Sunita",
      lastName: "Rao",
      gender: "Female",
      birthDate: "1978-03-22",
      identityNumber: "ID998877",
      email: "sunita.rao@example.com",
      phone: "+91 90123 45678",
      height: "158",
      weight: "62",
      bloodGroup: "O-",
      smoker: "No",
      notes: "Hypertension",
      primaryDoctor: "Dr. Iyer",
      legacyNumber: "L-1003",
      newPatient: "No",
    },
    {
      id: "P004",
      title: "Mr.",
      firstName: "Vikram",
      lastName: "Singh",
      gender: "Male",
      birthDate: "1995-07-30",
      identityNumber: "ID556677",
      email: "vikram.singh@example.com",
      phone: "+91 99876 54321",
      height: "180",
      weight: "85",
      bloodGroup: "AB+",
      smoker: "No",
      notes: "Asthma",
      primaryDoctor: "Dr. Rao",
      legacyNumber: "L-1004",
      newPatient: "Yes",
    },
    {
      id: "P005",
      title: "Ms.",
      firstName: "Meera",
      lastName: "Shah",
      gender: "Female",
      birthDate: "2000-01-15",
      identityNumber: "ID334455",
      email: "meera.shah@example.com",
      phone: "+91 90000 11122",
      height: "160",
      weight: "55",
      bloodGroup: "A-",
      smoker: "No",
      notes: "Healthy",
      primaryDoctor: "Dr. Gupta",
      legacyNumber: "L-1005",
      newPatient: "Yes",
    },
  ];

  const [patients] = useState(initialPatients);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { state, isMobile } = useSidebar(); // only state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPatient, setBookingPatient] = useState<any>(null);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const collapsed = state === "collapsed";
  // const [date, setDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const patientsFiltered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });
  useEffect(() => {
    if (!doctor || !date) {
      setAvailableSlots([]);
      setSelectedSlot("");
      return;
    }

    const slots = slotsByDoctorAndDate[doctor]?.[date] || [];

    setAvailableSlots(slots);
    setSelectedSlot("");
  }, [doctor, date]);
  console.log("Doctor:", doctor);
  console.log("Date:", date);
  console.log("Slots:", slotsByDoctorAndDate[doctor]?.[date]);

  return (
    <div className="p-6 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-gray-500">
            Total Patients: {patients.length}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
        >
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient"
          className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#06b6c9]"
        />
      </div>

      {/* LIST PLACEHOLDER */}
      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-md text-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
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
              {patientsFiltered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-cyan-50 cursor-pointer"
                >
                  <td className="px-6 py-4 flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {p.firstName[0]}
                        {p.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{p.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{p.phone}</td>
                  <td className="px-6 py-4">{p.email}</td>
                  <td className="px-6 py-4">
                    <Badge>{p.primaryDoctor}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookingPatient(p);
                        setBookingOpen(true);
                      }}
                      className="px-4 py-2 text-xs bg-cyan-600 text-white rounded-lg"
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
        <div className="md:hidden space-y-4 p-4">
          {patientsFiltered.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPatient(p);
                setDrawerOpen(true);
              }}
              className="border rounded-xl p-4 shadow-sm active:scale-[0.98]"
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {p.firstName[0]}
                      {p.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{p.id}</p>
                  </div>
                </div>
                <Badge>{p.primaryDoctor}</Badge>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>📞 {p.phone}</p>
                <p>📧 {p.email}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBookingPatient(p);
                  setBookingOpen(true);
                }}
                className="mt-3 w-full py-2 bg-cyan-600 text-white rounded-lg"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
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
                  {selectedPatient?.firstName?.[0]}
                  {selectedPatient?.lastName?.[0]}
                </div>

                <div>
                  <DrawerTitle className="text-lg">
                    {selectedPatient
                      ? `${selectedPatient.title} ${selectedPatient.firstName} ${selectedPatient.lastName}`
                      : "Patient Details"}
                  </DrawerTitle>

                  {selectedPatient && (
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                        {selectedPatient.bloodGroup}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          selectedPatient.newPatient === "Yes"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {selectedPatient.newPatient === "Yes"
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
                  <InfoRow label="Gender" value={selectedPatient.gender} />
                  <InfoRow
                    label="Birth Date"
                    value={selectedPatient.birthDate}
                  />
                  <InfoRow
                    label="Identity Number"
                    value={selectedPatient.identityNumber}
                  />
                </Section>

                {/* CONTACT INFO */}
                <Section title="Contact Information">
                  <InfoRow label="Phone" value={selectedPatient.phone} />
                  <InfoRow label="Email" value={selectedPatient.email} />
                </Section>

                {/* MEDICAL INFO */}
                <Section title="Medical Information">
                  <InfoRow
                    label="Height"
                    value={`${selectedPatient.height} cm`}
                  />
                  <InfoRow
                    label="Weight"
                    value={`${selectedPatient.weight} kg`}
                  />
                  <InfoRow label="Smoker" value={selectedPatient.smoker} />
                  <InfoRow
                    label="Primary Doctor"
                    value={selectedPatient.primaryDoctor}
                  />
                </Section>

                {/* OTHER */}
                <Section title="Other Details">
                  <InfoRow
                    label="Legacy Number"
                    value={selectedPatient.legacyNumber}
                  />
                  <InfoRow label="Notes" value={selectedPatient.notes} />
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
                {bookingPatient?.firstName} {bookingPatient?.lastName}
              </b>
            </p>

            {/* DOCTOR */}
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* DATE */}
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg cursor-pointer"
            />

            {/* TIME SLOTS */}
            {doctor && date && (
              <div>
                <p className="text-sm font-semibold mb-2">Available Slots</p>

                {availableSlots.length === 0 ? (
                  <p className="text-sm text-red-500">No slots available</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((t) => {
                      const isBooked = bookedSlots[`${doctor}_${date}_${t}`];

                      return (
                        <button
                          key={t}
                          disabled={isBooked}
                          onClick={() => setTime(t)}
                          className={`
                      py-2 rounded-lg text-sm
                      ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : time === t
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                    `}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
                  <Input label="Title" />
                  <Input label="First Name *" />
                  <Input label="Last Name" />
                  <Input label="Maiden Name" />
                  <Input label="Gender" />
                  <Input label="Birth Date" type="date" />
                  <Input label="Identity Number" />
                  <Input label="Social Security Number" />
                </Grid>
              </Section>

              {/* CONTACT INFO */}
              <Section title="Contact Information">
                <Grid>
                  <Input label="Email" />
                  <Input label="Phone" />
                  <Input label="Secondary Phone" />
                  <Input label="Other Phone" />
                  <Input label="Occupation" />
                </Grid>
              </Section>

              {/* MEDICAL INFO */}
              <Section title="Medical Information">
                <Grid>
                  <Input label="Height (cm)" />
                  <Input label="Weight (kg)" />
                  <Input label="Blood Group" />
                  <Select label="Smoker" options={["No", "Yes"]} />
                  <Input label="Cigarettes Per Day" />
                </Grid>
              </Section>

              {/* MEDICAL HISTORY */}
              <Section title="Medical History">
                <Textarea label="Family History" />
                <Textarea label="Medical / Surgical History" />
                <Textarea label="Gynecological History" />
                <Textarea label="Allergies" />
                <Textarea label="Notes" />
              </Section>

              {/* OTHER DETAILS */}
              <Section title="Other Details">
                <Grid>
                  <Input label="Primary Doctor" />
                  <Input label="Delivery Location" />
                  <Input label="Legacy Number" />
                  <Select label="New Patient" options={["Yes", "No"]} />
                </Grid>
              </Section>
            </div>

            {/* MODAL FOOTER (ALWAYS VISIBLE) */}
            <div className="flex justify-end gap-4 px-6 py-4 border-t bg-white  shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg border bg-white-400 hover:bg-red-600 text-black font-semibold"
              >
                Cancel
              </button>
              <button className="px-6 py-2 rounded-lg border bg-white-600 hover:bg-green-600 text-black font-semibold">
                Save Patient
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

function Input({ label, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
      />
    </div>
  );
}

function Textarea({ label }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <textarea
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
      />
    </div>
  );
}

function Select({ label, options }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none">
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
