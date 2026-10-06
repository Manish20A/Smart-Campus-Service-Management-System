import {
  Department,
  Service,
  UserProfile,
  ServiceRequest,
  TimelineEvent,
  RequestComment,
  CampusAnnouncement,
} from "@/types";

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: "dept-registrar",
    name: "Office of the Registrar",
    code: "REG",
    description: "Academic transcripts, degree verifications, bonafide letters, and formal university certificates.",
    headId: "user-admin",
    headName: "Dr. Arthur Vance",
    headEmail: "registrar@campusdesk.edu",
    autoAssignRule: "least_loaded",
    activeStaffCount: 4,
    openRequestsCount: 12,
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "dept-cse",
    name: "Department of Computer Science & Eng.",
    code: "CSE",
    description: "High-performance compute clusters, specialized robotics gear, lab safety clearances, and software licenses.",
    headId: "user-staff-cse",
    headName: "Prof. Elena Rostova",
    headEmail: "staff.cse@campusdesk.edu",
    autoAssignRule: "round_robin",
    activeStaffCount: 6,
    openRequestsCount: 8,
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "dept-facilities",
    name: "Campus Facilities & Estate",
    code: "FAC",
    description: "Lecture hall HVAC, residential plumbing, electrical maintenance, campus locks, and physical infrastructure.",
    headId: "user-staff-fac",
    headName: "Marcus Sterling",
    headEmail: "staff.facilities@campusdesk.edu",
    autoAssignRule: "least_loaded",
    activeStaffCount: 8,
    openRequestsCount: 14,
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "dept-hostel",
    name: "Hostel & Residential Life",
    code: "HRL",
    description: "Room allocation, late-entry gate approvals, dining complaints, and residential room inventory.",
    headId: "user-staff-hostel",
    headName: "Sarah Jenkins",
    headEmail: "hostel@campusdesk.edu",
    autoAssignRule: "least_loaded",
    activeStaffCount: 5,
    openRequestsCount: 9,
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "dept-library",
    name: "University Central Library",
    code: "LIB",
    description: "Inter-institutional journal access, rare archive retrieval, thesis repository deposit, and study pod booking.",
    headId: "user-staff-lib",
    headName: "Kenneth Thorne",
    headEmail: "library@campusdesk.edu",
    autoAssignRule: "round_robin",
    activeStaffCount: 3,
    openRequestsCount: 4,
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "dept-student-affairs",
    name: "Office of Student Affairs",
    code: "OSA",
    description: "Club event permissions, travel grants, student ID card re-issuance, and medical absence waivers.",
    headId: "user-staff-osa",
    headName: "Maya Lin",
    headEmail: "studentaffairs@campusdesk.edu",
    autoAssignRule: "round_robin",
    activeStaffCount: 4,
    openRequestsCount: 7,
    createdAt: "2025-08-01T08:00:00Z",
  },
];

export const SEED_SERVICES: Service[] = [
  {
    id: "srv-official-transcript",
    name: "Official Academic Transcript",
    code: "REG-TRS",
    description: "Certified hard-copy transcript stamped by the university registrar for graduate school or visa applications.",
    departmentId: "dept-registrar",
    departmentName: "Office of the Registrar",
    category: "Academic",
    defaultPriority: "normal",
    slaHours: 48,
    autoAssignEnabled: true,
    icon: "FileText",
    isActive: true,
    requiredFields: [
      {
        id: "numberOfCopies",
        label: "Number of Copies",
        type: "number",
        placeholder: "1",
        required: true,
        defaultValue: 1,
        helpText: "Standard fee applies beyond 2 copies.",
      },
      {
        id: "dispatchMethod",
        label: "Fulfillment Method",
        type: "select",
        required: true,
        options: ["Physical Counter Collection", "Express Courier Delivery", "Digital PDF via Digitary"],
        helpText: "Select how you wish to receive the sealed envelope.",
      },
      {
        id: "recipientInstitution",
        label: "Receiving Institution / Purpose",
        type: "text",
        placeholder: "e.g., Stanford University Graduate Admissions",
        required: true,
      },
    ],
    faq: [
      {
        question: "How long does verification take during examination periods?",
        answer: "Standard SLA is 48 hours. During finals week, it may take up to 72 hours due to grade audits.",
      },
      {
        question: "Can someone else collect on my behalf?",
        answer: "Yes, provided they carry an authorization letter signed by you and your student ID copy.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-bonafide-letter",
    name: "Bonafide Student Certificate",
    code: "REG-BON",
    description: "Letter verifying active enrollment, academic standing, and residency for bank loans, passport, or internship applications.",
    departmentId: "dept-registrar",
    departmentName: "Office of the Registrar",
    category: "Academic",
    defaultPriority: "low",
    slaHours: 24,
    autoAssignEnabled: true,
    icon: "Award",
    isActive: true,
    requiredFields: [
      {
        id: "purpose",
        label: "Purpose of Certificate",
        type: "select",
        required: true,
        options: ["Passport Application / Renewal", "Education Bank Loan", "Hostel / Rental Verification", "Foreign Visa Application", "Internship Clearance"],
      },
      {
        id: "addressedTo",
        label: "Addressed To (Optional)",
        type: "text",
        placeholder: "e.g., Regional Passport Officer / Branch Manager",
        required: false,
      },
    ],
    faq: [
      {
        question: "Is this certificate issued digitally?",
        answer: "Yes, bonafide certificates carry a verifiable cryptographic QR code and can be downloaded instantly once approved.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-gpu-cluster",
    name: "High-Performance GPU Cluster Allocation",
    code: "CSE-GPU",
    description: "Request dedicated compute node hours (NVIDIA A100/H100) on the department's deep learning cluster for thesis research.",
    departmentId: "dept-cse",
    departmentName: "Department of Computer Science & Eng.",
    category: "IT & Lab",
    defaultPriority: "high",
    slaHours: 24,
    autoAssignEnabled: true,
    icon: "Cpu",
    isActive: true,
    requiredFields: [
      {
        id: "advisorName",
        label: "Faculty Advisor Name",
        type: "text",
        placeholder: "Prof. Alan Turing",
        required: true,
      },
      {
        id: "requestedHours",
        label: "Requested Node Hours",
        type: "number",
        placeholder: "48",
        required: true,
        helpText: "Allocations exceeding 100 hours require departmental board review.",
      },
      {
        id: "frameworkStack",
        label: "Framework & Docker Container",
        type: "select",
        required: true,
        options: ["PyTorch 2.4 + CUDA 12.4", "JAX / Flax", "TensorFlow 2.16", "Custom Singularity Container"],
      },
      {
        id: "projectAbstract",
        label: "Brief Research Project Abstract",
        type: "textarea",
        placeholder: "Summarize the computational workload and model architecture...",
        required: true,
      },
    ],
    faq: [
      {
        question: "What is the maximum queue time for SLURM jobs?",
        answer: "Default jobs run under partition 'research' with a 48h walltime limit. Check cluster dashboard for live queue.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-lab-equipment",
    name: "Specialized Lab Gear & Oscilloscope Checkout",
    code: "CSE-LAB",
    description: "Temporary equipment checkout for FPGA boards, digital storage oscilloscopes, logic analyzers, and sensor kits.",
    departmentId: "dept-cse",
    departmentName: "Department of Computer Science & Eng.",
    category: "IT & Lab",
    defaultPriority: "normal",
    slaHours: 24,
    autoAssignEnabled: true,
    icon: "Wrench",
    isActive: true,
    requiredFields: [
      {
        id: "equipmentType",
        label: "Equipment Model / Identifier",
        type: "select",
        required: true,
        options: ["Tektronix 4-Channel 1GHz Scope", "Xilinx Zynq UltraScale+ FPGA", "Keysight Spectrum Analyzer", "NVIDIA Jetson AGX Orin Kit"],
      },
      {
        id: "returnDate",
        label: "Expected Return Date",
        type: "date",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-wifi-network",
    name: "Campus Wi-Fi & 802.1X Device Registration",
    code: "CSE-NET",
    description: "Register MAC addresses for headless Linux servers, Raspberry Pis, or report residential Wi-Fi access point dead zones.",
    departmentId: "dept-cse",
    departmentName: "Department of Computer Science & Eng.",
    category: "IT & Lab",
    defaultPriority: "normal",
    slaHours: 12,
    autoAssignEnabled: true,
    icon: "Wifi",
    isActive: true,
    requiredFields: [
      {
        id: "deviceMac",
        label: "Device Hardware MAC Address",
        type: "text",
        placeholder: "00:1A:2B:3C:4D:5E",
        required: true,
      },
      {
        id: "hostelOrBlock",
        label: "Building & Room Location",
        type: "text",
        placeholder: "Hostel Oak, Block B, Room 314",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-hvac-maintenance",
    name: "Hostel Room HVAC & Electrical Repair",
    code: "FAC-ELE",
    description: "Report malfunctioning room air conditioning, ceiling fans, power sockets, or emergency circuit breaker trips.",
    departmentId: "dept-facilities",
    departmentName: "Campus Facilities & Estate",
    category: "Facilities",
    defaultPriority: "urgent",
    slaHours: 8,
    autoAssignEnabled: true,
    icon: "Zap",
    isActive: true,
    requiredFields: [
      {
        id: "roomNumber",
        label: "Hostel & Room Number",
        type: "text",
        placeholder: "Hostel Cedar, Room 208",
        required: true,
      },
      {
        id: "issueType",
        label: "Issue Subcategory",
        type: "select",
        required: true,
        options: ["AC Blowing Warm Air / Leaking", "Power Outage in Room Only", "Sparks / Exposed Socket", "Ceiling Fan Noise / Inoperable"],
      },
      {
        id: "availabilityTime",
        label: "Preferred Maintenance Technician Slot",
        type: "select",
        required: true,
        options: ["Immediate (Emergency)", "Morning (09:00 - 12:00)", "Afternoon (14:00 - 17:00)", "Evening (17:00 - 19:00)"],
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-plumbing",
    name: "Hostel Plumbing & Water Fixtures",
    code: "FAC-PLU",
    description: "Urgent fix for leaking taps, water pressure drop, bathroom drainage clogs, or hot water geyser issues.",
    departmentId: "dept-facilities",
    departmentName: "Campus Facilities & Estate",
    category: "Facilities",
    defaultPriority: "normal",
    slaHours: 12,
    autoAssignEnabled: true,
    icon: "Droplets",
    isActive: true,
    requiredFields: [
      {
        id: "location",
        label: "Floor / Wing / Room Number",
        type: "text",
        placeholder: "Cedar Block A, 2nd Floor Washroom",
        required: true,
      },
      {
        id: "leakSeverity",
        label: "Severity",
        type: "select",
        required: true,
        options: ["Dripping Faucet", "Moderate Clog", "Major Flood / Pipe Burst"],
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-lost-id-card",
    name: "Replacement Student ID Smart Card",
    code: "OSA-IDC",
    description: "Report lost or damaged smart RFID campus card. Generates temporary gate QR badge while physical replacement is printed.",
    departmentId: "dept-student-affairs",
    departmentName: "Office of Student Affairs",
    category: "Administrative",
    defaultPriority: "normal",
    slaHours: 24,
    autoAssignEnabled: true,
    icon: "CreditCard",
    isActive: true,
    requiredFields: [
      {
        id: "policeReportOrAffidavit",
        label: "Status of Old Card",
        type: "select",
        required: true,
        options: ["Physically Damaged / Cracked Chip", "Lost on Campus", "Lost Off-Campus (Reported)"],
      },
      {
        id: "reissueReason",
        label: "Circumstance Notes",
        type: "text",
        placeholder: "Brief explanation of loss",
        required: false,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-medical-leave",
    name: "Medical Leave Attendance Waiver",
    code: "OSA-MED",
    description: "Submit university health center endorsed sick notes to excuse mandatory lecture and lab attendances.",
    departmentId: "dept-student-affairs",
    departmentName: "Office of Student Affairs",
    category: "Administrative",
    defaultPriority: "normal",
    slaHours: 36,
    autoAssignEnabled: true,
    icon: "HeartPulse",
    isActive: true,
    requiredFields: [
      {
        id: "startDate",
        label: "Leave Start Date",
        type: "date",
        required: true,
      },
      {
        id: "endDate",
        label: "Leave End Date",
        type: "date",
        required: true,
      },
      {
        id: "doctorName",
        label: "Attending Physician / Clinic",
        type: "text",
        placeholder: "Campus Health Center Dr. Roberts",
        required: true,
      },
      {
        id: "medicalPrescriptionUrl",
        label: "Medical Certificate Link / Cloud Document",
        type: "url",
        placeholder: "https://drive.google.com/file/d/...",
        required: true,
        helpText: "Attach direct link to scanned doctor note or clinical slip.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-inter-library-loan",
    name: "Inter-Library Research Journal & Monograph",
    code: "LIB-ILL",
    description: "Request rare manuscripts or paid paywalled scientific publications through university inter-library consortia.",
    departmentId: "dept-library",
    departmentName: "University Central Library",
    category: "Academic",
    defaultPriority: "low",
    slaHours: 72,
    autoAssignEnabled: true,
    icon: "BookOpen",
    isActive: true,
    requiredFields: [
      {
        id: "publicationDoi",
        label: "Article DOI or Book ISBN",
        type: "text",
        placeholder: "10.1145/3290605.3300582",
        required: true,
      },
      {
        id: "itemTitle",
        label: "Title & Author",
        type: "text",
        placeholder: "Attention Is All You Need — Vaswani et al.",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-hostel-room-change",
    name: "Hostel Room Reallocation Request",
    code: "HRL-ROM",
    description: "Formal petition to swap hostel rooms or relocate for documented health, accessibility, or study-group requirements.",
    departmentId: "dept-hostel",
    departmentName: "Hostel & Residential Life",
    category: "Hostel & Living",
    defaultPriority: "normal",
    slaHours: 72,
    autoAssignEnabled: true,
    icon: "Home",
    isActive: true,
    requiredFields: [
      {
        id: "currentRoom",
        label: "Current Hostel & Room",
        type: "text",
        placeholder: "Maple Hall, Room 412",
        required: true,
      },
      {
        id: "targetHostelPreference",
        label: "Preferred Building",
        type: "select",
        required: true,
        options: ["Cedar Hall (Quiet Study Wing)", "Oak Hall (Graduate Block)", "Maple Hall (Ground Floor Accessible)", "Pine Hall"],
      },
      {
        id: "justification",
        label: "Reason for Relocation",
        type: "textarea",
        placeholder: "Explain medical conditions, sleep schedules, or study needs...",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-late-gate-pass",
    name: "Special Academic Late-Night Gate Pass",
    code: "HRL-PAS",
    description: "Pre-approved late campus return pass for robotics competitions, astronomical observatories, or hackathons.",
    departmentId: "dept-hostel",
    departmentName: "Hostel & Residential Life",
    category: "Hostel & Living",
    defaultPriority: "urgent",
    slaHours: 12,
    autoAssignEnabled: true,
    icon: "KeyRound",
    isActive: true,
    requiredFields: [
      {
        id: "dateOfLateReturn",
        label: "Date of Late Return",
        type: "date",
        required: true,
      },
      {
        id: "expectedReturnHour",
        label: "Expected Gate Arrival Time",
        type: "select",
        required: true,
        options: ["23:30 (11:30 PM)", "01:00 (01:00 AM)", "03:00 (03:00 AM)", "Overnight Lab Stay"],
      },
      {
        id: "labSupervisorContact",
        label: "Supervising Faculty Email / Contact",
        type: "text",
        placeholder: "dr.turner@campusdesk.edu",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
];

export const SEED_USERS: UserProfile[] = [
  {
    uid: "user-admin",
    email: "admin@campusdesk.edu",
    displayName: "Dr. Arthur Vance",
    role: "admin",
    departmentId: "dept-registrar",
    departmentName: "Office of the Registrar",
    phone: "+1 (555) 019-2831",
    isActive: true,
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-10T09:00:00Z",
    emailNotifications: {
      onRequestCreated: true,
      onStatusChanged: true,
      onCommentAdded: true,
      onEscalated: true,
      onCompleted: true,
    },
  },
  {
    uid: "user-staff-cse",
    email: "staff.cse@campusdesk.edu",
    displayName: "Prof. Elena Rostova",
    role: "staff",
    departmentId: "dept-cse",
    departmentName: "Department of Computer Science & Eng.",
    phone: "+1 (555) 018-9944",
    isActive: true,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    emailNotifications: {
      onRequestCreated: true,
      onStatusChanged: true,
      onCommentAdded: true,
      onEscalated: true,
      onCompleted: true,
    },
  },
  {
    uid: "user-staff-fac",
    email: "staff.facilities@campusdesk.edu",
    displayName: "Marcus Sterling",
    role: "staff",
    departmentId: "dept-facilities",
    departmentName: "Campus Facilities & Estate",
    phone: "+1 (555) 017-3312",
    isActive: true,
    createdAt: "2025-01-20T11:00:00Z",
    updatedAt: "2025-01-20T11:00:00Z",
    emailNotifications: {
      onRequestCreated: true,
      onStatusChanged: true,
      onCommentAdded: true,
      onEscalated: true,
      onCompleted: true,
    },
  },
  {
    uid: "user-student",
    email: "student@campusdesk.edu",
    displayName: "Aria Chen",
    role: "student",
    rollNumber: "CS-2023-0491",
    departmentId: "dept-cse",
    departmentName: "Department of Computer Science & Eng.",
    year: "3rd Year (Junior)",
    phone: "+1 (555) 012-7840",
    isActive: true,
    createdAt: "2025-02-01T14:00:00Z",
    updatedAt: "2025-02-01T14:00:00Z",
    emailNotifications: {
      onRequestCreated: true,
      onStatusChanged: true,
      onCommentAdded: true,
      onEscalated: true,
      onCompleted: true,
    },
  },
];

export const SEED_ANNOUNCEMENTS: CampusAnnouncement[] = [
  {
    id: "ann-1",
    title: "High Performance Computing Cluster Maintenance",
    content: "Scheduled kernel upgrade on the Turing A100 GPU cluster this Friday, 22:00 to Saturday 06:00. Running jobs will be checkpointed.",
    level: "warning",
    active: true,
    createdAt: "2026-10-04T09:00:00Z",
    createdBy: "Prof. Elena Rostova",
  },
  {
    id: "ann-2",
    title: "Fall 2026 Official Transcript Processing Deadlines",
    content: "International graduate school applications priority batch window closes October 25. Submit official transcript requests early.",
    level: "info",
    active: true,
    createdAt: "2026-10-02T11:00:00Z",
    createdBy: "Dr. Arthur Vance",
  },
];

// Helper to generate 40 realistic sample requests with dates spread over the last 30 days
export function generateSeedRequests(): {
  requests: ServiceRequest[];
  eventsMap: Record<string, TimelineEvent[]>;
  commentsMap: Record<string, RequestComment[]>;
} {
  const requests: ServiceRequest[] = [];
  const eventsMap: Record<string, TimelineEvent[]> = {};
  const commentsMap: Record<string, RequestComment[]> = {};

  const now = new Date("2026-10-06T10:00:00Z").getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;

  const sampleTitles = [
    { srv: SEED_SERVICES[0], desc: "Need 2 hard copies for University of Cambridge MPhil application.", p: "normal" as const },
    { srv: SEED_SERVICES[1], desc: "Applying for H-1B education loan renewal at Bank of America.", p: "low" as const },
    { srv: SEED_SERVICES[2], desc: "Fine-tuning 70B vision transformer for autonomous quadcopter perception thesis.", p: "high" as const },
    { srv: SEED_SERVICES[3], desc: "Need 1GHz Tektronix Scope for senior design embedded telemetry bench testing.", p: "normal" as const },
    { srv: SEED_SERVICES[4], desc: "Registering robotics telemetry gateway MAC address: 4A:9B:CD:12:34:56.", p: "normal" as const },
    { srv: SEED_SERVICES[5], desc: "Room 304 HVAC compressor making rattling sound and blowing warm air.", p: "urgent" as const },
    { srv: SEED_SERVICES[6], desc: "2nd floor Cedar washroom faucet has slow steady leak under basin.", p: "normal" as const },
    { srv: SEED_SERVICES[7], desc: "Smart card chip broke during library turnstile tap this morning.", p: "normal" as const },
    { srv: SEED_SERVICES[8], desc: "Severe bronchitis diagnosed by Dr. Patel. Missed Monday Algorithms lecture.", p: "normal" as const },
    { srv: SEED_SERVICES[9], desc: "Requesting inter-library physical loan for IEEE Transactions on Robotics Vol 40.", p: "low" as const },
    { srv: SEED_SERVICES[10], desc: "Requesting transfer from Oak to Cedar quiet study floor for thesis drafting.", p: "normal" as const },
    { srv: SEED_SERVICES[11], desc: "Overnight laboratory pass for MIT Battlecode hackathon qualifiers.", p: "urgent" as const },
  ];

  const studentPool = [
    { id: "user-student", name: "Aria Chen", email: "student@campusdesk.edu", roll: "CS-2023-0491" },
    { id: "user-st-2", name: "Liam Vance", email: "l.vance@campusdesk.edu", roll: "ME-2024-1102" },
    { id: "user-st-3", name: "Priya Sharma", email: "p.sharma@campusdesk.edu", roll: "CS-2023-0820" },
    { id: "user-st-4", name: "Mateo Rodriguez", email: "m.rodriguez@campusdesk.edu", roll: "EE-2022-0314" },
    { id: "user-st-5", name: "Zoe Al-Mansoor", email: "z.almansoor@campusdesk.edu", roll: "BIO-2024-0091" },
  ];

  for (let i = 1; i <= 40; i++) {
    const template = sampleTitles[(i - 1) % sampleTitles.length];
    const student = studentPool[(i - 1) % studentPool.length];
    const ticketId = `CD-2026-${String(i).padStart(5, "0")}`;
    const id = `req-${i}`;

    // Stagger dates across last 25 days
    const daysAgo = Math.floor((40 - i) * 0.6);
    const createdTimestamp = now - daysAgo * dayMs - (i * 37 * 60 * 1000);
    const createdAt = new Date(createdTimestamp).toISOString();

    const slaHours = template.srv.slaHours;
    const priorityMultiplier = template.p === "urgent" ? 0.5 : template.p === "high" ? 0.75 : 1.0;
    const effectiveHours = Math.round(slaHours * priorityMultiplier);
    const estimatedCompletionAt = new Date(createdTimestamp + effectiveHours * hourMs).toISOString();

    let status: ServiceRequest["status"] = "in_progress";
    let assignedToId: string | undefined = "user-staff-cse";
    let assignedToName: string | undefined = "Prof. Elena Rostova";
    let assignedToEmail: string | undefined = "staff.cse@campusdesk.edu";
    let completedAt: string | undefined = undefined;
    let rating: ServiceRequest["rating"] = undefined;
    let isOverdue = false;
    let escalated = false;

    if (template.srv.departmentId === "dept-facilities") {
      assignedToId = "user-staff-fac";
      assignedToName = "Marcus Sterling";
      assignedToEmail = "staff.facilities@campusdesk.edu";
    }

    if (i <= 6) {
      status = "pending";
      assignedToId = undefined;
      assignedToName = undefined;
      assignedToEmail = undefined;
    } else if (i <= 14) {
      status = "assigned";
    } else if (i <= 26) {
      status = "in_progress";
      // Let ticket 23 & 25 be overdue & escalated for demo
      if (i === 23 || i === 25) {
        isOverdue = true;
        escalated = true;
      }
    } else if (i <= 35) {
      status = "completed";
      completedAt = new Date(createdTimestamp + (effectiveHours * 0.8) * hourMs).toISOString();
      if (i % 2 === 0) {
        rating = {
          score: 5,
          comment: "Fulfilled promptly before deadline, very clean process.",
          createdAt: new Date(createdTimestamp + (effectiveHours * 0.85) * hourMs).toISOString(),
        };
      } else {
        rating = {
          score: 4,
          comment: "Good turnaround, thank you.",
          createdAt: new Date(createdTimestamp + (effectiveHours * 0.85) * hourMs).toISOString(),
        };
      }
    } else if (i <= 38) {
      status = "rejected";
      completedAt = new Date(createdTimestamp + 6 * hourMs).toISOString();
    } else {
      status = "reopened";
      isOverdue = false;
    }

    const req: ServiceRequest = {
      id,
      ticketId,
      serviceId: template.srv.id,
      serviceName: template.srv.name,
      serviceCategory: template.srv.category,
      departmentId: template.srv.departmentId,
      departmentName: template.srv.departmentName,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentRollNumber: student.roll,
      assignedToId,
      assignedToName,
      assignedToEmail,
      status,
      priority: template.p,
      description: template.desc,
      customData: {
        note: `Applicant submission reference #${1000 + i}`,
      },
      attachmentUrl: i % 4 === 0 ? "https://campusdesk.edu/docs/sample-spec.pdf" : undefined,
      estimatedCompletionAt,
      isOverdue,
      escalated,
      escalatedAt: escalated ? new Date(createdTimestamp + effectiveHours * hourMs).toISOString() : undefined,
      rating,
      createdAt,
      updatedAt: completedAt || createdAt,
      completedAt,
    };

    requests.push(req);

    // Build timeline events
    const events: TimelineEvent[] = [
      {
        id: `ev-${id}-1`,
        type: "created",
        title: "Request Submitted",
        description: `Submitted by ${student.name} with ${template.p.toUpperCase()} priority`,
        actorId: student.id,
        actorName: student.name,
        actorRole: "student",
        createdAt,
      },
    ];

    if (assignedToId) {
      const assignedTime = new Date(createdTimestamp + 2 * hourMs).toISOString();
      events.push({
        id: `ev-${id}-2`,
        type: "assigned",
        title: "Assigned to Specialist",
        description: `Routed to ${assignedToName} (${template.srv.departmentName})`,
        actorId: "system",
        actorName: "Auto-Assignment Engine",
        actorRole: "system",
        createdAt: assignedTime,
      });
    }

    if (status === "in_progress" || status === "completed" || status === "reopened") {
      const inProgTime = new Date(createdTimestamp + 5 * hourMs).toISOString();
      events.push({
        id: `ev-${id}-3`,
        type: "status_changed",
        title: "Work Initiated",
        description: "Department specialist began processing verification checks",
        actorId: assignedToId || "user-staff-cse",
        actorName: assignedToName || "Department Staff",
        actorRole: "staff",
        createdAt: inProgTime,
      });
    }

    if (escalated) {
      events.push({
        id: `ev-${id}-esc`,
        type: "escalated",
        title: "Auto-Escalated (SLA Breach)",
        description: "Target SLA elapsed. Bumped priority to Urgent and notified Department Head.",
        actorId: "system",
        actorName: "SLA Sentinel",
        actorRole: "system",
        createdAt: req.escalatedAt || createdAt,
      });
    }

    if (status === "completed") {
      events.push({
        id: `ev-${id}-4`,
        type: "completed",
        title: "Request Fulfilled",
        description: "Resolution confirmed and student notified.",
        actorId: assignedToId || "user-staff-cse",
        actorName: assignedToName || "Department Staff",
        actorRole: "staff",
        createdAt: completedAt || createdAt,
      });
      if (rating) {
        events.push({
          id: `ev-${id}-5`,
          type: "feedback_submitted",
          title: "Feedback Received",
          description: `Student submitted ${rating.score}/5 stars: "${rating.comment}"`,
          actorId: student.id,
          actorName: student.name,
          actorRole: "student",
          createdAt: rating.createdAt,
        });
      }
    }

    if (status === "reopened") {
      events.push({
        id: `ev-${id}-reopen`,
        type: "reopened",
        title: "Request Reopened",
        description: "Student requested additional clarification within 7 days of closure.",
        actorId: student.id,
        actorName: student.name,
        actorRole: "student",
        createdAt: new Date(now - 1 * hourMs).toISOString(),
      });
    }

    eventsMap[id] = events;

    // Comments & internal notes
    const comments: RequestComment[] = [];
    if (i % 2 === 0) {
      comments.push({
        id: `cm-${id}-1`,
        authorId: student.id,
        authorName: student.name,
        authorRole: "student",
        isInternal: false,
        content: "Please note that I will be available at the lab between 2 PM and 4 PM today.",
        createdAt: new Date(createdTimestamp + 3 * hourMs).toISOString(),
      });
    }
    if (assignedToId) {
      comments.push({
        id: `cm-${id}-2`,
        authorId: assignedToId,
        authorName: assignedToName || "Staff",
        authorRole: "staff",
        isInternal: true,
        content: `[Internal Note] Verified university registry database record for roll ${student.roll}. Hardware inventory allocated.`,
        createdAt: new Date(createdTimestamp + 4 * hourMs).toISOString(),
      });
      comments.push({
        id: `cm-${id}-3`,
        authorId: assignedToId,
        authorName: assignedToName || "Staff",
        authorRole: "staff",
        isInternal: false,
        content: "Your request is currently being processed. You will receive an email confirmation once completed.",
        createdAt: new Date(createdTimestamp + 4.5 * hourMs).toISOString(),
      });
    }
    commentsMap[id] = comments;
  }

  return { requests, eventsMap, commentsMap };
}
