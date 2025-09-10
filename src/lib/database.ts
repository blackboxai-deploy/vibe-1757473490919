import { Student, User, Course, AttendanceRecord, Grade } from './types';

// Mock data for demonstration
export const PROGRAMS = [
  'Cosmetology',
  'Nail Technology',
  'Esthetics',
  'Barbering',
  'Hair Styling',
  'Makeup Artistry'
];

export const LOCATIONS = [
  { value: 'main-campus', label: 'Main Campus' },
  { value: 'lab-1', label: 'Lab 1' },
  { value: 'lab-2', label: 'Lab 2' }
];

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'cosmetology_users',
  STUDENTS: 'cosmetology_students',
  COURSES: 'cosmetology_courses',
  ATTENDANCE: 'cosmetology_attendance',
  GRADES: 'cosmetology_grades',
  ENROLLMENTS: 'cosmetology_enrollments',
  CURRENT_USER: 'cosmetology_current_user'
};

// Database Operations
export class Database {
  // User Management
  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : this.getDefaultUsers();
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Student Management
  static getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : this.getDefaultStudents();
  }

  static saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  static getStudentById(id: string): Student | undefined {
    const students = this.getStudents();
    return students.find(student => student.id === id);
  }

  // Attendance Management
  static getAttendanceRecords(): AttendanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  }

  static saveAttendanceRecords(records: AttendanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }

  // Grade Management
  static getGrades(): Grade[] {
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : this.getDefaultGrades();
  }

  static saveGrades(grades: Grade[]): void {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }

  // Courses Management
  static getCourses(): Course[] {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : this.getDefaultCourses();
  }

  // Initialize default data
  static getDefaultUsers(): User[] {
    const users = [
      {
        id: 'admin-1',
        email: 'admin@cosmetologyschool.com',
        name: 'School Administrator',
        role: 'admin' as const,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'student-1',
        email: 'sarah.johnson@email.com',
        name: 'Sarah Johnson',
        role: 'student' as const,
        createdAt: new Date('2024-02-15')
      },
      {
        id: 'student-2',
        email: 'mike.chen@email.com',
        name: 'Mike Chen',
        role: 'student' as const,
        createdAt: new Date('2024-03-01')
      }
    ];
    this.saveUsers(users);
    return users;
  }

  static getDefaultStudents(): Student[] {
    const students = [
      {
        id: 'student-1',
        userId: 'student-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        dateOfBirth: new Date('1995-06-15'),
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        },
        emergencyContact: {
          name: 'John Johnson',
          phone: '(555) 765-4321',
          relationship: 'Father'
        },
        enrollmentDate: new Date('2024-02-15'),
        program: 'Cosmetology',
        status: 'active' as const,
        totalHoursRequired: 1600,
        hoursCompleted: 850,
        gpa: 3.8
      },
      {
        id: 'student-2',
        userId: 'student-2',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@email.com',
        phone: '(555) 987-6543',
        dateOfBirth: new Date('1992-03-22'),
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zipCode: '67890'
        },
        emergencyContact: {
          name: 'Lisa Chen',
          phone: '(555) 456-7890',
          relationship: 'Spouse'
        },
        enrollmentDate: new Date('2024-03-01'),
        program: 'Barbering',
        status: 'active' as const,
        totalHoursRequired: 1200,
        hoursCompleted: 450,
        gpa: 3.6
      }
    ];
    this.saveStudents(students);
    return students;
  }

  static getDefaultCourses(): Course[] {
    return [
      {
        id: 'course-1',
        code: 'COS-101',
        name: 'Fundamentals of Cosmetology',
        description: 'Introduction to basic cosmetology principles',
        credits: 3,
        hoursRequired: 200,
        instructor: 'Ms. Williams',
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '09:00',
          endTime: '12:00'
        },
        program: 'Cosmetology'
      },
      {
        id: 'course-2',
        code: 'BARB-201',
        name: 'Advanced Barbering Techniques',
        description: 'Professional barbering skills and techniques',
        credits: 4,
        hoursRequired: 150,
        instructor: 'Mr. Rodriguez',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          startTime: '13:00',
          endTime: '17:00'
        },
        program: 'Barbering'
      }
    ];
  }

  static getDefaultGrades(): Grade[] {
    return [
      {
        id: 'grade-1',
        studentId: 'student-1',
        courseId: 'course-1',
        assessmentType: 'exam',
        assessmentName: 'Midterm Exam',
        score: 92,
        maxScore: 100,
        dateGraded: new Date('2024-10-15'),
        instructor: 'Ms. Williams',
        comments: 'Excellent understanding of fundamental concepts'
      },
      {
        id: 'grade-2',
        studentId: 'student-2',
        courseId: 'course-2',
        assessmentType: 'practical',
        assessmentName: 'Hair Cutting Practical',
        score: 88,
        maxScore: 100,
        dateGraded: new Date('2024-11-01'),
        instructor: 'Mr. Rodriguez',
        comments: 'Good technique, needs practice on precision'
      }
    ];
  }
}