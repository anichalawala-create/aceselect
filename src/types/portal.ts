export type ProjectStatus = "ON TRACK" | "IN PROGRESS" | "DELAYED" | "COMPLETED";

export type SiteStatus = "Completed" | "In Progress" | "Pending" | "Delayed";

export type ApprovalStatus = "PENDING" | "APPROVED" | "CHANGES_REQUESTED";

export interface TimelineStage {
  id: string;
  name: "Discover" | "Design" | "Produce" | "Deploy" | "Inspect" | "Deliver";
  status: "completed" | "current" | "pending";
  date?: string;
  description?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  initials: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  avatarUrl?: string;
  unreadNotifications: number;
}

export interface Project {
  id: string; // e.g. "ACE-2026-014"
  slug: string;
  title: string;
  client: string;
  category: string;
  sitesCount: number;
  completedSites: number;
  inProgressSites: number;
  pendingSites: number;
  delayedSites: number;
  progress: number;
  status: ProjectStatus;
  thumbnail: string;
  startDate: string;
  targetDate: string;
  budget: string;
  projectManager: string;
  description: string;
  timeline: TimelineStage[];
}

export interface SiteMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface SitePhoto {
  id: string;
  title: string;
  caption: string;
  url: string;
  category: "Survey" | "Production" | "Installation" | "Final QC";
  timestamp: string;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  projectId: string;
  projectName: string;
  city: string;
  state: string;
  address: string;
  status: SiteStatus;
  progress: number;
  assignedTeam: string;
  leadEngineer: string;
  lastUpdate: string;
  surveyDate: string;
  productionDate: string;
  dispatchDate: string;
  installationTarget: string;
  inspectionDate: string;
  targetTATDays: number;
  elapsedDays: number;
  milestones: SiteMilestone[];
  photos: SitePhoto[];
  recentUpdates: string[];
}

export interface ApprovalItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  type: string;
  submittedDate: string;
  status: ApprovalStatus;
  thumbnail: string;
  description: string;
  submittedBy: string;
  specs?: { label: string; value: string }[];
  comments?: { author: string; role: string; date: string; message: string }[];
  file?: string;
  images?: string[];
}

export interface ProjectUpdate {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  timestamp: string;
  type: "inspection" | "approval" | "production" | "survey" | "delivery";
  projectId?: string;
  siteId?: string;
  author?: string;
  details?: string;
  photos?: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Reports" | "Site Photos" | "Drawings & BOQ" | "Drawings" | "Invoices" | "Guidelines";
  projectId: string;
  projectName: string;
  fileType: "PDF" | "DWG" | "XLSX" | "ZIP" | "PNG";
  fileSize: string;
  uploadedDate: string;
  downloadUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photo: string;
  experience: string;
  availableHours: string;
}

export interface DashboardStats {
  activeProjects: number;
  activeSites: number;
  pendingApprovals: number;
  completedSites: number;
  totalSites: number;
  sitesBreakdown: {
    completed: number;
    inProgress: number;
    pending: number;
    delayed: number;
  };
}
