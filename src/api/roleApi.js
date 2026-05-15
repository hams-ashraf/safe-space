const ROLE_KEY = "userRole";
const USER_KEY = "authUser";

export function saveLoginIdentity(data) {
  if (data?.role != null && String(data.role).trim() !== "") {
    localStorage.setItem(ROLE_KEY, String(data.role));
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
  if (data?.user != null) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    const roleLc = String(data.role).toLowerCase();
    if (roleLc === "patient") {
        const pId = data.patientId || data.user.patientId || data.user.id;
        if (pId) localStorage.setItem("patientId", pId);
    } else if (roleLc === "doctor") {
        const dId = data.doctorId || data.user.doctorId || data.user.id;
        if (dId) localStorage.setItem("doctorId", dId);
    }
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearLoginIdentity() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("patientId");
  localStorage.removeItem("doctorId");
}

function roleLc() {
  return (localStorage.getItem(ROLE_KEY) || "").trim().toLowerCase();
}

export function isPatientUser() {
  return roleLc() === "patient";
}

export function isDoctorUser() {
  return roleLc() === "doctor";
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
