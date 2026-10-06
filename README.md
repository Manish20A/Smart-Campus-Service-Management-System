# CampusDesk — Smart Campus Service Management System

> **A quiet, warm, and minimal service operations desk for modern collegiate institutions.**  
> Crafted with deliberate typography, accountable SLA pipelines, and thoughtful micro-interactions.

---

## 1. Overview & Design Philosophy

CampusDesk is a full-featured campus operations platform engineered to replace fragmented email chains, paper requisition forms, and opaque bureaucratic backlogs. It serves three distinct user groups: **Students**, **Department Specialists / Faculty**, and **University Administrators**.

### Design Direction: "Quiet, Warm, Minimal"
The design language avoids generic AI tropes (no purple/blue gradients, no neon glows, no floating glass cards, no emoji icons):
- **Light Theme**: Warm cream/off-white background (`#FAF7F2`), paper-tinted elevated surfaces (`#FFFDF9`), soft beige-gray hairline borders (`#E8E1D6`), and dark warm charcoal text (`#1F1B16`).
- **Dark Theme**: Deep warm charcoal (`#14120F`), textured card surfaces (`#1C1916`), and warm borders (`#2B2722`).
- **Accents**: Soft terracotta / burnt clay (`#C24A1E`) used sparingly, complemented by sage-green (`#2D6A4F`) for completed milestones and warm amber (`#B45309`) for pending intakes.
- **Typography**: Refined editorial serif (`Newsreader`) paired with clean functional sans (`Geist`) and monospace (`Geist Mono`) for ticket references and countdown timers.
- **Texture**: Subtle analog paper grain overlay on the landing page for warmth and tactility.

---

## 2. Complete Feature Inventory

### Core Workflows
1. **Student Registration & Login**: Full profile onboarding (Name, Email, Student ID/Roll Number, Department, Academic Year, Phone). Validated with `zod` and `react-hook-form`. Includes password recovery flow and role-based route protection.
2. **Dynamic Service Catalog**: 15+ official university service pathways across 5 categories (*Academic*, *Facilities*, *Hostel & Living*, *IT & Lab*, *Administrative*). Filterable with category pills, instant search, published SLA hours, and department badges.
3. **Dynamic Application Intake**: Dynamic form generated automatically from each service's required-fields schema (custom selects, dates, numeric copies, cloud URLs). Priority selector recalculates SLA deadlines live (e.g., Urgent cuts turnaround by 50%).
4. **Duplicate Detection Guard**: Proactively warns students if they already have an active unresolved ticket for the same service.
5. **Atomic Ticket Counter**: Generates human-readable IDs (`CD-2026-00042`) using Firestore atomic transactions on `counters/requests`.
6. **Public Ticket Tracker (`/track`)**: Rate-limited, privacy-safe public endpoint allowing anyone to enter a ticket ID to view progress milestones without exposing private contact data.
7. **Status Pipeline**: Enforces valid transitions (`Pending` &rarr; `Assigned` &rarr; `In Progress` &rarr; `Completed`, plus `Declined`, `Cancelled`, and `Reopened` within 7 days).
8. **Interactive Request Detail (`/requests/[id]`)**:
   - Left column: Detailed application parameters, cloud document links, animated vertical audit timeline, and real-time communications thread (with internal staff notes hidden from students).
   - Right column: Status banner, priority badge, SVG progress ring, live SLA countdown timer, assignee portfolio, 1-5 star post-completion review, and printable receipt.

### Administrative & Specialist Operations
9. **Central Request Queue (`/admin/requests` & `/staff/requests`)**:
   - Single-key keyboard shortcuts (`j`/`k` to navigate rows, `a` to assign, `s` to change status, `?` for cheatsheet).
   - Multi-row selection checkboxes for batch assignment and status progression.
   - Saved filter views (*All*, *My Urgent & Overdue*, *Unassigned Intake*, *In Progress*, *Resolved*).
   - 1-click CSV export of filtered records.
10. **Intelligent Workload Balancing**: Automatically assigns new requests to the least-burdened staff member in the target department.
11. **Department Workload Matrix (`/workload`)**: Real-time capacity tracker displaying open backlogs, staff-to-ticket ratios, oldest open ticket age, SLA compliance percentages, stacked Recharts bar chart, and specialist performance leaderboard.
12. **Institutional Analytics (`/admin/analytics`)**: Recharts graphs customized to the warm minimal design system, showing 14-day intake trajectories, demand by service line, pipeline status share, and student satisfaction ratings.
13. **Access Governance & Directory (`/admin/users`)**: Administrator interface to edit roles (`student`, `staff`, `admin`), assign staff to academic departments, and deactivate accounts.
14. **Immutable Audit Trail (`/admin/audit`)**: Cryptographically verified audit log recording actor, timestamp, action type, and entity references.
15. **Campus Announcements**: Dismissible administrative announcement banners published campus-wide.

### Automation & Notifications
16. **Automated SLA Escalation Sentinel**:
   - Secure Vercel Cron endpoint (`/api/cron/escalate` secured with `CRON_SECRET`) configured for daily execution (`0 0 * * *`) on Vercel Hobby free tier.
   - Lazy evaluation on dashboard load for real-time SLA breach detection and escalation without requiring Pro-tier hourly crons.
   - Automatically elevates overdue tickets to `Urgent`, alerts department leadership, and logs escalation events.
17. **In-App & Email Notifications**:
   - Notification bell drawer with unread counter, mark-as-read, and full inbox (`/notifications`).
   - Clean, branded HTML email templates dispatched via Resend on request creation, assignment, status change, comments, escalations, and fulfillment.
18. **Command Palette (`Cmd+K` / `Ctrl+K`)**: Rapid keyboard jump to any page, instant ticket lookup, role switching, and theme selection.
19. **PWA Support**: Full web app manifest, offline shell caching, and mobile bottom navigation for smartphones.

---

## 3. Demo Credentials & Review Roles

The application includes a built-in **1-Click Role Switcher** in the sidebar and login page so reviewers can test every role immediately:

| Role | Demo Account Email | Name | Department Portfolio | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campusdesk.edu` | Dr. Arthur Vance | Office of the Registrar | `CampusDesk2026!` |
| **Faculty Specialist** | `staff.cse@campusdesk.edu` | Prof. Elena Rostova | Computer Science & Eng. | `CampusDesk2026!` |
| **Facilities Staff** | `staff.facilities@campusdesk.edu` | Marcus Sterling | Campus Facilities & Estate | `CampusDesk2026!` |
| **Student (Applicant)** | `student@campusdesk.edu` | Aria Chen (CS-2023-0491) | Computer Science (3rd Yr) | `CampusDesk2026!` |

> *Note: When running without Firebase credentials, CampusDesk seamlessly activates its built-in in-memory / local storage engine preloaded with 40 realistic requests, 6 departments, and 12 services!*

---

## 4. Local Development Setup

### Prerequisites
- Node.js 18.18+ or Node 20+ (Node v22 verified)
- npm 9+ or npm 10+

### Installation
```bash
# Clone repository
git clone https://github.com/Manish20A/Smart-Campus-Service-Management-System.git
cd Smart-Campus-Service-Management-System

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Firebase Configuration & Deployment

### Step 1: Create Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a project named `campusdesk`.
2. Under **Build &rarr; Authentication**, enable **Email/Password** provider.
3. Under **Build &rarr; Cloud Firestore**, create a Firestore database in production mode.

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values from your Firebase Project Settings:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Client SDK (Project Settings -> General -> Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=campusdesk.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=campusdesk
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=campusdesk.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...

# Firebase Admin SDK (Project Settings -> Service Accounts -> Generate New Private Key)
FIREBASE_PROJECT_ID=campusdesk
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@campusdesk.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resend Email API Key (https://resend.com)
RESEND_API_KEY=re_123456789...

# Vercel Cron Secret Token
CRON_SECRET=campusdesk_super_secret_cron_token_2026
```

### Step 3: Run Database Seed Script
Populate your Cloud Firestore database with demo departments, services, demo accounts, and 40 realistic sample requests:
```bash
npm run seed
```

### Step 4: Deploy Security Rules & Indexes
Deploy `firestore.rules` and `firestore.indexes.json` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 6. Vercel Deployment Guide

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete CampusDesk production release"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New &rarr; Project**.
3. Import the repository `Manish20A/Smart-Campus-Service-Management-System`.
4. Under **Environment Variables**, click **"or paste the .env contents"** and paste the variables from `.env.example` (or configure your live Firebase credentials).
5. Click **Deploy**. Vercel will automatically detect `vercel.json` with the Hobby-compliant daily cron (`0 0 * * *`) at `/api/cron/escalate`, paired with CampusDesk's real-time lazy dashboard evaluator.

---

## 7. Keyboard Shortcuts Reference

Press `?` on any table view to bring up the cheat sheet:

| Key | Action |
| :--- | :--- |
| `j` or `↓` | Navigate down to next row in table |
| `k` or `↑` | Navigate up to previous row in table |
| `Enter` | Open selected request detail view |
| `a` | Trigger quick specialist assignment modal |
| `s` | Trigger quick status transition modal |
| `⌘K` or `Ctrl+K` | Open global Command Palette & Search |
| `?` | Toggle keyboard shortcuts modal |
| `Esc` | Dismiss modals and overlay drawers |

---

## 8. Architectural Decisions Log

- **Next.js App Router**: Built entirely with Server Components for static routes and optimized Client Components for interactive forms and charts.
- **Lenis + GSAP ScrollTrigger**: Smooth momentum scroll synchronized with scrubbed timeline cards. Fallback logic automatically disables heavy scrub animations when `prefers-reduced-motion` is detected.
- **Atomic Counter Document**: Request IDs are generated via Firestore transactions (`counters/requests`) to prevent race conditions or duplicate ticket numbers during high-concurrency admission cycles.
- **Dual Communication Stream**: Request comments support `isInternal: boolean`. Internal notes are restricted to staff and admins via Firestore Security Rules, while public updates are accessible to students.
- **Rate-Limited Public Tracking**: The public tracking API route (`/api/track/[ticketId]`) whitelists only non-sensitive milestone fields and applies a rate limiter to safeguard student contact privacy.

---

&copy; 2026 CampusDesk. Handcrafted for modern collegiate institutions.
