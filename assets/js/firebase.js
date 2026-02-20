// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvUDWooyIEkOyDPuzwnkWboLe0JdX_-0k",
  authDomain: "open-bt.firebaseapp.com",
  projectId: "open-bt",
  storageBucket: "open-bt.firebasestorage.app",
  messagingSenderId: "277694041764",
  appId: "1:277694041764:web:d7392841930cd169f42031"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
