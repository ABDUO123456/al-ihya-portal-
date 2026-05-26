import { motion } from 'framer-motion';
import { Star, MessageSquare, Clock, Calendar } from 'lucide-react';

const ActivityFeed = ({ child: _child }: { child: any }) => {
  const activities = [
    {
      date: 'الأحد، 24 ماي 2024',
      type: 'memorization',
      surah: 'سورة البقرة',
      verses: '1-15',
      rating: 4,
      note: 'حفظ متقن جداً مع مراعاة أحكام التجويد الأساسية.',
      teacher: 'أحمد محمد'
    },
    {
      date: 'السبت، 23 ماي 2024',
      type: 'revision',
      surah: 'سورة يس',
      verses: 'كاملة',
      rating: 3,
      note: 'مراجعة جيدة، يرجى التركيز أكثر على مخارج الحروف في الجزء الأخير.',
      teacher: 'أحمد محمد'
    },
    {
      date: 'الخميس، 21 ماي 2024',
      type: 'behavior',
      title: 'ملاحظة سلوكية',
      note: 'تركيز الطالب اليوم كان ممتازاً وتفاعله مع زملائه إيجابي جداً.',
      teacher: 'أحمد محمد'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center px-4">
        <h3 className="text-xl font-bold">الخط الزمني للنشاط</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-4 h-4" />
          شهر ماي 2024
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-y-0 before:right-6 before:w-[2px] before:bg-white/5">
        {activities.map((act, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pr-16"
          >
            {/* Timeline Node */}
            <div className={`absolute top-0 right-3.5 w-6 h-6 rounded-full border-4 border-background z-10 ${
              act.type === 'memorization' ? 'bg-primary shadow-[0_0_10px_#00d1ff]' : 
              act.type === 'revision' ? 'bg-secondary' : 'bg-gold'
            }`} />

            <div className="glass-card p-6 hover:border-white/20 transition-all group">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">{act.date}</span>
                  <span className="h-4 w-[1px] bg-white/10" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    act.type === 'memorization' ? 'text-primary' : 
                    act.type === 'revision' ? 'text-secondary' : 'text-gold'
                  }`}>
                    {act.type === 'memorization' ? 'حفظ جديد' : 
                     act.type === 'revision' ? 'مراجعة' : 'ملاحظة تربوية'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Clock className="w-3 h-3" />
                  {act.type === 'behavior' ? '11:00' : '09:45'} صباحاً
                </div>
              </div>

              {act.type !== 'behavior' ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold mb-1">{act.surah} <span className="text-sm font-normal text-gray-400">(الآيات {act.verses})</span></h4>
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < (act.rating || 0) ? 'text-gold fill-current' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <h4 className="text-lg font-bold mb-1">{act.title}</h4>
              )}

              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{act.note}"</p>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-gray-500 font-bold">
                  <span>الأستاذ: {act.teacher}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 rounded-xl border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
        عرض المزيد من النشاطات
      </button>
    </div>
  );
};

export default ActivityFeed;
