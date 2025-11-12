
export enum Perimeter {
  PERCEIVED_UTILITY = "Perceived Utility & Relevance",
  LEARNING_APPLICATION_FREQUENCY = "Learning Application & Frequency",
  PERFORMANCE_IMPROVEMENT = "Performance Improvement",
  MANAGER_SUPPORT = "Manager Support",
  PEER_SUPPORT = "Peer Support",
  WORKPLACE_ENABLERS = "Workplace Enablers & Barriers",
  STRATEGIC_THINKING = "Strategic Thinking",
  TEAM_LEADERSHIP = "Team Leadership & Motivation",
  CONFLICT_RESOLUTION = "Conflict Resolution",
}

export interface Question {
  id: string;
  text: string;
  answer: string | number;
  followUp?: {
    onAnswer: string | number;
    question: Question;
  };
}

export interface ProficiencyData {
  perimeter: Perimeter;
  score: number; // 1-5 scale
  questions: Question[];
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  training: string;
  proficiency: ProficiencyData[];
  managerId?: number;
  trainingEffectiveness?: number; // 1-5 scale rating for the training itself
  trainerName?: string;
}

export enum Status {
  GREEN = "Green",
  YELLOW = "Yellow",
  RED = "Red",
}

export interface Analysis {
  analysisTitle: string;
  message: string;
  rootCause: string | null;
  recommendations: {
    manager: string[];
    employee: string[];
    hr: string[];
  };
}

export interface TeamAnalysis {
  commonStrengths: {
    perimeter: string;
    insight: string;
  }[];
  commonGaps: {
    perimeter: string;
    insight: string;
  }[];
  teamRecommendations: string[];
}

export interface ActionStep {
  step: string;
  owner: 'Employee' | 'Manager' | 'HR';
  timeline: string;
  resources: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface ActionPlan {
  employeeId: number;
  goal: string;
  actionSteps: ActionStep[];
}

export type UserRole = 'Manager' | 'Employee' | 'HR' | 'Higher Management';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  employeeId?: number; // For Employee role
  managesIds?: number[]; // For Manager role
}