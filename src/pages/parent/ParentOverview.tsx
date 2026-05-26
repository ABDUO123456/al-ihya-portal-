import { BookOpen, Calendar, TrendingUp, Star, Award, MessageSquare } from 'lucide-react';

const ParentOverview = ({ child }: { child: any }) => {
  return (
    <div className="space-y-8">
      {/* Top Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">آخر إنجاز</h4>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-black mb-1 text-white/90">سورة البقرة</p>
          <p className="text-xs font-bold text-primary flex items-center gap-1">
            تم الحفظ بتقدير ممتاز 
            <span className="flex gap-0.5 mr-1">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </span>
          </p>
        </div>

        <div className="glass-card p-6 border-emerald/10 bg-gradient-to-br from-emerald/5 to-transparent">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">نسبة الحضور</h4>
            <div className="p-2 bg-emerald/10 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald" />
            </div>
          </div>
          <p className="text-2xl font-black mb-1 text-white/90">98%</p>
          <p className="text-xs font-bold text-emerald">حاضر (22/24 جلسة)</p>
        </div>

        <div className="glass-card p-6 border-gold/10 bg-gradient-to-br from-gold/5 to-transparent">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">تقييم المراجعة</h4>
            <div className="p-2 bg-gold/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
          </div>
          <p className="text-2xl font-black mb-1 text-white/90">جيد جداً</p>
          <p className="text-xs font-bold text-gold">تقدم ملحوظ في المراجعة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Summary */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="text-primary w-6 h-6" />
            </div>
            آخر تحديثات الحلقة
          </h3>
          <div className="space-y-8">
            {[1, 2].map((_, i) => (
              <div key={i} className="relative pr-10 pb-2 border-r-2 border-white/5 last:border-0 last:pb-0">
                <div className="absolute top-0 right-[-9px] w-4 h-4 rounded-full bg-background border-4 border-primary shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                <div className="text-xs font-bold text-gray-500 mb-2">أمس، 10:30 صباحاً</div>
                <h4 className="font-black text-lg mb-2 text-white/90">تم تسميع الحفظ الجديد: سورة البقرة (1-20)</h4>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < 4 ? 'text-gold fill-current' : 'text-white/10'}`} />
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-gray-400 leading-relaxed italic relative">
                  <span className="absolute -top-3 right-4 bg-surface px-2 text-primary font-bold">ملاحظة المعلم</span>
                  "أحسنت يا {child.name.split(' ')[0]}، استمر في هذا المستوى المميز، تلاوتك أصبحت أكثر إتقاناً."
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Board Summary */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-x-16 -translate-y-16" />
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-xl">
              <MessageSquare className="text-secondary w-6 h-6" />
            </div>
            إعلانات المدرسة
          </h3>
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 relative group hover:bg-primary/10 transition-colors cursor-pointer">
              <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-[10px] font-black text-primary mb-2 uppercase tracking-tighter">إعلان عام</span>
              <h4 className="text-sm font-black mb-2 text-white/90">جدول امتحانات الفصل الثاني</h4>
              <p className="text-xs text-gray-500 leading-relaxed">تبدأ الامتحانات الشفوية والكتابية يوم 15 جوان القادم...</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 opacity-60 hover:opacity-100 transition-all cursor-pointer">
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tighter">تنبيه</span>
              <h4 className="text-sm font-black mb-2 text-white/90">تغيير في توقيت حلقة النور</h4>
              <p className="text-xs text-gray-500 leading-relaxed">بمناسبة شهر رمضان المعظم، تم تقديم التوقيت إلى...</p>
            </div>
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-sm text-primary hover:bg-primary/5 font-bold transition-all">
            عرض جميع الإعلانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentOverview;
