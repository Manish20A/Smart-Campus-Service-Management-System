import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const REAL_CONFIG = {
  apiKey: "AIzaSyD-hXA_MFILCW7gqGjQXLijzmyGGgBdLfA",
  authDomain: "campusdesk-61dfa.firebaseapp.com",
  projectId: "campusdesk-61dfa",
  storageBucket: "campusdesk-61dfa.firebasestorage.app",
  messagingSenderId: "507664868049",
  appId: "1:507664868049:web:736679f27fac03816e5bf0",
};

function resolveConfig() {
  const envKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const envProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const isInvalidKey =
    !envKey ||
    envKey.includes("Your") ||
    envKey.includes("Mock") ||
    envKey.includes("placeholder") ||
    envKey.includes("Preview") ||
    envKey.length < 25;

  const isInvalidProject =
    !envProject ||
    envProject === "your-project-id" ||
    envProject === "campusdesk-demo" ||
    envProject === "demo";

  return {
    apiKey: isInvalidKey ? REAL_CONFIG.apiKey : envKey,
    authDomain: isInvalidProject ? REAL_CONFIG.authDomain : (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || REAL_CONFIG.authDomain),
    projectId: isInvalidProject ? REAL_CONFIG.projectId : envProject,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || REAL_CONFIG.storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || REAL_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || REAL_CONFIG.appId,
  };
}

const firebaseConfig = resolveConfig();

export const isFirebaseConfigured = true;

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase client initialization warning:", error);
}

export async function testFirebaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  projectId: string;
  message: string;
}> {
  if (!db) {
    return {
      configured: true,
      connected: false,
      projectId: firebaseConfig.projectId,
      message: "Firestore instance not available.",
    };
  }

  try {
    const { doc, getDoc } = await import("firebase/firestore");
    await getDoc(doc(db, "_system", "ping"));
    return {
      configured: true,
      connected: true,
      projectId: firebaseConfig.projectId,
      message: `Successfully connected to Cloud Firestore (${firebaseConfig.projectId})!`,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      projectId: firebaseConfig.projectId,
      message: err.message || "Failed to reach Cloud Firestore.",
    };
  }
}

export { app, auth, db };
