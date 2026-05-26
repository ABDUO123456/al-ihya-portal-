export type Role = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  halaqaId?: string; // For teachers and students
  parentId?: string; // For students
}

export interface Teacher extends User {
  role: 'teacher';
  halaqaName: string;
  status: 'active' | 'suspended';
}

export interface Student {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  parentPhone: string;
  halaqaId: string;
  status: 'active' | 'pending' | 'suspended';
  idCardPhoto?: string;
  notes?: string;
}

export interface Halaqa {
  id: string;
  name: string;
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  arrivalTime?: string;
}

export interface ProgressRecord {
  id: string;
  studentId: string;
  date: string;
  memorization: {
    surah: string;
    startAyah: number;
    endAyah: number;
    rating: 1 | 2 | 3 | 4; // 1: Poor, 2: Fair, 3: Good, 4: Excellent
  };
  revision: {
    close: string;
    distant: string;
  };
  notes: string;
}

export interface TeacherAbsenceRequest {
  id: string;
  teacherId: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'holiday' | 'exam';
}

export interface FinancialRecord {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: 'subscription' | 'donation' | 'salary' | 'utilities' | 'other';
}
