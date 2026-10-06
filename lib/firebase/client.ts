import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD-hXA_MFILCW7gqGjQXLijzmyGGgBdLfA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "campusdesk-61dfa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campusdesk-61dfa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "campusdesk-61dfa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "507664868049",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:507664868049:web:736679f27fac03816e5bf0",
};

export const isFirebaseConfigured = (() => {
  const key = firebaseConfig.apiKey;
  const project = firebaseConfig.projectId;
  if (!key || !project) return false;
  // Check for placeholder or demo strings
  const isPlaceholderKey =
    key.includes("Mock") ||
    key.includes("Demo") ||
    key.includes("Your") ||
    key.includes("placeholder") ||
    key.includes("Preview") ||
    key.length < 25;
  const isPlaceholderProject =
    project === "campusdesk-demo" ||
    project.includes("your-project-id") ||
    project === "demo";
  return !isPlaceholderKey && !isPlaceholderProject;
})();

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
  if (!isFirebaseConfigured || !db) {
    return {
      configured: false,
      connected: false,
      projectId: firebaseConfig.projectId || "demo",
      message: "Running in local demo mode (Firebase keys not yet configured).",
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
