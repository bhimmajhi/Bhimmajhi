import { getAuth } from "firebase/auth";
import { app } from "./firebase.js";

// Only the admin page needs Auth, so the public site never loads it.
export const auth = getAuth(app);
