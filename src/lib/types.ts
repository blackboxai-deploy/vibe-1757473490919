// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: Date;
  lastLogin?: Date;
}

// Student Information
export interface Student {
  id: string;
  userId: string; // Reference to User
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  enrollmentDate: Date;
  program: string;
  status: 'active' | 'graduated' | 'suspended' | 'withdrawn';
  totalHoursRequired: number;
  hoursCompleted: number;
  gpa: number;
  profileImage?: string;
}

// Course and Program Information
export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  hoursRequired: number;
  instructor: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  program: string;
}

// Enrollment Tracking
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'completed' | 'dropped';
  finalGrade?: number;
  hoursCompleted: number;
}

// Attendance Tracking
export interface AttendanceRecord {
  id: string;
  studentId: string;
  clockIn: Date;
  clockOut?: Date;
  hoursWorked: number;
  location: 'main-campus' | 'lab-1' | 'lab-2';
  notes?: string;
  approved: boolean;
}

// Grade Management
export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assessmentType: 'exam' | 'practical' | 'assignment' | 'quiz';
  assessmentName: string;
  score: number;
  maxScore: number;
  dateGraded: Date;
  instructor: string;
  comments?: string;
}

// Dashboard Analytics
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  totalHoursLogged: number;
  averageAttendance: number;
  completionRate: number;
}

// Filter and Search Types
export interface StudentFilters {
  status: string;
  program: string;
  searchTerm: string;
  sortBy: 'name' | 'enrollmentDate' | 'gpa' | 'hoursCompleted';
  sortOrder: 'asc' | 'desc';
}