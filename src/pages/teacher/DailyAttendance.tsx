import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Search, Save, Loader2 } from 'lucide-react';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { Student, AttendanceRecord } from '../../types';

const DailyAttendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const allStudents = await db.getStudents();
      const filtered = allStudents.filter(s => s.halaqaId === user?.halaqaId);
      setStudents(filtered);
      setLoading(false);
    };
    fetchStudents();
  }, [user?.halaqaId]);

  const toggleStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const records: AttendanceRecord[] = Object.entries(attendance)
      .filter(([_, status]) => status !== null)
      .map(([studentId, status]) => ({
        id: crypto.randomUUID(),
        studentId,
        date: new Date().toISOString().split('T')[0],
        status: status as 'present' | 'absent' | 'late'
      }));

    await db.saveAttendance(records);
    setSaving(false);
    alert('تم حفظ الحضور بنجاح!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">تسجيل الحضور اليومي</h3>
          <p className="text-sm text-gray-500">يرجى تسجيل الحضور في أول 10 دقائق من الحلقة</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald text-background font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'جاري الحفظ...' : 'حفظ وإرسال التنبيهات'}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="البحث عن طالب..." className="w-full input-field py-2 pr-10 text-sm" />
          </div>
          <div className="flex gap-4 text-xs font-bold hidden md:flex">
            <span className="text-emerald flex items-center gap-1"><div className="w-2 h-2 bg-emerald rounded-full" /> حاضر</span>
            <span className="text-ruby flex items-center gap-1"><div className="w-2 h-2 bg-ruby rounded-full" /> غائب</span>
            <span className="text-gold flex items-center gap-1"><div className="w-2 h-2 bg-gold rounded-full" /> متأخر</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {students.map((student, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={student.id} 
              className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4 self-start sm:self-center">
                <div className="w-12 h-12 rounded-full bg-surface-light border border-white/10 flex items-center justify-center font-bold text-primary">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{student.name}</h4>
                  <p className="text-xs text-gray-500">ولي الأمر: {student.parentPhone}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => toggleStatus(student.id, 'present')}
                  className={`flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border transition-all ${
                    attendance[student.id] === 'present' 
                      ? 'bg-emerald/20 border-emerald text-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'border-white/5 hover:border-emerald/30 text-gray-500'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-[10px] font-bold">حاضر</span>
                </button>

                <button 
                  onClick={() => toggleStatus(student.id, 'absent')}
                  className={`flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border transition-all ${
                    attendance[student.id] === 'absent' 
                      ? 'bg-ruby/20 border-ruby text-ruby shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'border-white/5 hover:border-ruby/30 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                  <span className="text-[10px] font-bold">غائب</span>
                </button>

                <button 
                  onClick={() => toggleStatus(student.id, 'late')}
                  className={`flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border transition-all ${
                    attendance[student.id] === 'late' 
                      ? 'bg-gold/20 border-gold text-gold shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                      : 'border-white/5 hover:border-gold/30 text-gray-500'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-[10px] font-bold">متأخر</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyAttendance;
