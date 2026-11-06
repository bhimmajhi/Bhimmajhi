// Har user ka ek unique ID — localStorage mein save hoga (same key as before,
// so old likes stay attached to the same visitor).
const KEY = "smartalone_uid";
let fallbackUid = null;

function makeUid() {
  return "user_" + Math.random().toString(36).slice(2) + Date.now();
}

export function getUserId() {
  try {
    let uid = localStorage.getItem(KEY);
    if (!uid) {
      uid = makeUid();
      localStorage.setItem(KEY, uid);
    }
    return uid;
  } catch {
    // localStorage blocked (private mode etc.) — keep one id for this page load.
    if (!fallbackUid) fallbackUid = makeUid();
    return fallbackUid;
  }
}
