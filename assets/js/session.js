// assets/js/session.js
import { auth } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Récupère le role depuis /roles/{email}
export async function getRoleByEmail(email){
  if(!email) return null;
  try{
    const ref = doc((await import("./firebase.js")).db, "roles", email);
    const snap = await getDoc(ref);
    if(!snap.exists()) return null;
    return snap.data().role || null;
  } catch(e){
    console.error("getRoleByEmail", e);
    return null;
  }
}

// Simple login (tu peux remplacer par ton propre flux)
// ici on propose email/password prompt (façon minimale)
export async function loginAndRedirect(){
  // méthode simple : prompt + signin
  const email = prompt("Email (admin) :");
  if(!email) return;
  const pass = prompt("Mot de passe :");
  if(!pass) return;
  try{
    await signInWithEmailAndPassword(auth, email, pass);
    // redirect handled by calling page via onAuthStateChanged
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
