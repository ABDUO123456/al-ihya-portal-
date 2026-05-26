import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, UserX, Loader2, X } from 'lucide-react';
import { db } from '../../services/dbService';
import { Teacher } from '../../types';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHalaqa, setNewHalaqa] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    const data = await db.getTeachers();
    setTeachers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const teacher: Teacher = {
      id: crypto.randomUUID(),
      name: newName,
      phone: newPhone,
      role: 'teacher',
      halaqaName: newHalaqa,
      status: 'active'
    };

    await db.addTeacher(teacher);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewHalaqa('');
    fetchTeachers();
    alert('تم إضافة المعلم بنجاح!');
  };

  if (loading && teachers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="البحث عن اسم المعلم أو رقم الهاتف..." 
            className="w-full input-field pr-12"
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-emerald-600 text-background font-black px-8 py-4 rounded-2xl hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          تسجيل معلم جديد
        </button>
      </div>

      {/* Teachers Table */}
      <div className="glass-card overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">المعلم</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">رقم الهاتف</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest text-center">الحلقة المسندة</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest text-center">الحالة</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teachers.map((teacher, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={teacher.id} 
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}&backgroundColor=10b981`} alt="" />
                      </div>
                      <div>
                        <span className="font-bold text-white/90 block leading-none mb-1">{teacher.name}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">أستاذ حلقة</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-mono tracking-tighter">{teacher.phone}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-sm font-bold border border-primary/10">
                      {teacher.halaqaName}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black border-2 flex items-center gap-2 ${
                        teacher.status === 'active' ? 'bg-emerald/5 text-emerald border-emerald/10' : 'bg-ruby/5 text-ruby border-ruby/10'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === 'active' ? 'bg-emerald animate-pulse' : 'bg-ruby'}`} />
                        {teacher.status === 'active' ? 'نشط' : 'متوقف'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 hover:bg-ruby/5 rounded-xl text-gray-400 hover:text-ruby transition-all border border-transparent hover:border-ruby/10">
                        <UserX className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 hover:bg-ruby/5 rounded-xl text-gray-400 hover:text-ruby transition-all border border-transparent hover:border-ruby/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative glass-card p-8 w-full max-w-lg shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 left-6 p-2.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-black mb-1">تسجيل معلم جديد</h3>
              <p className="text-sm text-gray-500 font-medium">أدخل بيانات المعلم لإنشاء حساب جديد له في النظام</p>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 block mr-1">اسم المعلم الكامل</label>
                <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full input-field" placeholder="مثال: أحمد محمود" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 block mr-1">رقم الهاتف</label>
                  <input required value={newPhone} onChange={e => setNewPhone(e.target.value)} type="tel" className="w-full input-field" placeholder="05XXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 block mr-1">الحلقة المسندة</label>
                  <input required value={newHalaqa} onChange={e => setNewHalaqa(e.target.value)} type="text" className="w-full input-field" placeholder="اسم الحلقة" />
                </div>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-primary to-emerald-600 text-background font-black hover:shadow-xl transition-all shadow-lg shadow-primary/20">
                  حفظ بيانات المعلم
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
