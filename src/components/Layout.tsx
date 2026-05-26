import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Wallet, 
  Megaphone, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Calendar,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  // Admin Items
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/admin', roles: ['admin'] },
  { icon: GraduationCap, label: 'تسجيل المعلمين', path: '/admin/teachers', roles: ['admin'] },
  { icon: Users, label: 'تسجيل الطلاب', path: '/admin/students', roles: ['admin'] },
  { icon: Wallet, label: 'المالية والاشتراكات', path: '/admin/finance', roles: ['admin'] },
  { icon: Megaphone, label: 'الإعلانات العامة', path: '/admin/announcements', roles: ['admin'] },
  
  // Teacher Items
  { icon: LayoutDashboard, label: 'لوحة المعلم', path: '/teacher', roles: ['teacher'] },
  { icon: Calendar, label: 'تسجيل الحضور', path: '/teacher/attendance', roles: ['teacher'] },
  { icon: BookOpen, label: 'سجل التسميع', path: '/teacher/progress', roles: ['teacher'] },
  { icon: AlertCircle, label: 'طلب غياب', path: '/teacher/absence', roles: ['teacher'] },

  // Parent Items
  { icon: LayoutDashboard, label: 'نظرة عامة', path: '/parent', roles: ['parent'] },
  { icon: BookOpen, label: 'سجل النشاط', path: '/parent/activity', roles: ['parent'] },
  { icon: Calendar, label: 'التقويم الدراسي', path: '/parent/calendar', roles: ['parent'] },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface/30 backdrop-blur-xl border-l border-white/5 p-6">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="text-background w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">الإحياء</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Quranic School</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_5px_15px_rgba(16,185,129,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl text-ruby/80 hover:text-ruby hover:bg-ruby/10 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Navbar */}
        <header className="h-20 bg-surface/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold lg:text-2xl text-white/90">
              {filteredItems.find(i => i.path === location.pathname)?.label || 'لوحة التحكم'}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-white/10">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-ruby rounded-full border-2 border-surface" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3 pr-2">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold leading-none mb-1 text-white/90">{user?.name}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'teacher' ? 'أستاذ الحلقة' : 'ولي أمر'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-light border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=10b981&fontFamily=Cairo`} 
                  alt="avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          {children}
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-surface z-50 p-6 flex flex-col lg:hidden"
              >
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <GraduationCap className="text-background w-5 h-5" />
                    </div>
                    <span className="font-bold">مدرسة الإحياء</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                          isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={logout}
                  className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl text-ruby hover:bg-ruby/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
