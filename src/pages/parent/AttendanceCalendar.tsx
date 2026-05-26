import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const AttendanceCalendar = ({ child: _child }: { child: any }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Mock attendance data
  const attendanceData: Record<number, 'present' | 'absent' | 'late'> = {
    1: 'present', 2: 'present', 3: 'late', 4: 'present', 5: 'absent',
    8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present',
    15: 'present', 16: 'late', 17: 'present', 18: 'present', 19: 'present',
    22: 'present', 23: 'present', 24: 'present'
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-xl font-bold">تقويم الحضور</h3>
          <p className="text-xs text-gray-500">سجل انضباط الطالب خلال الشهر</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-light/50 p-2 rounded-xl border border-white/5">
          <button className="p-1 hover:bg-white/10 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
          <span className="text-sm font-bold">ماي 2024</span>
          <button className="p-1 hover:bg-white/10 rounded-lg transition-all"><ChevronLeft className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="grid grid-cols-7 gap-4 mb-6">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {/* Padding for month start (assuming May starts on Wednesday) */}
          {[...Array(3)].map((_, i) => <div key={`empty-${i}`} className="h-24" />)}
          
          {days.map(day => {
            const status = attendanceData[day];
            return (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                key={day} 
                className={`h-24 rounded-2xl border flex flex-col items-center justify-center relative transition-all ${
                  status === 'present' ? 'bg-emerald/10 border-emerald/20 text-emerald' : 
                  status === 'absent' ? 'bg-ruby/10 border-ruby/20 text-ruby' :
                  status === 'late' ? 'bg-gold/10 border-gold/20 text-gold' :
                  'bg-white/5 border-white/5 text-gray-600'
                }`}
              >
                <span className="text-lg font-bold">{day}</span>
                {status && (
                  <span className="text-[8px] font-bold uppercase mt-1">
                    {status === 'present' ? 'حاضر' : status === 'absent' ? 'غائب' : 'متأخر'}
                  </span>
                )}
                {status === 'late' && (
                  <span className="absolute top-2 left-2 text-[8px] opacity-60">08:45</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-bold">حضور (20)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-ruby shadow-[0_0_8px_#ef4444]" />
          <span className="text-xs font-bold">غياب (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gold shadow-[0_0_8px_#fbbf24]" />
          <span className="text-xs font-bold">تأخر (2)</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
