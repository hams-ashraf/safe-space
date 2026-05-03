const ROLE_KEY = "userRole";
const USER_KEY = "authUser";

/** بعد Login: احفظ `role` و `user` اللي الريسبونس بيرجّعهم. */
export function saveLoginIdentity(data) {
  if (data?.role != null && String(data.role).trim() !== "") {
    localStorage.setItem(ROLE_KEY, String(data.role));
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
  if (data?.user != null) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearLoginIdentity() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
}

function roleLc() {
  return (localStorage.getItem(ROLE_KEY) || "").trim().toLowerCase();
}

/** Doctors: الأزرار تظهر للمريض فقط */
export function isPatientUser() {
  return roleLc() === "patient";
}

/** Meeting: زر Notes يظهر للدكتور فقط */
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
