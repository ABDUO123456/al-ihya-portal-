import { Student, Teacher, AttendanceRecord, ProgressRecord, Announcement, FinancialRecord } from '../types';

// مفاتيح التخزين في localStorage
const STORAGE_KEYS = {
  STUDENTS: 'al_ihya_students',
  TEACHERS: 'al_ihya_teachers',
  HALAQAT: 'al_ihya_halaqat',
  ATTENDANCE: 'al_ihya_attendance',
  PROGRESS: 'al_ihya_progress',
  ANNOUNCEMENTS: 'al_ihya_announcements',
  FINANCIAL: 'al_ihya_financial',
  INITIALIZED: 'al_ihya_initialized', // مفتاح جديد لتتبع ما إذا تم تهيئة البيانات مسبقاً
};

class DBService {
  private initData() {
    // التحقق مما إذا كان قد تم مسح البيانات مسبقاً لهذا التحديث
    const WIPE_KEY = 'al_ihya_data_wiped_2024';
    if (!localStorage.getItem(WIPE_KEY)) {
      localStorage.clear();
      localStorage.setItem(WIPE_KEY, 'true');
    }

    // التأكد من تهيئة المصفوفات كجداول فارغة
    const keys = Object.values(STORAGE_KEYS).filter(k => k !== STORAGE_KEYS.INITIALIZED);
    
    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  constructor() {
    this.initData();
  }

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return this.get<Teacher>(STORAGE_KEYS.TEACHERS);
  }

  async addTeacher(teacher: Teacher): Promise<void> {
    const teachers = await this.getTeachers();
    teachers.push(teacher);
    this.save(STORAGE_KEYS.TEACHERS, teachers);
  }

  // Helper to get data
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Helper to save data
  private save<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return this.get<Student>(STORAGE_KEYS.STUDENTS);
  }

  async addStudent(student: Student): Promise<void> {
    const students = await this.getStudents();
    students.push(student);
    this.save(STORAGE_KEYS.STUDENTS, students);
  }

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    return this.get<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE);
  }

  async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    const attendance = await this.getAttendance();
    // تحديث السجلات الموجودة أو إضافة جديدة
    const newAttendance = [...attendance];
    records.forEach(record => {
      const index = newAttendance.findIndex(r => r.studentId === record.studentId && r.date === record.date);
      if (index !== -1) {
        newAttendance[index] = record;
      } else {
        newAttendance.push(record);
      }
    });
    this.save(STORAGE_KEYS.ATTENDANCE, newAttendance);
  }

  // Progress
  async getProgress(): Promise<ProgressRecord[]> {
    return this.get<ProgressRecord>(STORAGE_KEYS.PROGRESS);
  }

  async saveProgress(record: ProgressRecord): Promise<void> {
    const progress = await this.getProgress();
    progress.push(record);
    this.save(STORAGE_KEYS.PROGRESS, progress);
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.get<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS);
  }

  async addAnnouncement(announcement: Announcement): Promise<void> {
    const announcements = await this.getAnnouncements();
    announcements.unshift(announcement);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  // Financial
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    return this.get<FinancialRecord>(STORAGE_KEYS.FINANCIAL);
  }

  async addFinancialRecord(record: FinancialRecord): Promise<void> {
    const records = await this.getFinancialRecords();
    records.push(record);
    this.save(STORAGE_KEYS.FINANCIAL, records);
  }
}

export const db = new DBService();
