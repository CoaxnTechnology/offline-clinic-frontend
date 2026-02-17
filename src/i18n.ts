import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      hospitalName: "Expert Echo",
      notifications: "Notifications",
      messages: "Messages",
      new: "new",
      administrator: "Administrator",
      profile: "Profile",
      settings: "Settings",
      logout: "Log out",
      dashboard: "Dashboard",
      patients: "Patients",
      appointment: "Appointment",
      consultant: "Consultant",
      staff: "Staff",
      // settings: "Settings",
      addStaff: "Add Staff",
      hospitalSettings: "Hospital Settings",
    },
  },
  ar: {
    translation: {
      hospitalName: "إكسبيرت إيكو",
      notifications: "الإشعارات",
      messages: "الرسائل",
      new: "جديد",
      administrator: "مدير النظام",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      patients: "المرضى",
      appointment: "المواعيد",
      consultant: "الاستشارات",
      staff: "الموظفين",
      // settings: "الإعدادات",
      addStaff: "إضافة موظف",
      hospitalSettings: "إعدادات المستشفى",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
