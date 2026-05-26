import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, UserX, CheckCircle2, XCircle, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { db } from '../../services/dbService';
import { Student } from '../../types';

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'approvals'>('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newIdCardPhoto, setNewIdCardPhoto] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    const data = await db.getStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewIdCardPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: crypto.randomUUID(),
      name: newName,
      age: parseInt(newAge),
      birthDate: newBirthDate,
      parentPhone: newPhone,
      halaqaId: 'h1', // Default
      status: 'active',
      idCardPhoto: newIdCardPhoto || undefined,
      notes: newNotes
    };

    await db.addStudent(student);
    setShowAddModal(false);
    resetForm();
    fetchStudents();
    alert('تم إضافة الطالب بنجاح!');
  };

  const resetForm = () => {
    setNewName('');
    setNewAge('');
    setNewBirthDate('');
    setNewPhone('');
    setNewNotes('');
    setNewIdCardPhoto(null);
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-2 bg-surface-light/20 p-1.5 rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'all' ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          قائمة الطلاب
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 relative ${activeTab === 'approvals' ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          طلبات التسجيل
          <span className="absolute -top-1 -left-1 w-6 h-6 bg-ruby text-white text-[11px] font-black flex items-center justify-center rounded-full border-2 border-background shadow-lg">3</span>
        </button>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="البحث عن اسم الطالب أو رقم الهاتف..." 
            className="w-full input-field pr-12"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-emerald-600 text-background font-black px-8 py-4 rounded-2xl hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          تسجيل طالب جديد
        </button>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md p-8 relative shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 left-6 p-2.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5">
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-1">إضافة طالب جديد</h3>
                <p className="text-sm text-gray-500 font-medium">أدخل بيانات الطالب وولي أمره لتسجيله في المدرسة</p>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-5 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 block mr-1">اسم الطالب الكامل</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full input-field" placeholder="مثال: محمد أحمد" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 block mr-1">تاريخ الميلاد</label>
                    <input required value={newBirthDate} onChange={e => setNewBirthDate(e.target.value)} type="date" className="w-full input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 block mr-1">العمر</label>
                    <input required value={newAge} onChange={e => setNewAge(e.target.value)} type="number" className="w-full input-field" placeholder="10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 block mr-1">رقم هاتف الولي</label>
                    <input required value={newPhone} onChange={e => setNewPhone(e.target.value)} type="tel" className="w-full input-field" placeholder="05XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 block mr-1">الحلقة</label>
                    <select className="w-full input-field appearance-none cursor-pointer">
                      <option className="bg-surface">حلقة الفجر</option>
                      <option className="bg-surface">حلقة النور</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 block mr-1">تحميل صورة النكوة (بطاقة التعريف)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="idCardUpload"
                    />
                    <label 
                      htmlFor="idCardUpload"
                      className="w-full border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      {newIdCardPhoto ? (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden">
                          <img src={newIdCardPhoto} alt="ID Card Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-primary" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">اضغط لرفع الصورة</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 block mr-1">ملاحظة</label>
                  <textarea 
                    value={newNotes} 
                    onChange={e => setNewNotes(e.target.value)} 
                    className="w-full input-field min-h-[100px] py-3 resize-none" 
                    placeholder="أضف أي ملاحظات إضافية هنا..."
                  />
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-primary to-emerald-600 text-background font-black hover:shadow-xl transition-all shadow-lg shadow-primary/20">
                    تأكيد التسجيل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Students Table */}
      <div className="glass-card overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">الطالب</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">العمر</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">الحلقة</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">هاتف الولي</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-5 font-bold text-xs text-gray-500 uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(activeTab === 'all' ? students : []).map((student, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={student.id} 
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white/90">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-medium">{student.age} سنة</td>
                  <td className="px-8 py-5">
                    <span className="text-primary font-bold text-sm bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                      حلقة الفجر
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-mono tracking-tighter">{student.parentPhone}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black border-2 ${
                      student.status === 'active' ? 'bg-emerald/5 text-emerald border-emerald/10' : 
                      student.status === 'pending' ? 'bg-gold/5 text-gold border-gold/10' : 'bg-ruby/5 text-ruby border-ruby/10'
                    }`}>
                      {student.status === 'active' ? 'نشط' : student.status === 'pending' ? 'قيد الانتظار' : 'متوقف'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 hover:bg-ruby/5 rounded-xl text-gray-400 hover:text-ruby transition-all border border-transparent hover:border-ruby/10">
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {activeTab === 'approvals' && (
                [1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                          {i + 1}
                        </div>
                        <span className="font-bold text-white/90">طلب تسجيل جديد #{i+1}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-medium">10 سنوات</td>
                    <td className="px-8 py-5">
                      <span className="text-gray-500 font-bold text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        لم تحدد
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-mono tracking-tighter">05XXXXXXXX</td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 rounded-xl text-[11px] font-black border-2 bg-primary/5 text-primary border-primary/10">
                        طلب جديد
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all text-xs font-black border border-emerald/20">
                          <CheckCircle2 className="w-4 h-4" /> قبول
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ruby/10 text-ruby hover:bg-ruby/20 transition-all text-xs font-black border border-ruby/20">
                          <XCircle className="w-4 h-4" /> رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
