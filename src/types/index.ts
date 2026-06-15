export type LicenseType = "driving" | "motorcycle" | "gun" | "boat" | "pilot";

export type Status = "active" | "pending" | "expired" | "none";

export interface License {
  id: string;
  type: LicenseType;
  name: string;
  status: Status;
  issuedAt?: string;
  expiresAt?: string;
  fee: number;
  requirements: string[];
}

export interface JobInfo {
  id: string;
  name: string;
  grade: string;
  salary: [number, number];
  icon: string; // lucide icon name
  description: string;
  requirements: string[];
}

export interface IDCard {
  citizenId: string;
  status: "active" | "pending" | "expired";
  issuedAt?: string;
  signature?: string;
}

export interface Player {
  serverId: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  photoUrl?: string;
  cash: number;
  bank: number;
  job: { id: string; name: string; grade: string; salary: number };
  idCard: IDCard;
}

export type ApplicationKind = "id" | "license" | "job";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: string;
  kind: ApplicationKind;
  target: string; // license type, job id, or 'id-card'
  label: string;
  status: ApplicationStatus;
  createdAt: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  kind: "info" | "success" | "warning" | "error";
  createdAt: string;
}

export type WarrantType = "arrest" | "search" | "bench";
export type WarrantStatus = "active" | "served" | "expired" | "revoked";

export interface Warrant {
  id: string;
  citizenId: string;
  citizenName: string;
  type: WarrantType;
  status: WarrantStatus;
  charges: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  notes?: string;
}

export type NUIAction =
  | "openMenu"
  | "closeMenu"
  | "setPlayerData"
  | "setLicenses"
  | "setApplications"
  | "setWarrants"
  | "notify";

export interface NUIMessage<T = unknown> {
  action: NUIAction;
  data?: T;
}

export type DMVStanding = "clean" | "warning" | "risk" | "suspended";

export interface Violation {
  id: string;
  name: string;
  points: number;
  date: string;
  location: string;
}

export interface DMVRecord {
  points: number;
  standing: DMVStanding;
  violations: Violation[];
  expiryDays: number;
  expiryDate: string;
}

export interface TheoryQuestion {
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
