// assets/js/session.js
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  signOut,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Récupère le role depuis /roles/{email}
export async function getRoleByEmail(email){
  if(!email) return null;
  try{
    const ref = doc(db, "roles", email);
    const snap = await getDoc(ref);
    if(!snap.exists()) return null;
    return snap.data().role || null;
  } catch(e){
    console.error("getRoleByEmail", e);
    return null;
  }
}

// Login minimal (prompt email + mdp)
export async function loginAndRedirect(){
  const email = prompt("Email (admin) :");
  if(!email) return;
  const pass = prompt("Mot de passe :");
  if(!pass) return;

  try{
    // ✅ Persistance locale => reste connecté sur ce navigateur/appareil
    await setPersistence(auth, browserLocalPersistence);

    await signInWithEmailAndPassword(auth, email, pass);
  } catch(e){
    alert("Erreur login : " + (e.message || e));
  }
}

export async function logout(){
  try{
    await signOut(auth);
  } catch(e){
    console.error(e);
  }
}
