import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { db } from '../services/dbService';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// المستخدم الافتراضي للنظام (Super Admin) - لا يمكن حذفه
const SYSTEM_ADMIN: User = {
  id: 'admin-system',
  name: 'المدير العام',
  phone: '0550000000',
  role: 'admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (phone: string, _password: string) => {
    // 1. التحقق من مدير النظام الثابت
    if (phone === '0550000000') {
      setUser(SYSTEM_ADMIN);
      localStorage.setItem('auth_user', JSON.stringify(SYSTEM_ADMIN));
      return;
    }

    // 2. البحث في قاعدة البيانات (المعلمون والطلاب/أولياء الأمور)
    const teachers = await db.getTeachers();
    const foundTeacher = teachers.find(t => t.phone === phone);
    
    if (foundTeacher) {
      setUser(foundTeacher);
      localStorage.setItem('auth_user', JSON.stringify(foundTeacher));
      return;
    }

    // يمكن إضافة منطق البحث عن أولياء الأمور هنا مستقبلاً
    
    throw new Error('رقم الهاتف غير مسجل في النظام');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
