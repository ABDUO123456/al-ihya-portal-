import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';
import { db } from '../../services/dbService';

const AdminOverview = () => {
  const [statsData, setStatsData] = useState({
    studentsCount: 0,
    teachersCount: 0,
    attendanceRate: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const students = await db.getStudents();
      const teachers = await db.getTeachers();
      const attendance = await db.getAttendance();
      
      // Calculate today's attendance rate
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = attendance.filter(r => r.date === today);
      const rate = students.length > 0 ? (todayRecords.filter(r => r.status === 'present').length / students.length) * 100 : 0;

      setStatsData({
        studentsCount: students.length,
        teachersCount: teachers.length,
        attendanceRate: Math.round(rate),
        revenue: 0 // Placeholder for now
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'إجمالي الطلاب', value: statsData.studentsCount.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10', trend: '+12%', isPositive: true },
    { label: 'المعلمون النشطون', value: statsData.teachersCount.toString(), icon: GraduationCap, color: 'text-secondary', bg: 'bg-secondary/10', trend: '+2', isPositive: true },
    { label: 'نسبة الحضور اليوم', value: `${statsData.attendanceRate}%`, icon: Calendar, color: 'text-emerald', bg: 'bg-emerald/10', trend: '+5%', isPositive: true },
    { label: 'إجمالي الإيرادات', value: `${statsData.revenue.toLocaleString()} DA`, icon: DollarSign, color: 'text-gold', bg: 'bg-gold/10', trend: '0%', isPositive: true },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-[60px] translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700 opacity-50`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.trend}
              </div>
            </div>
            
            <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold tracking-tight text-white/90">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Chart Placeholder */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="text-primary w-5 h-5" />
              </div>
              الملخص المالي
            </h3>
            <select className="bg-surface-light border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div className="w-full relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="w-full bg-gradient-to-t from-primary/10 via-primary/40 to-primary rounded-t-xl transition-all duration-500 group-hover:to-secondary group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-surface-light text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap z-10">
                    {height * 100} DA
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-500">اليوم {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Attendance Rate */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <h3 className="text-lg font-bold mb-8 self-start flex items-center gap-3">
            <div className="p-2 bg-emerald/10 rounded-lg text-emerald">
              <Calendar className="w-5 h-5" />
            </div>
            نسبة الحضور اليوم
          </h3>
          <div className="relative w-52 h-52 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="88"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * (statsData.attendanceRate / 100)) }}
                cx="104"
                cy="104"
                r="88"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray="553"
                className="text-primary"
                style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black gradient-text">{statsData.attendanceRate}%</span>
              <span className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">حاضرون</span>
            </div>
          </div>
          <div className="flex gap-6 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-gray-400">حاضر</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-white/10 rounded-full" />
              <span className="text-gray-400">غائب</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed (Summary) */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="text-ruby w-5 h-5" />
          تنبيهات الغياب العاجلة (المعلمون)
        </h3>
        <div className="space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-ruby/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ruby/10 flex items-center justify-center text-ruby">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">أحمد محمد - حلقة الفجر</h4>
                  <p className="text-sm text-gray-500">السبب: ظرف عائلي طارئ • اليوم 08:30</p>
                </div>
              </div>
              <button className="glass-button text-xs font-bold border-ruby/30 text-ruby hover:bg-ruby/20">
                تعيين بديل
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
