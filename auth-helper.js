// auth-helper.js — Cenin Google Sign-In helper
// Uses signInWithRedirect for mobile compatibility.
// Saves the current page URL before redirecting so onAuthStateChanged
// can navigate the user back after Google returns them to the app.

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",               // ← keep your existing values
  authDomain: "ceninasia.firebaseapp.com",
  projectId: "ceninasia",
  storageBucket: "ceninasia.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",  // ← keep your existing values
  appId: "YOUR_APP_ID"                  // ← keep your existing values
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ─── Consume any pending redirect result on page load ───────────────────────
// This handles the case where Firebase finishes its internal redirect handling.
// The actual page navigation back to origin happens inside onAuthStateChanged
// in each page's inline script (already patched to do window.location.href).
getRedirectResult(auth).catch((err) => {
  if (err.code !== "auth/null-user") {
    console.error("[auth-helper] getRedirectResult error:", err);
  }
});

// ─── Trigger sign-in ─────────────────────────────────────────────────────────
window.triggerGoogleSignIn = function () {
  // Save the page the user is currently on so we can return them here
  // after Google redirects back to the app (which always lands on index.html
  // or whichever page is the Firebase authDomain callback target).
  localStorage.setItem('cenin_auth_redirect_origin', window.location.href);

  signInWithRedirect(auth, provider).catch((err) => {
    console.error("[auth-helper] signInWithRedirect error:", err);
    // Clean up the saved origin if redirect itself failed
    localStorage.removeItem('cenin_auth_redirect_origin');
  });
};
