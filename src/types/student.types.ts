import type { Role } from "./auth.types";

export type Branch =
  | ("CSE" | "CY" | "IT" | "ME" | "ECE" | "EIC" | "EE" | "CE")
  | "";

export type Year = ("FIRST" | "SECOND" | "THIRD" | "FOURTH") | "";

export type VerificationType = "PENDING" | "APPROVED" | "REJECTED";

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  branch: Branch;
  year: Year;
  verificationStatus: VerificationType;
  verifiedProfile: boolean;
  cgpa: number;
  activeBacklog: boolean;
  backlogs: number;
  resumeUrl: string;
  description?: string;
}

export interface StudentVerification {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: Branch;
  year: Year;
  cgpa: number;
  activeBacklog: boolean;
  backlogs: number;
  resumeUrl: string;
  description?: string;
  verificationStatus: VerificationType;
  role: Role;
}
