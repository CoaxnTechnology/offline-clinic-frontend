import { useState } from "react";
import { Plus, Search, X, Edit, Trash } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../components/ui/drawer";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { useReceptionists } from "@/hooks/receptionists/useReceptionists";
import { useAddReceptionist } from "@/hooks/receptionists/useAddReceptionist";
import { useUpdateReceptionist } from "@/hooks/receptionists/useUpdateReceptionist";
import { useDeleteReceptionist } from "@/hooks/receptionists/useDeleteReceptionist";

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "receptionist" | "doctor";
};

export default function StaffPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const { data: staff = [], isLoading } = useReceptionists("receptionist");

  const addStaff = useAddReceptionist();
  const updateStaff = useUpdateReceptionist();
  const deleteStaff = useDeleteReceptionist();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const staffFiltered = staff.filter((s: Staff) =>
    `${s.first_name} ${s.last_name} ${s.email} ${s.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleDeleteStaff = (id: number) => {
    Swal.fire({
      title: "Delete staff member?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.loading("Deleting staff...", { id: "delete-staff" });

        deleteStaff.mutate(id, {
          onSuccess: () => {
            toast.success("Staff deleted successfully", {
              id: "delete-staff",
            });
            setDrawerOpen(false);
            setSelectedStaff(null);
          },
          onError: () => {
            toast.error("Failed to delete staff", {
              id: "delete-staff",
            });
          },
        });
      }
    });
  };

  const handleSaveStaff = () => {
    console.log("🔥 Save clicked");
    console.log("isEditing:", isEditing);
    console.log("editingId:", editingId);
    console.log("form:", form);

    if (!form.first_name || !form.email) {
      toast.error("First name and email are required");
      return;
    }

    const payload = {
      username: form.email,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      role: "receptionist",
    };

    if (isEditing && editingId !== null) {
      console.log("🟡 UPDATE API SHOULD CALL", editingId, payload);

      updateStaff.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            console.log("✅ UPDATE SUCCESS");
            toast.success("Staff updated successfully");
            setShowModal(false);
          },
          onError: (err) => {
            console.error("❌ UPDATE ERROR", err);
            toast.error("Update failed");
          },
        },
      );
    } else {
      console.log("🟢 ADD API SHOULD CALL", payload);

      addStaff.mutate(payload, {
        onSuccess: () => {
          console.log("✅ ADD SUCCESS");
          toast.success("Staff added successfully");
          setShowModal(false);
        },
        onError: (err) => {
          console.error("❌ ADD ERROR", err);
          toast.error("Add failed");
        },
      });
    }

    setForm({ first_name: "", last_name: "", email: "", phone: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-gray-500">Total Staff: {staff.length}</p>
        </div>

        <button
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setForm({ first_name: "", last_name: "", email: "", phone: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff"
          className="w-full pl-10 pr-4 py-3 rounded-xl border"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {staffFiltered.map((s: Staff) => (
              <tr
                key={s.id}
                onClick={() => {
                  setSelectedStaff(s);
                  setDrawerOpen(true);
                }}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 flex gap-3 items-center">
                  <Avatar>
                    <AvatarFallback>
                      {s.first_name[0]}
                      {s.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {s.first_name} {s.last_name}
                    </p>
                    <p className="text-xs text-gray-500">#{s.id}</p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p>{s.phone}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </td>

                <td className="px-6 py-4">
                  <Badge className="bg-green-100 text-green-700">
                    Receptionist
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        console.log("✏️ EDIT CLICKED:", s.id);

                        setIsEditing(true);
                        setEditingId(s.id); // 🔥 THIS MUST BE NUMBER
                        setForm({
                          first_name: s.first_name,
                          last_name: s.last_name,
                          email: s.email,
                          phone: s.phone,
                        });

                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStaff(s.id);
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 ${
            isMobile ? "" : collapsed ? "px-6" : "pl-[240px] pr-6"
          }`}
        >
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Update Staff" : "Add Staff"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="First Name"
                value={form.first_name}
                onChange={(e: any) =>
                  setForm((f) => ({ ...f, first_name: e.target.value }))
                }
              />
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={(e: any) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(e: any) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e: any) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end px-6 py-4 border-t">
              <button
                onClick={handleSaveStaff}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg"
              >
                {isEditing ? "Update Staff" : "Save Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* REUSABLE */
function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
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
