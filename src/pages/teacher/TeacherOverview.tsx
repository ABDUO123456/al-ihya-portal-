import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/dbService';
import { Student } from '../../types';

const TeacherOverview = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const allStudents = await db.getStudents();
      setStudents(allStudents.filter(s => s.halaqaId === user?.halaqaId));
      setLoading(false);
    };
    fetchStudents();
  }, [user?.halaqaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-primary/10 to-transparent p-8 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-3xl font-bold mb-2">أهلاً بك، أستاذ {user?.name.split(' ')[0]}</h2>
          <p className="text-gray-400">حلقة: <span className="text-primary font-bold">حلقة الفجر</span> • اليوم: {new Date().toLocaleDateString('ar-DZ')}</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{students.length}</span>
            <span className="text-[10px] text-gray-500 uppercase">طالب في الحلقة</span>
          </div>
          <div className="glass-card px-6 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald">08:30</span>
            <span className="text-[10px] text-gray-500 uppercase">موعد الحلقة</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold px-2">المهام اليومية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-6 flex items-center gap-5 cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center group-hover:bg-emerald/20 transition-all">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg">تحضير الطلاب</h4>
                <p className="text-sm text-gray-500">تم تسجيل حضور 0/{students.length} طالب</p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-6 flex items-center gap-5 cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg">سجل التسميع</h4>
                <p className="text-sm text-gray-500">سجل تقدم طلابك لليوم</p>
              </div>
            </motion.div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6">جدول الحلقة اليوم</h3>
            <div className="space-y-4">
              {[
                { time: '08:30 - 09:00', task: 'مراجعة جماعية للأذكار', status: 'completed' },
                { time: '09:00 - 10:30', task: 'تسميع الحفظ الجديد', status: 'current' },
                { time: '10:30 - 11:30', task: 'مراجعة الأحزاب السابقة', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs font-bold text-gray-500 w-24">{item.time}</div>
                  <div className="h-8 w-[2px] bg-white/10" />
                  <div className={`flex-1 font-bold ${item.status === 'current' ? 'text-primary' : item.status === 'completed' ? 'text-gray-500 line-through' : ''}`}>
                    {item.task}
                  </div>
                  {item.status === 'current' && <div className="w-2 h-2 bg-primary rounded-full animate-ping" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-ruby w-5 h-5" />
              تنبيهات هامة
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-ruby/5 border border-ruby/10 text-xs">
                <p className="font-bold text-ruby mb-1">اجتماع المعلمين</p>
                <p className="text-gray-400">اليوم بعد صلاة العصر في مكتب المدير</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
                <p className="font-bold text-primary mb-1">تحديث المنهاج</p>
                <p className="text-gray-400">يرجى مراجعة قائمة السور الجديدة للفصل الثالث</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">الطلاب الأكثر تميزاً (هذا الأسبوع)</h3>
            <div className="space-y-4">
              {students.length > 0 ? students.slice(0, 3).map((student, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-xs font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{student.name}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(4)].map((_, j) => <div key={j} className="w-2 h-2 rounded-full bg-gold" />)}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-500 italic">لا يوجد طلاب مسجلين حالياً</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
