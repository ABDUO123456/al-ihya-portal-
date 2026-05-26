import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';
import ParentOverview from './parent/ParentOverview';
import ActivityFeed from './parent/ActivityFeed';
import AttendanceCalendar from './parent/AttendanceCalendar';
import { ChevronDown, User } from 'lucide-react';
import { mockStudents } from '../utils/mockData';

const ParentPortal = () => {
  const parentStudents = mockStudents.filter(s => s.parentPhone === '0660112233');
  const [activeChild, setActiveChild] = useState(parentStudents[0] || null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  if (!activeChild) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center text-gray-500 mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">لا يوجد طلاب مسجلون</h2>
          <p className="text-gray-500 max-w-md">لم يتم العثور على أي طلاب مرتبطين بهذا الرقم. يرجى التواصل مع إدارة المدرسة لتفعيل حسابك.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-3 bg-surface-light/50 border border-white/10 px-6 py-3 rounded-2xl hover:bg-surface-light transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">عرض ملف الطالب:</p>
              <p className="font-bold">{activeChild.name}</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSwitcherOpen && parentStudents.length > 1 && (
            <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] glass-card p-2 z-30 shadow-2xl">
              {parentStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => { setActiveChild(student); setIsSwitcherOpen(false); }}
                  className={`w-full text-right p-3 rounded-xl transition-all ${activeChild.id === student.id ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}`}
                >
                  <p className="font-bold">{student.name}</p>
                  <p className="text-[10px] opacity-60">حلقة الفجر</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald rounded-full" />
            <span className="text-xs font-bold">الحالة: {activeChild.status === 'active' ? 'نشط' : 'موقف'}</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-xs font-bold">الحلقة: {activeChild.halaqaId}</span>
          </div>
        </div>
      </div>

      <Routes>
        <Route index element={<ParentOverview child={activeChild} />} />
        <Route path="activity" element={<ActivityFeed child={activeChild} />} />
        <Route path="calendar" element={<AttendanceCalendar child={activeChild} />} />
      </Routes>
    </Layout>
  );
};

export default ParentPortal;
