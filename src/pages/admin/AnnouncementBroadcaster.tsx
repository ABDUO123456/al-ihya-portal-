import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Send, Image as ImageIcon, Link as LinkIcon, Trash2, Calendar, Loader2 } from 'lucide-react';
import { db } from '../../services/dbService';
import { Announcement } from '../../types';

const AnnouncementBroadcaster = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'holiday' | 'exam'>('general');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      const data = await db.getAnnouncements();
      setAnnouncements(data);
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  const handleSend = async () => {
    if (!title || !content) return;
    setSaving(true);
    
    const newAnn: Announcement = {
      id: crypto.randomUUID(),
      title,
      content,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    await db.addAnnouncement(newAnn);
    const updated = await db.getAnnouncements();
    setAnnouncements(updated);
    
    setSaving(false);
    setTitle('');
    setContent('');
    alert('تم بث الإعلان بنجاح!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Megaphone className="text-primary w-6 h-6" />
            نشر إعلان جديد
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2 mr-1">عنوان الإعلان</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: جدول امتحانات الفصل الثاني" 
                className="w-full input-field"
              />
            </div>
            
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2 mr-1">نوع الإعلان</label>
              <div className="flex gap-2">
                {[
                  { id: 'general', label: 'عام' },
                  { id: 'holiday', label: 'عطلة' },
                  { id: 'exam', label: 'امتحان' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setType(t.id as any)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${
                      type === t.id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 hover:border-primary/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2 mr-1">محتوى الإعلان</label>
              <textarea 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تفاصيل الإعلان هنا..."
                className="w-full input-field resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-background font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {saving ? 'جاري البث...' : 'بث الإعلان للجميع'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold px-2">الإعلانات السابقة</h3>
        <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2">
          {announcements.map((ann, i) => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  ann.type === 'holiday' ? 'bg-ruby/20 text-ruby' : 
                  ann.type === 'exam' ? 'bg-gold/20 text-gold' : 'bg-primary/20 text-primary'
                }`}>
                  {ann.type === 'holiday' ? 'عطلة' : ann.type === 'exam' ? 'امتحان' : 'عام'}
                </span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-ruby/10 rounded text-ruby transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold mb-2">{ann.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{ann.content}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Calendar className="w-3 h-3" />
                {ann.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBroadcaster;
