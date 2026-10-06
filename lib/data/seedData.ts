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
    name: "Official Grade Sheet / Transcript",
    code: "REG-TRS",
    description: "Official stamped copy of your marks and grades. Needed for graduate school, jobs, or visa applications.",
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
        label: "Number of Copies Needed",
        type: "number",
        placeholder: "1",
        required: true,
        defaultValue: 1,
        helpText: "How many printed copies you need.",
      },
      {
        id: "dispatchMethod",
        label: "How would you like to receive it?",
        type: "select",
        required: true,
        options: ["Pick up at office counter", "Mail to my address", "Digital PDF via email"],
        helpText: "Select how you want to get your document.",
      },
      {
        id: "recipientInstitution",
        label: "Who is this for?",
        type: "text",
        placeholder: "e.g., Stanford University, Company Name, or Visa Office",
        required: true,
      },
    ],
    faq: [
      {
        question: "How long does it take to prepare?",
        answer: "Usually 48 hours (2 business days). During exam weeks, it might take 1 extra day.",
      },
      {
        question: "Can a friend pick it up for me?",
        answer: "Yes, if they bring a note signed by you and a copy of your student ID.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-bonafide-letter",
    name: "Student Proof Certificate (Bonafide)",
    code: "REG-BON",
    description: "An official letter proving you are an enrolled student here. Needed for passports, bank loans, bus passes, or internships.",
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
        label: "What do you need this letter for?",
        type: "select",
        required: true,
        options: [
          "Passport Application / Renewal",
          "Student Bank Loan",
          "Hostel / Rental / Bus Pass Proof",
          "Travel Visa Application",
          "Internship or Job Application"
        ],
      },
      {
        id: "addressedTo",
        label: "Name of Organization or Officer (Optional)",
        type: "text",
        placeholder: "e.g., Regional Passport Officer / Bank Branch Manager",
        required: false,
      },
    ],
    faq: [
      {
        question: "Can I download this online?",
        answer: "Yes! Once approved, you can download a digitally stamped certificate directly from your dashboard.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-gpu-cluster",
    name: "AI & Supercomputer Access",
    code: "CSE-GPU",
    description: "Book time on the college's powerful AI computers (NVIDIA GPUs) for machine learning, heavy coding, or research projects.",
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
        label: "Faculty Guide / Professor Name",
        type: "text",
        placeholder: "e.g., Prof. Elena Rostova",
        required: true,
      },
      {
        id: "requestedHours",
        label: "Hours of Computer Time Needed",
        type: "number",
        placeholder: "24",
        required: true,
        helpText: "Requests over 100 hours require department head approval.",
      },
      {
        id: "frameworkStack",
        label: "Software or Framework You Will Use",
        type: "select",
        required: true,
        options: ["PyTorch (Machine Learning)", "TensorFlow", "JAX / Flax", "Other Custom Tools"],
      },
      {
        id: "projectAbstract",
        label: "Short Description of Your Project",
        type: "textarea",
        placeholder: "Explain what your program does and why you need high-power computers...",
        required: true,
      },
    ],
    faq: [
      {
        question: "How long can my program run?",
        answer: "Standard jobs can run continuously for up to 48 hours.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-lab-equipment",
    name: "Borrow Lab Gear & Testing Tools",
    code: "CSE-LAB",
    description: "Borrow hardware kits, circuit boards, testing meters (oscilloscopes), and sensors for your coursework or engineering projects.",
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
        label: "What tool or device do you need?",
        type: "select",
        required: true,
        options: [
          "Digital Oscilloscope (Testing Meter)",
          "FPGA Circuit Board",
          "Signal / Spectrum Analyzer",
          "Robotics & Sensor Kit"
        ],
      },
      {
        id: "returnDate",
        label: "When will you return it?",
        type: "date",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-wifi-network",
    name: "Campus Wi-Fi & Internet Help",
    code: "CSE-NET",
    description: "Connect a new laptop, phone, or smart device to the campus Wi-Fi network, or report slow internet and weak Wi-Fi signal.",
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
        label: "Device Wi-Fi Address (MAC Address)",
        type: "text",
        placeholder: "e.g., 00:1A:2B:3C:4D:5E (found in phone/laptop Wi-Fi settings)",
        required: true,
      },
      {
        id: "hostelOrBlock",
        label: "Where are you located?",
        type: "text",
        placeholder: "e.g., Cedar Hall, Room 314, or Library 2nd Floor",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-hvac-maintenance",
    name: "Room Electrical, Fan & AC Repair",
    code: "FAC-ELE",
    description: "Report broken lights, ceiling fans, power plugs, air conditioning, or sudden electricity outages in your hostel room.",
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
        label: "Hostel Building & Room Number",
        type: "text",
        placeholder: "e.g., Cedar Hall, Room 208",
        required: true,
      },
      {
        id: "issueType",
        label: "What is the problem?",
        type: "select",
        required: true,
        options: [
          "AC not cooling or leaking water",
          "No electricity in room",
          "Broken socket / sparks",
          "Ceiling fan not working or very noisy"
        ],
      },
      {
        id: "availabilityTime",
        label: "When can an electrician visit?",
        type: "select",
        required: true,
        options: [
          "Right now (Urgent)",
          "Morning (09:00 AM - 12:00 PM)",
          "Afternoon (02:00 PM - 05:00 PM)",
          "Evening (05:00 PM - 07:00 PM)"
        ],
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-plumbing",
    name: "Bathroom Plumbing & Water Leak Fix",
    code: "FAC-PLU",
    description: "Get help for leaking taps, clogged sinks or drains, low water pressure, or hot water geyser problems in your hostel.",
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
        label: "Hostel & Bathroom Location",
        type: "text",
        placeholder: "e.g., Cedar Block A, 2nd Floor Washroom",
        required: true,
      },
      {
        id: "leakSeverity",
        label: "How serious is it?",
        type: "select",
        required: true,
        options: ["Dripping tap / minor leak", "Clogged sink or shower drain", "Major water overflow / pipe leak"],
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-lost-id-card",
    name: "Replace Lost or Broken Student ID Card",
    code: "OSA-IDC",
    description: "Get a replacement student ID card if yours was lost, damaged, or stopped working. You will receive a temporary gate pass immediately.",
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
        label: "What happened to your card?",
        type: "select",
        required: true,
        options: [
          "Card broken / chip stopped scanning",
          "Lost somewhere on campus",
          "Lost outside campus"
        ],
      },
      {
        id: "reissueReason",
        label: "Additional Details (Optional)",
        type: "text",
        placeholder: "Brief note on when or where it was misplaced",
        required: false,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-medical-leave",
    name: "Sick Leave Attendance Excuse",
    code: "OSA-MED",
    description: "Submit a doctor's sick note so missed classes and labs are officially excused from your mandatory attendance record.",
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
        label: "First Day You Missed Class",
        type: "date",
        required: true,
      },
      {
        id: "endDate",
        label: "Last Day You Missed Class",
        type: "date",
        required: true,
      },
      {
        id: "doctorName",
        label: "Doctor or Clinic Name",
        type: "text",
        placeholder: "e.g., Campus Health Center or Dr. Smith",
        required: true,
      },
      {
        id: "medicalPrescriptionUrl",
        label: "Link to Doctor's Note or Medical Slip",
        type: "url",
        placeholder: "https://drive.google.com/file/d/...",
        required: true,
        helpText: "Paste a Google Drive or cloud link to a photo of your medical certificate.",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-inter-library-loan",
    name: "Request Books & Research Papers",
    code: "LIB-ILL",
    description: "Ask the college library to obtain paid research articles, rare books, or papers from partner university libraries.",
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
        label: "Article Link, DOI, or Book Number (ISBN)",
        type: "text",
        placeholder: "e.g., 10.1145/3290605.3300582 or web link",
        required: true,
      },
      {
        id: "itemTitle",
        label: "Title of Book or Article & Author",
        type: "text",
        placeholder: "e.g., Introduction to Algorithms by Cormen",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-hostel-room-change",
    name: "Change Hostel Room",
    code: "HRL-ROM",
    description: "Request to move to a different hostel room for health reasons, quiet study requirements, or accessibility needs.",
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
        label: "Your Current Hostel & Room",
        type: "text",
        placeholder: "e.g., Maple Hall, Room 412",
        required: true,
      },
      {
        id: "targetHostelPreference",
        label: "Where would you like to move?",
        type: "select",
        required: true,
        options: [
          "Cedar Hall (Quiet Study Wing)",
          "Oak Hall (Graduate Block)",
          "Maple Hall (Ground Floor Easy Access)",
          "Any open room"
        ],
      },
      {
        id: "justification",
        label: "Reason for Changing Rooms",
        type: "textarea",
        placeholder: "Explain your reason (medical needs, study environment, etc.)...",
        required: true,
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
  },
  {
    id: "srv-late-gate-pass",
    name: "Late-Night Campus Gate Permission",
    code: "HRL-PAS",
    description: "Get official permission to enter the campus gate after curfew hours if you are working late on competitions, lab research, or hackathons.",
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
        label: "Date You Will Be Returning Late",
        type: "date",
        required: true,
      },
      {
        id: "expectedReturnHour",
        label: "Expected Gate Arrival Time",
        type: "select",
        required: true,
        options: ["11:30 PM", "01:00 AM", "03:00 AM", "Staying overnight in lab"],
      },
      {
        id: "labSupervisorContact",
        label: "Professor or Lab In-Charge Email",
        type: "text",
        placeholder: "e.g., professor@campusdesk.edu",
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
