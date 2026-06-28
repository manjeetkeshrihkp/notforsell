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
window.db  = getFirestore(app);
window.auth = auth;

// Keep user signed in across sessions
setPersistence(auth, browserLocalPersistence).catch(() => {});

// ─── Track current user globally ──────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  window.currentUser = user || null;
});

// ─── Google Sign-In (popup — works on both desktop and mobile) ────────────────
async function googleSignIn(triggerBtn) {
  if (window.location.protocol === 'file:') {
    alert("Authentication requires a web server. Please open via http:// or your Firebase Hosting URL.");
    return;
  }

  const btn = triggerBtn || document.getElementById('triggerGoogleSignInBtn') || document.getElementById('profileGoogleSignInBtn') || document.getElementById('googleAuthBtn') || document.getElementById('ceninGoogleBtn');
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

    const result = await signInWithPopup(auth, provider);
    window.currentUser = result.user;

    // Close any open auth modal
    ['authModal', 'mandatoryAuthOverlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    // If on shop page, re-open cart and continue checkout
    if (window.location.pathname.includes('shop.html')) {
      const sidebar = document.getElementById('cartSidebar');
      const overlay = document.getElementById('cartOverlay');
      if (sidebar) sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
      if (typeof window.renderCartUI === 'function') window.renderCartUI();
      if (typeof window.proceedToCheckoutForm === 'function') window.proceedToCheckoutForm();
    }

    // If on creator page, open the creator modal
    if (window.location.pathname.includes('creator.html') && typeof window.openModal === 'function') {
      window.openModal();
    }

  } catch (error) {
    // User closed the popup — don't show an error
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      // do nothing
    } else {
      console.error('Google Sign-In error:', error);
      alert('Sign-In failed: ' + (error.message || 'Unknown error'));
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }
}

// ─── Global helpers called from HTML onclick attributes ───────────────────────
window.triggerGoogleSignIn = function () {
  googleSignIn();
};

window.triggerGoogleAuth = function (btn) {
  googleSignIn(btn);
};
