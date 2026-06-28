import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ─── Firebase Setup ────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC5uoITdl5gXDxvvtW60mlRWbEjLejxgRM",
  authDomain: "ceninasia.firebaseapp.com",
  projectId: "ceninasia",
  storageBucket: "ceninasia.firebasestorage.app",
  messagingSenderId: "234745308370",
  appId: "1:234745308370:web:77a89729fa6d829d37390b"
};

const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
window.db   = getFirestore(app);
window.auth = auth;

// Keep user signed in across sessions
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Track current user globally
onAuthStateChanged(auth, (user) => {
  window.currentUser = user || null;
});

// ─── Storage key for "where to return after sign-in" ─────────────────────────
const RETURN_KEY = 'cenin_signin_return_url';

// ─── On every page load: check if we just finished a sign-in and need to go back ──
// Firebase on mobile converts signInWithPopup to a full-page redirect.
// When Google sends us back, Firebase lands us on the originating page—
// but if that fails, this catches it.
auth.authStateReady().then(() => {
  const returnUrl = localStorage.getItem(RETURN_KEY);
  if (!returnUrl) return; // No pending sign-in return

  const user = auth.currentUser;
  if (!user) return; // Not signed in yet, do nothing

  // We are signed in and there is a saved return URL
  localStorage.removeItem(RETURN_KEY);

  try {
    const target = new URL(returnUrl);
    const current = new URL(window.location.href);

    // If we are already on the correct page, no redirect needed
    if (target.pathname === current.pathname) return;

    // We landed on the wrong page — go back to where sign-in was triggered
    window.location.replace(returnUrl);
  } catch (e) {
    // Bad URL stored — ignore
    console.warn('cenin: bad return URL in localStorage, ignoring', e);
  }
});

// ─── Google Sign-In ───────────────────────────────────────────────────────────
async function googleSignIn(triggerBtn) {
  if (window.location.protocol === 'file:') {
    alert("Authentication requires a web server. Please open via http:// or your Firebase Hosting URL.");
    return;
  }

  // Save the current page so we can return here after auth if needed
  localStorage.setItem(RETURN_KEY, window.location.href);

  // Also keep the legacy checkout flag alive
  if (window.location.pathname.includes('shop.html') || window.location.pathname.includes('index.html')) {
    localStorage.setItem('cenin_checkout_redirect', 'true');
  }

  const btn = triggerBtn
    || document.getElementById('triggerGoogleSignInBtn')
    || document.getElementById('profileGoogleSignInBtn')
    || document.getElementById('googleAuthBtn')
    || document.getElementById('ceninGoogleBtn');

  const originalHTML = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:0.7">Signing in...</span>';
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    // signInWithPopup works on desktop.
    // On mobile it is silently converted by Firebase to a full-page redirect.
    // In both cases, after success we clear the return URL and run post-auth actions.
    const result = await signInWithPopup(auth, provider);
    window.currentUser = result.user;

    // Sign-in completed in the same page (popup worked) — clear the return key
    localStorage.removeItem(RETURN_KEY);

    // Close any open auth modal
    ['authModal', 'mandatoryAuthOverlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    // Run page-specific post-auth actions
    runPostAuthActions();

  } catch (error) {
    // User simply closed the popup — not an error
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      localStorage.removeItem(RETURN_KEY); // clean up
    } else {
      console.error('Google Sign-In error:', error);
      alert('Sign-In failed: ' + (error.message || 'Unknown error'));
      localStorage.removeItem(RETURN_KEY);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }
}

// ─── Post-auth actions per page ───────────────────────────────────────────────
function runPostAuthActions() {
  const path = window.location.pathname;

  // Shop page — re-open cart and continue to checkout
  if (path.includes('shop.html')) {
    localStorage.removeItem('cenin_checkout_redirect');
    setTimeout(() => {
      const sidebar = document.getElementById('cartSidebar');
      const overlay = document.getElementById('cartOverlay');
      if (sidebar) sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
      if (typeof window.renderCartUI === 'function') window.renderCartUI();
      if (typeof window.proceedToCheckoutForm === 'function') window.proceedToCheckoutForm();
    }, 400);
  }

  // Creator page — open the creator join modal
  if (path.includes('creator.html') && typeof window.openModal === 'function') {
    window.openModal();
  }
}

// ─── Global helpers called by HTML onclick attributes ─────────────────────────
window.triggerGoogleSignIn = function () {
  googleSignIn();
};

window.triggerGoogleAuth = function (btn) {
  googleSignIn(btn);
};
