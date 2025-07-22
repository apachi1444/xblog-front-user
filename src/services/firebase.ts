// Import the functions you need from the SDKs you need
import type { Analytics } from "firebase/analytics";

import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXYKAjcGZyBZVxvGDSoqxQDy20Y_oKzC4",
  authDomain: "xblog-df706.firebaseapp.com",
  projectId: "xblog-df706",
  storageBucket: "xblog-df706.firebasestorage.app",
  messagingSenderId: "1095406270268",
  appId: "1:1095406270268:web:4718a04b6d1fd7b9605039",
  measurementId: "G-2EHNK44QYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics with proper checks
// eslint-disable-next-line import/no-mutable-exports
let analytics: Analytics | null = null;

// Check if we're in a browser environment and analytics is supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);

      // Enable debug mode for localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔥 Firebase Analytics Debug Mode Enabled for localhost');
        // Enable debug mode
        (window as any).gtag('config', 'G-2EHNK44QYK', {
          debug_mode: true
        });
      }

      console.log('✅ Firebase Analytics initialized successfully');
    } else {
      console.warn('❌ Firebase Analytics not supported in this browser');
    }
  }).catch((error) => {
    console.error('❌ Error checking Firebase Analytics support:', error);
  });
}

export { analytics };