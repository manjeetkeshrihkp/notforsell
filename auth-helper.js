import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Unified Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5uoITdl5gXDxvvtW60mlRWbEjLejxgRM",
  authDomain: "ceninasia.firebaseapp.com",
  projectId: "ceninasia",
  storageBucket: "ceninasia.firebasestorage.app",
  messagingSenderId: "234745308370",
  appId: "1:234745308370:web:77a89729fa6d829d37390b"
};

// Safe getter functions to retrieve auth and db instances
const getAuthInstance = () => {
  if (window.auth) return window.auth;
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  window.auth = getAuth(app);
  return window.auth;
};

const getDbInstance = () => {
  if (window.db) return window.db;
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  window.db = getFirestore(app);
  return window.db;
};

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Ensure Local Persistence on startup for session retention
setTimeout(() => {
  const authInstance = getAuthInstance();
  setPersistence(authInstance, browserLocalPersistence).catch((err) => {
    console.error("Failed to set auth persistence:", err);
  });
}, 100);

// UI Styles Injection
const injectStyles = () => {
  if (document.getElementById('cenin-auth-styles')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'cenin-auth-styles';
  styleEl.innerHTML = `
    /* =========================================
       REDESIGNED GOOGLE SIGN-IN MODAL & OVERLAYS
    ========================================= */
    :root {
      --gold-accent: #EAB308;
      --gold-glow: rgba(234, 179, 8, 0.4);
      --glass-bg: rgba(15, 15, 17, 0.95);
      --glass-border: rgba(255, 255, 255, 0.08);
      --text-bright: #FFFFFF;
      --text-dim: #A1A1AA;
      --transition-bezier: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Blur & Fade-in Animations */
    @keyframes ceninFadeIn {
      from { opacity: 0; backdrop-filter: blur(0px); }
      to { opacity: 1; backdrop-filter: blur(12px); }
    }
    @keyframes ceninSlideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes ceninModalPop {
      from { transform: scale(0.95) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes ceninLogoGlow {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.1)); }
      50% { filter: drop-shadow(0 0 12px var(--gold-glow)); }
    }
    @keyframes ceninShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Modal Overlay */
    .auth-modal-overlay, .mandatory-auth-overlay, .modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0, 0, 0, 0.75) !important;
      z-index: 999999 !important;
      opacity: 0;
      visibility: hidden;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: var(--transition-bezier) !important;
      backdrop-filter: blur(0px);
    }
    .auth-modal-overlay.active, .mandatory-auth-overlay.active, .modal-overlay.active {
      opacity: 1 !important;
      visibility: visible !important;
      animation: ceninFadeIn 0.4s forwards;
    }

    /* Base Auth Card */
    .auth-modal, .mandatory-auth-card {
      background: var(--glass-bg) !important;
      border: 1px solid var(--glass-border) !important;
      padding: 3rem 2.5rem !important;
      border-radius: 24px !important;
      width: 92% !important;
      max-width: 420px !important;
      text-align: center !important;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--glass-border) !important;
      position: relative !important;
      color: var(--text-bright) !important;
      font-family: 'Inter', sans-serif !important;
      transform: translateY(20px);
      transition: var(--transition-bezier) !important;
    }
    .auth-modal-overlay.active .auth-modal, 
    .mandatory-auth-overlay.active .mandatory-auth-card,
    .modal-overlay.active .auth-modal {
      transform: translateY(0) !important;
      animation: ceninModalPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Mobile Adaptations - Slide-up Bottom Sheet */
    @media (max-width: 600px) {
      .auth-modal-overlay, .mandatory-auth-overlay, .modal-overlay {
        align-items: flex-end !important;
      }
      .auth-modal, .mandatory-auth-card {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 30px 30px 0 0 !important;
        padding: 2.5rem 2rem 3rem 2rem !important;
        border-bottom: none !important;
        transform: translateY(100%);
      }
      .auth-modal-overlay.active .auth-modal, 
      .mandatory-auth-overlay.active .mandatory-auth-card,
      .modal-overlay.active .auth-modal {
        transform: translateY(0) !important;
        animation: ceninSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      /* Drag Handle representation for bottom sheet */
      .auth-modal::before, .mandatory-auth-card::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 4px;
        background: rgba(255,255,255,0.15);
        border-radius: 2px;
      }
    }

    /* Typography & Headers */
    .cenin-auth-logo {
      font-family: 'Space Grotesk', sans-serif !important;
      font-size: 2rem !important;
      font-weight: 800 !important;
      letter-spacing: 4px !important;
      color: var(--text-bright) !important;
      margin-bottom: 0.5rem !important;
      text-transform: uppercase !important;
      animation: ceninLogoGlow 3s ease-in-out infinite;
    }
    .cenin-auth-logo span {
      color: var(--gold-accent) !important;
    }
    .auth-modal h3, .mandatory-auth-card h2 {
      font-size: 1.4rem !important;
      font-weight: 700 !important;
      color: var(--text-bright) !important;
      margin-top: 0.5rem !important;
      margin-bottom: 0.8rem !important;
      letter-spacing: -0.5px !important;
    }
    .auth-modal p, .mandatory-auth-card p {
      color: var(--text-dim) !important;
      font-size: 0.95rem !important;
      line-height: 1.6 !important;
      margin-bottom: 2rem !important;
    }

    /* Redesigned Premium Google Button */
    .google-login-btn, .mandatory-google-btn, .modal-submit-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 12px !important;
      width: 100% !important;
      height: 52px !important;
      padding: 0 1.5rem !important;
      background: var(--text-bright) !important;
      color: #000000 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 50px !important;
      font-family: 'Space Grotesk', sans-serif !important;
      font-weight: 700 !important;
      font-size: 0.95rem !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      transition: var(--transition-bezier) !important;
    }
    .google-login-btn:hover, .mandatory-google-btn:hover, .modal-submit-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15), 0 0 15px rgba(255,255,255,0.05) !important;
      background: #F4F4F5 !important;
    }
    .google-login-btn:active, .mandatory-google-btn:active, .modal-submit-btn:active {
      transform: translateY(0) !important;
    }

    /* Custom animated Google Icon Wrapper */
    .google-logo-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .google-login-btn:hover .google-logo-wrapper, 
    .mandatory-google-btn:hover .google-logo-wrapper {
      transform: rotate(360deg);
    }

    /* Close Button */
    .close-auth-btn {
      position: absolute !important;
      top: 20px !important;
      right: 20px !important;
      background: rgba(255,255,255,0.05) !important;
      border: none !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      font-size: 1.1rem !important;
      cursor: pointer !important;
      color: var(--text-dim) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: var(--transition-bezier) !important;
    }
    .close-auth-btn:hover {
      background: rgba(255,255,255,0.15) !important;
      color: var(--text-bright) !important;
    }

    /* Shimmering loader layout */
    .cenin-loading-shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
      animation: ceninShimmer 1.5s infinite linear;
      border-radius: 8px;
    }

    /* Popup Blocked Fallback Panel styling */
    .popup-blocked-warning {
      margin-top: 1.5rem;
      padding: 1.2rem;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      text-align: left;
      display: none;
      animation: ceninModalPop 0.4s ease-out;
    }
    .popup-blocked-warning.active {
      display: block;
    }
    .popup-blocked-warning h4 {
      color: #EF4444;
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .popup-blocked-warning p {
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
      line-height: 1.4;
    }
    .popup-redirect-btn {
      width: 100%;
      height: 40px;
      background: var(--gold-accent);
      color: #000000;
      border: none;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-bezier);
    }
    .popup-redirect-btn:hover {
      background: #FACC15;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(styleEl);
};

// SVG markup for standard Google icon
const googleIconSvg = `
  <div class="google-logo-wrapper">
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  </div>
`;

// Helper functions for auth redirects
function getPageUrl() {
  return window.location.origin + window.location.pathname + window.location.search;
}

function storeAuthRedirectOrigin() {
  localStorage.setItem('cenin_auth_redirect_origin', getPageUrl());
}

// Redesigned DOM Injector for the Modal Card Content (Guest options removed)
const buildModalContent = (isMandatory = false) => {
  return `
    ${!isMandatory ? `<button class="close-auth-btn" id="closeCeninAuthBtn">&times;</button>` : ''}
    <div class="cenin-auth-logo">Cenin<span>.</span></div>
    <h3>${isMandatory ? 'Secure Access Required' : 'Elevate Your Session'}</h3>
    <p>${isMandatory ? 'Please verify your Cenin identity to manage your profile and view secure settings.' : 'Sign in with Google to securely process your checkout, verify your wallet, and track orders.'}</p>
    
    <button class="google-login-btn" id="ceninGoogleBtn">
       ${googleIconSvg}
       <span>Continue with Google</span>
    </button>
    
    <!-- Custom Pop-up Blocked Warning (Initially Hidden) -->
    <div class="popup-blocked-warning" id="ceninPopupWarning">
      <h4>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Sign-In Window Blocked
      </h4>
      <p>Your browser blocked the secure popup dialog. Tap below to proceed via standard page redirect.</p>
      <button class="popup-redirect-btn" id="ceninRedirectBtn">Continue via Redirect</button>
    </div>
  `;
};

// Main CeninAuth interface object
export const CeninAuth = {
  // Global modal state variables
  modalOverlay: null,
  activeTriggerButton: null,

  init() {
    injectStyles();

    // Check if we have returning redirect auth flow results
    this.handleRedirectResultCheck();

    // Dynamically bind to existing page components
    this.rebindDOM();
  },

  rebindDOM() {
    const self = this;
    const path = window.location.pathname;

    // Check if we are on index, shop, wishlist, profile or creator
    const isProfilePage = path.includes('profile.html');

    // Override the existing modal overlays
    const originalOverlay = document.getElementById('authModal') || document.getElementById('mandatoryAuthOverlay');
    
    if (originalOverlay) {
      // Modify styling to match redesigned structures
      originalOverlay.classList.remove('modal-overlay');
      if (isProfilePage) {
        originalOverlay.className = 'mandatory-auth-overlay';
      } else {
        originalOverlay.className = 'auth-modal-overlay';
      }

      // Build the interior card
      let innerCard = originalOverlay.querySelector('.auth-modal') || originalOverlay.querySelector('.mandatory-auth-card');
      if (!innerCard) {
        innerCard = document.createElement('div');
        innerCard.className = isProfilePage ? 'mandatory-auth-card' : 'auth-modal';
        originalOverlay.appendChild(innerCard);
      }

      // Inject the redesigned UI content
      innerCard.innerHTML = buildModalContent(isProfilePage);
      this.modalOverlay = originalOverlay;

      // Event binding
      const closeBtn = document.getElementById('closeCeninAuthBtn');
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.preventDefault();
          originalOverlay.classList.remove('active');
        };
      }

      const googleBtn = document.getElementById('ceninGoogleBtn');
      if (googleBtn) {
        googleBtn.onclick = (e) => {
          e.preventDefault();
          self.signIn(googleBtn);
        };
      }

      const redirectBtn = document.getElementById('ceninRedirectBtn');
      if (redirectBtn) {
        redirectBtn.onclick = (e) => {
          e.preventDefault();
          self.signInRedirectFlow();
        };
      }
    }

    // Override global functions if requested
    window.triggerGoogleSignIn = function() {
      self.openModal();
    };

    window.triggerGoogleAuth = function(btn) {
      self.signIn(btn);
    };
  },

  openModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.add('active');
    }
  },

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('active');
    }
  },

  // Combined auth handler. Prioritizes popups across both Desktop & Mobile.
  async signIn(btnElement = null) {
    if (window.location.protocol === 'file:') {
      alert("Firebase Authentication requires a local web server (like Live Server or http-server) to run securely.");
      return;
    }

    const authInstance = getAuthInstance();
    this.activeTriggerButton = btnElement || document.getElementById('ceninGoogleBtn');
    const originalContent = this.activeTriggerButton ? this.activeTriggerButton.innerHTML : 'Continue with Google';

    if (this.activeTriggerButton) {
      this.activeTriggerButton.innerHTML = `<span class="cenin-loading-shimmer" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50px; font-weight: 700;">Securing Connection...</span>`;
      this.activeTriggerButton.disabled = true;
    }

    // Hide any previous popup warning
    const warningEl = document.getElementById('ceninPopupWarning');
    if (warningEl) warningEl.classList.remove('active');

    try {
      // Set the flag if logging in during checkout flow
      if (window.location.pathname.includes('shop.html') || window.location.pathname.includes('index.html')) {
        localStorage.setItem('cenin_checkout_redirect', 'true');
      }

      // Try popup sign in first (highly successful across mobile & desktop when user-initiated)
      const result = await signInWithPopup(authInstance, provider);
      window.currentUser = result.user;
      
      // Clear checkout flag and redirect tags if popup succeeds
      localStorage.removeItem('cenin_checkout_redirect');

      if (window.currentUser) {
        this.closeModal();
        
        // Trigger checkout page specific flow
        if (typeof window.proceedToCheckoutForm === 'function') {
          window.proceedToCheckoutForm();
        }
        // Reload or update components if needed
        if (window.location.pathname.includes('creator.html') && typeof window.openModal === 'function') {
          window.openModal();
        }
      }
    } catch (error) {
      console.error("Popup Authentication failed:", error);
      
      // Check if popup was blocked
      if (
        error.code === "auth/popup-blocked" || 
        error.code === "auth/popup-closed-by-user" || 
        error.code === "auth/cancelled-popup-request" || 
        error.code === "auth/operation-not-supported-in-this-environment" || 
        error.code === "auth/web-storage-unsupported"
      ) {
        // Render step-by-step redirect fallback UI inside the card (no ugly browser alert!)
        if (warningEl) {
          warningEl.classList.add('active');
        } else {
          // If no fallback container, proceed directly to redirect
          this.signInRedirectFlow();
        }
      } else {
        alert("Google Sign-In Error: " + error.message);
      }
    } finally {
      if (this.activeTriggerButton) {
        this.activeTriggerButton.innerHTML = originalContent;
        this.activeTriggerButton.disabled = false;
      }
    }
  },

  // Fallback Redirect Flow
  async signInRedirectFlow() {
    storeAuthRedirectOrigin();
    const btn = document.getElementById('ceninRedirectBtn') || this.activeTriggerButton;
    if (btn) {
      btn.innerHTML = "Opening Google...";
      btn.disabled = true;
    }

    try {
      const authInstance = getAuthInstance();
      await signInWithRedirect(authInstance, provider);
    } catch (error) {
      console.error("Redirect trigger failed:", error);
      localStorage.removeItem('cenin_auth_redirect_origin');
      localStorage.removeItem('cenin_checkout_redirect');
      alert("Redirect Sign-in Failed: " + error.message);
      if (btn) {
        btn.innerHTML = "Continue via Redirect";
        btn.disabled = false;
      }
    }
  },

  // Handlers for redirect page callbacks on startup
  async handleRedirectResultCheck() {
    const redirectOrigin = localStorage.getItem('cenin_auth_redirect_origin');
    
    // Check if returning from a redirect Auth flow
    if (redirectOrigin) {
      // Injects a beautiful full-screen loading blocker
      const loader = document.createElement('div');
      loader.id = 'cenin-auth-redirect-loader';
      loader.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: #09090B; z-index: 9999999; display: flex; flex-direction: column;
        align-items: center; justify-content: center; font-family: 'Inter', sans-serif; color: white;
      `;
      loader.innerHTML = `
        <div style="width: 44px; height: 44px; border: 3px solid rgba(255,255,255,0.08); border-top-color: #EAB308; border-radius: 50%; animation: spin 1s cubic-bezier(0.16, 1, 0.3, 1) infinite; margin-bottom: 1.5rem;"></div>
        <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem;">Authenticating Session</div>
        <div style="color: #A1A1AA; font-size: 0.85rem;">Completing secure Google verification...</div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      `;
      document.body.appendChild(loader);

      try {
        const authInstance = getAuthInstance();
        const result = await getRedirectResult(authInstance);
        if (result?.user) {
          window.currentUser = result.user;
        }
        
        // Handle post-redirect route navigation
        const cleanOrigin = redirectOrigin.split('#')[0];
        localStorage.removeItem('cenin_auth_redirect_origin');
        
        if (window.currentUser && cleanOrigin !== window.location.href.split('#')[0]) {
          window.location.replace(cleanOrigin);
        }
      } catch (error) {
        console.error("Redirect session retrieval failed:", error);
        localStorage.removeItem('cenin_auth_redirect_origin');
        localStorage.removeItem('cenin_checkout_redirect');
        alert("Verification failed: " + error.message);
      } finally {
        const loaderEl = document.getElementById('cenin-auth-redirect-loader');
        if (loaderEl) loaderEl.remove();
      }
    }
  }
};

// Automatic initialization on document loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CeninAuth.init());
} else {
  CeninAuth.init();
}
