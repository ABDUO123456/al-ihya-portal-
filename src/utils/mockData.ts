import { User, Teacher, Student, Halaqa, Announcement } from '../types';

export const mockTeachers: Teacher[] = [];

export const mockHalaqat: Halaqa[] = [];

export const mockStudents: Student[] = [];

export const mockAnnouncements: Announcement[] = [];

export const mockAdmin: User = {
  id: 'admin1',
  name: 'المدير العام',
  phone: '0550000000',
  role: 'admin'
};

export const mockParent: User = {
  id: 'p1',
  name: 'خالد محمد',
  phone: '0660112233',
  role: 'parent'
};
 

