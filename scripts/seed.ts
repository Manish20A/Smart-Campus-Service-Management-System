import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import {
  SEED_DEPARTMENTS,
  SEED_SERVICES,
  SEED_USERS,
  SEED_ANNOUNCEMENTS,
  generateSeedRequests,
} from "../lib/data/seedData";

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

async function runSeed() {
  console.log("==========================================");
  console.log("   CampusDesk — Database Seeder (v1.0)    ");
  console.log("==========================================");

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.log("\n[Notice] Firebase Admin credentials not detected in .env.local.");
    console.log("The application operates out-of-the-box using the built-in local store");
    console.log("with 40 realistic requests, 6 departments, and 12 services already loaded.");
    console.log("\nTo seed your live Cloud Firestore instance:");
    console.log("1. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to .env.local");
    console.log("2. Run: npm run seed");
    console.log("==========================================\n");
    return;
  }

  console.log(`Connecting to Firebase Project: ${projectId}...`);

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formatPrivateKey(privateKey),
    }),
  });

  const db = getFirestore(app);
  const auth = getAuth(app);

  try {
    console.log("1. Seeding Departments...");
    for (const dept of SEED_DEPARTMENTS) {
      await db.collection("departments").doc(dept.id).set(dept);
    }
    console.log(`✓ Seeded ${SEED_DEPARTMENTS.length} departments.`);

    console.log("2. Seeding Services...");
    for (const srv of SEED_SERVICES) {
      await db.collection("services").doc(srv.id).set(srv);
    }
    console.log(`✓ Seeded ${SEED_SERVICES.length} services.`);

    console.log("3. Seeding Demo Users & Auth Accounts...");
    for (const u of SEED_USERS) {
      // Create user doc in Firestore
      await db.collection("users").doc(u.uid).set(u);

      // Attempt to create in Firebase Auth (password: CampusDesk2026!)
      try {
        await auth.createUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          password: "CampusDesk2026!",
        });
        console.log(`  Created Auth user: ${u.email}`);
      } catch (err: any) {
        if (err.code === "auth/uid-already-exists" || err.code === "auth/email-already-exists") {
          console.log(`  User already exists in Auth: ${u.email}`);
        } else {
          console.warn(`  Warning creating user ${u.email}:`, err.message);
        }
      }
    }
    console.log(`✓ Seeded ${SEED_USERS.length} demo profiles.`);

    console.log("4. Seeding Requests & Audit History...");
    const { requests, eventsMap, commentsMap } = generateSeedRequests();

    for (const req of requests) {
      await db.collection("requests").doc(req.id).set(req);

      // Seed events subcollection
      const events = eventsMap[req.id] || [];
      for (const ev of events) {
        await db
          .collection("requests")
          .doc(req.id)
          .collection("events")
          .doc(ev.id)
          .set(ev);
      }

      // Seed comments subcollection
      const comments = commentsMap[req.id] || [];
      for (const cm of comments) {
        await db
          .collection("requests")
          .doc(req.id)
          .collection("comments")
          .doc(cm.id)
          .set(cm);
      }
    }
    console.log(`✓ Seeded ${requests.length} realistic requests with events and comments.`);

    console.log("5. Initializing Atomic Ticket Counter & System Settings...");
    await db.collection("counters").doc("requests").set({
      count: 40,
      year: 2026,
      updatedAt: new Date().toISOString(),
    });

    await db.collection("settings").doc("general").set({
      id: "general",
      escalationThresholdHours: 24,
      urgentSlaMultiplier: 0.5,
      autoAssignEnabled: true,
      defaultEmailSender: "notifications@campusdesk.edu",
      updatedAt: new Date().toISOString(),
    });

    for (const ann of SEED_ANNOUNCEMENTS) {
      await db.collection("announcements").doc(ann.id).set(ann);
    }

    console.log("✓ Seeding complete! Database is fully populated.");
    console.log("==========================================");
  } catch (err) {
    console.error("Seeding encountered an error:", err);
  } finally {
    process.exit(0);
  }
}

runSeed();
