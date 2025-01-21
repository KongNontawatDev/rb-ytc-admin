import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//EN
import enCommon from "../locals/en/common.json";
import enNavbar from "../locals/en/navbar.json";
import enMenu from "../locals/en/menu.json";
import enValidation from "../locals/en/validation.json";
import enApp from "../locals/en/app.json";
import enStatus from "../locals/en/status.json";
import enAuth from "../pages/auth/locals/en/auth.en.json";
import enDepartment from "../pages/department/locals/department.en.json";
import enAccessory from "../pages/accessory/locals/accessory.en.json";
import enUser from "../pages/user/locals/user.en.json";
import enAdmin from "../pages/admin/locals/admin.en.json";
import enRole from "../pages/role/locals/role.en.json";
import enRoom from "../pages/room/locals/room.en.json";
import enBookingList from "../pages/booking_list/locals/booking_list.en.json";
import enDashboard from "../pages/dashboard/locals/dashboard.en.json";

// TH
import thCommon from "../locals/th/common.json";
import thNavbar from "../locals/th/navbar.json";
import thMenu from "../locals/th/menu.json";
import thValidation from "../locals/th/validation.json";
import thApp from "../locals/th/app.json";
import thStatus from "../locals/th/status.json";
import thAuth from "../pages/auth/locals/th/auth.th.json";
import thDepartment from "../pages/department/locals/department.th.json";
import thAccessory from "../pages/accessory/locals/accessory.th.json";
import thUser from "../pages/user/locals/user.th.json";
import thAdmin from "../pages/admin/locals/admin.th.json";
import thRole from "../pages/role/locals/role.th.json";
import thRoom from "../pages/room/locals/room.th.json";
import thBookingList from "../pages/booking_list/locals/booking_list.th.json";
import thDashboard from "../pages/dashboard/locals/dashboard.th.json";



export const resources = {
	en: {
		common: enCommon,
		navbar: enNavbar,
		menu: enMenu,
		validation: enValidation,
		app: enApp,
		status: enStatus,
		auth:enAuth,
		department: enDepartment,
		accessory: enAccessory,
		user: enUser,
		admin: enAdmin,
		role: enRole,
		room: enRoom,
		booking_list:enBookingList,
		dashboard:enDashboard,
	},
	th: {
		common: thCommon,
		navbar: thNavbar,
		menu: thMenu,
		validation: thValidation,
		app: thApp,
		status: thStatus,
		auth:thAuth,
		department: thDepartment,
		accessory: thAccessory,
		user: thUser,
		admin: thAdmin,
		role: thRole,
		room: thRoom,
		booking_list:thBookingList,
		dashboard:thDashboard,
	},
};



i18n.use(initReactI18next).init({
  resources,
  lng: "th",
  // ns: ["common", "navbar", "menu", "validation","app","status","auth", "department","accessory"],
  defaultNS: "common",
  fallbackLng: "en",
  debug: true, // เพิ่มเพื่อช่วย debug
  interpolation: {
    escapeValue: false,
  },
});


export default i18n;
