
export interface Semester {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  semesterId: string;
  code: string;
  name: string;
  creditHours: number;
  classesPerWeek: number;
  instructor: string;
}

export type ClassStatus = 'scheduled' | 'completed' | 'replaced' | 'brought_forward';

export interface ClassSession {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ClassStatus;
  replacementDate?: string | null;
  replacementTime?: string | null;
}

export interface Student {
  id: string;
  courseId: string;
  name: string;
  indexNumber: string;
  email: string;
  phone: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string;
  date: string;
}

export interface AppData {
  semesters: Semester[];
  courses: Course[];
  classes: ClassSession[];
  students: Student[];
  attendance: AttendanceRecord[];
}
