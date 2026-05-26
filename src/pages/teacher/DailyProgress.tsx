import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Save, ChevronLeft, MessageSquare, History, Loader2 } from 'lucide-react';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { Student, ProgressRecord } from '../../types';

const DailyProgress = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [surah, setSurah] = useState('');
  const [startAyah, setStartAyah] = useState('');
  const [endAyah, setEndAyah] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4>(4);
  const [closeRevision, setCloseRevision] = useState('');
  const [distantRevision, setDistantRevision] = useState('');
  const [notes, setNotes] = useState('');

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

  const handleSave = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    
    const record: ProgressRecord = {
      id: crypto.randomUUID(),
      studentId: selectedStudent,
      date: new Date().toISOString().split('T')[0],
      memorization: {
        surah,
        startAyah: parseInt(startAyah) || 0,
        endAyah: parseInt(endAyah) || 0,
        rating
      },
      revision: {
        close: closeRevision,
        distant: distantRevision
      },
      notes
    };

    await db.saveProgress(record);
    setSaving(false);
    alert('تم حفظ التقدم بنجاح!');
    
    // Reset form
    setSurah('');
    setStartAyah('');
    setEndAyah('');
    setRating(4);
    setCloseRevision('');
    setDistantRevision('');
    setNotes('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      {/* Student List Sidebar */}
      <div className="lg:col-span-1 glass-card overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold">قائمة الطلاب</h3>
          <p className="text-xs text-gray-500">اختر طالباً لتسجيل تقدمه</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student.id)}
              className={`w-full p-4 flex items-center justify-between border-b border-white/5 transition-all ${
                selectedStudent === student.id ? 'bg-primary/10 border-r-4 border-r-primary' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedStudent === student.id ? 'bg-primary text-background' : 'bg-surface-light text-gray-400'}`}>
                  {student.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${selectedStudent === student.id ? 'text-primary' : ''}`}>{student.name}</p>
                  <p className="text-[10px] text-gray-500">آخر تسميع: سورة البقرة</p>
                </div>
              </div>
              <ChevronLeft className={`w-4 h-4 transition-transform ${selectedStudent === student.id ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Progress Entry Form */}
      <div className="lg:col-span-2 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="wait">
          {selectedStudent ? (
            <motion.div
              key={selectedStudent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <BookOpen className="text-primary w-6 h-6" />
                    تسجيل الحفظ الجديد - {students.find(s => s.id === selectedStudent)?.name}
                  </h3>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <History className="w-4 h-4" /> سجل التقدم السابق
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">السورة</label>
                    <select 
                      value={surah}
                      onChange={(e) => setSurah(e.target.value)}
                      className="w-full input-field bg-surface-light"
                    >
                      <option value="">اختر السورة</option>
                      {['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-1">من الآية</label>
                      <input 
                        type="number" 
                        value={startAyah}
                        onChange={(e) => setStartAyah(e.target.value)}
                        className="w-full input-field" 
                        placeholder="1" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-1">إلى الآية</label>
                      <input 
                        type="number" 
                        value={endAyah}
                        onChange={(e) => setEndAyah(e.target.value)}
                        className="w-full input-field" 
                        placeholder="10" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <label className="text-sm font-bold text-gray-400 mr-1">تقييم جودة الحفظ</label>
                  <div className="flex gap-4">
                    {[
                      { label: 'ممتاز', val: 4, stars: 4, color: 'text-emerald' },
                      { label: 'جيد جداً', val: 3, stars: 3, color: 'text-primary' },
                      { label: 'جيد', val: 2, stars: 2, color: 'text-gold' },
                      { label: 'ضعيف', val: 1, stars: 1, color: 'text-ruby' },
                    ].map((r) => (
                      <button 
                        key={r.label} 
                        onClick={() => setRating(r.val as any)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border transition-all group ${rating === r.val ? 'border-primary/100 bg-primary/10' : 'border-white/10 hover:border-primary/50'}`}
                      >
                        <div className={`flex gap-0.5 ${r.color}`}>
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.stars ? 'fill-current' : 'opacity-20'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <History className="text-secondary w-5 h-5" />
                  المراجعة اليومية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">المراجعة القريبة (الأحزاب الـ 5 الأخيرة)</label>
                    <input 
                      type="text" 
                      value={closeRevision}
                      onChange={(e) => setCloseRevision(e.target.value)}
                      className="w-full input-field" 
                      placeholder="مثلاً: من سورة يس إلى الناس" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">المراجعة البعيدة (الماضي)</label>
                    <input 
                      type="text" 
                      value={distantRevision}
                      onChange={(e) => setDistantRevision(e.target.value)}
                      className="w-full input-field" 
                      placeholder="مثلاً: البقرة وآل عمران" 
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <MessageSquare className="text-gold w-5 h-5" />
                  ملاحظات السلوك والتركيز
                </h3>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full input-field resize-none"
                  placeholder="اكتب ملاحظة لولي الأمر (سيتم إرسالها فوراً)..."
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-l from-primary to-secondary text-background font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(0,209,255,0.3)] hover:shadow-[0_0_30px_rgba(0,209,255,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                {saving ? 'جاري الحفظ...' : 'حفظ وإرسال التقدم اليومي'}
              </button>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">اختر طالباً للبدء</h3>
              <p className="text-gray-500 max-w-sm">يرجى اختيار طالب من القائمة الجانبية لتسجيل تقدمه في الحفظ والمراجعة لليوم.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyProgress;
