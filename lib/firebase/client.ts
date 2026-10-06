import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForDevReviewMode00000",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "campusdesk-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campusdesk-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "campusdesk-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

export const isFirebaseConfigured = (() => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    project.includes("demo");
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
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo",
      message: "Running in local offline mode (Firebase keys not yet configured).",
    };
  }

  try {
    const { doc, getDoc } = await import("firebase/firestore");
    await getDoc(doc(db, "_system", "ping"));
    return {
      configured: true,
      connected: true,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      message: "Successfully connected to Cloud Firestore!",
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      message: err.message || "Failed to reach Cloud Firestore.",
    };
  }
}

export { app, auth, db };
