import { db } from "./client";
import { runTransaction, doc } from "firebase/firestore";

export async function generateNextTicketId(): Promise<string> {
  const currentYear = new Date().getFullYear();

  if (db && db.app.options.apiKey && db.app.options.apiKey !== "AIzaSyMockKeyForDevReviewMode00000") {
    try {
      const counterRef = doc(db, "counters", "requests");
      const nextId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let currentCount = 0;
        let counterYear = currentYear;

        if (counterDoc.exists()) {
          const data = counterDoc.data();
          currentCount = data.count || 0;
          counterYear = data.year || currentYear;
        }

        // If year rollover, reset counter or maintain continuous
        const nextCount = currentCount + 1;
        transaction.set(
          counterRef,
          {
            count: nextCount,
            year: currentYear,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        const padded = String(nextCount).padStart(5, "0");
        return `CD-${currentYear}-${padded}`;
      });

      return nextId;
    } catch (err) {
      console.warn("Firestore transaction failed, falling back to local counter generator:", err);
    }
  }

  // Fallback counter for demo & offline mode
  try {
    const key = "campusdesk_request_counter";
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    let count = raw ? parseInt(raw, 10) : 42;
    count += 1;
    if (typeof window !== "undefined") {
      localStorage.setItem(key, String(count));
    }
    const padded = String(count).padStart(5, "0");
    return `CD-${currentYear}-${padded}`;
  } catch {
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `CD-${currentYear}-${random}`;
  }
}
