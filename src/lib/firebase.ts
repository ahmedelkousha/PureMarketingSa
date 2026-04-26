import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// TODO: Replace this with your actual Firebase configuration
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Create a new project or select an existing one
// 3. Register your web app to get these config values
// 4. Important: Enable Email/Password Authentication & Firestore Database in the console
const firebaseConfig = {
  apiKey: import.meta.env.PPV_FIREBASE_API_KEY,
  authDomain: import.meta.env.PPV_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PPV_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PPV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PPV_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PPV_FIREBASE_APP_ID,
  measurementId: import.meta.env.PPV_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally (it requires browser context)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
