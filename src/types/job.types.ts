import type { Application } from "./application.types";

export type JobType = "Internship" | "PartTime" | "FullTime" | "Contract"

export type Role = "STUDENT" | "COORDINATOR" | "COMPANY"

export type Branch = 'CSE' | 'CY' | 'IT' | 'ME' | 'ECE' | 'EIC' | 'EE' | 'CE';

export type JobStatus = "ACTIVE" | "CLOSED" | "DRAFT"
export interface Job {
    id?: string
    type: JobType
    title: string
    description: string
    location: string
    position: string
    salary: number
    cgpaCutOff: number
    deadline: string
    status: JobStatus
    branchCutOff: Branch[]
    yearCutOff: string[]

    companyId?: string
    company?: {
        id?: string;
        name: string;
        industry: string;
        website: string;
      };
    
    applications?: Application[]

      createdAt?: string;
      updatedAt?: string;
}













