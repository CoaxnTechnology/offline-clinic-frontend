import { ChartCard } from "./ChartCard";
import { SummaryWidget } from "./SummaryWidget";
import { useEffect, useState } from "react";

export function StatsGrid() {
  const [summaryWidgets, setSummaryWidgets] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>({
    patients: [],
    doctors: [],
    appointments: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setSummaryWidgets([
        { title: "Patients", value: 8542, icon: "users", color: "primary" },
        { title: "Doctors", value: 126, icon: "stethoscope", color: "success" },
        { title: "Technicians", value: 48, icon: "activity", color: "warning" },
        { title: "Today's Appointments", value: 92, icon: "calendar", color: "primary" },
        { title: "Pending Reports", value: 17, icon: "file-text", color: "destructive" },
      //  { title: "Critical Patients", value: 5, icon: "alert-circle", color: "destructive" },
       // { title: "Monthly Revenue", value: "₹ 12.4L", icon: "dollar-sign", color: "success" },
       // { title: "Departments", value: 14, icon: "layers", color: "primary" },
      ]);

      setChartData({
        patients: [
          { name: "Admitted", value: 420, color: "hsl(210 100% 56%)" },
          { name: "Discharged", value: 380, color: "hsl(168 100% 50%)" },
          { name: "Critical", value: 25, color: "hsl(0 70% 55%)" },
        ],
        doctors: [
          { name: "Available", value: 92, color: "hsl(142 70% 45%)" },
          { name: "On Duty", value: 28, color: "hsl(210 100% 56%)" },
          { name: "On Leave", value: 6, color: "hsl(45 90% 55%)" },
        ],
        appointments: [
          { name: "Completed", value: 310, color: "hsl(168 100% 50%)" },
          { name: "Pending", value: 84, color: "hsl(210 100% 56%)" },
          { name: "Cancelled", value: 19, color: "hsl(0 70% 55%)" },
        ],
        reports: [
          { name: "Normal", value: 260, color: "hsl(142 70% 45%)" },
          { name: "Review Needed", value: 46, color: "hsl(45 90% 55%)" },
          { name: "Critical", value: 12, color: "hsl(0 70% 55%)" },
        ],
      });

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">

      {/* 🔝 TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TOP PATIENTS */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-cyan-900">
            Top Patients
          </h3>

          <ul className="space-y-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="group relative overflow-hidden flex items-center justify-between
                           p-4 rounded-xl bg-white/90 transition-all duration-300
                           hover:shadow-lg hover:-translate-y-1"
              >
                <span className="absolute left-0 top-0 h-full w-0
                                 bg-gradient-to-b from-cyan-400 to-blue-500
                                 group-hover:w-1 transition-all duration-300" />

                <span className="absolute inset-0
                                 bg-gradient-to-r from-cyan-100/40 to-transparent
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <p className="font-medium text-gray-800 group-hover:text-cyan-700 transition">
                    Patient #{i + 1}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: P-10{i + 1}
                  </p>
                </div>

                <span className="relative z-10 px-3 py-1 text-xs rounded-full
                                 bg-cyan-100 text-cyan-700
                                 group-hover:bg-cyan-500 group-hover:text-white
                                 transition-all duration-300">
                  Active
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* TODAY APPOINTMENTS – SAME HOVER */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-emerald-900">
            Today’s Appointments
          </h3>

          <ul className="space-y-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="group relative overflow-hidden flex items-center justify-between
                           p-4 rounded-xl bg-white/90 transition-all duration-300
                           hover:shadow-lg hover:-translate-y-1"
              >
                <span className="absolute left-0 top-0 h-full w-0
                                 bg-gradient-to-b from-emerald-400 to-teal-500
                                 group-hover:w-1 transition-all duration-300" />

                <span className="absolute inset-0
                                 bg-gradient-to-r from-emerald-100/40 to-transparent
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <p className="font-medium text-gray-800 group-hover:text-emerald-700 transition">
                    Patient #{i + 1}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr. Sharma · 10:{i}0 AM
                  </p>
                </div>

                <span className="relative z-10 px-3 py-1 text-xs rounded-full
                                 bg-green-100 text-green-700
                                 group-hover:bg-green-500 group-hover:text-white
                                 transition-all duration-300">
                  Scheduled
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 🔽 SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {summaryWidgets.map((widget, index) => (
          <SummaryWidget
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            color={widget.color}
            className="group relative overflow-hidden"
            style={{ animationDelay: `${index * 40}ms` }}
          />
        ))}
      </div>

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChartCard title="PATIENTS" data={chartData.patients} />
        <ChartCard title="DOCTORS" data={chartData.doctors} />
        <ChartCard title="APPOINTMENTS" data={chartData.appointments} />
        <ChartCard title="MEDICAL REPORTS" data={chartData.reports} />
      </div>

    </div>
  );
}

export default StatsGrid;
