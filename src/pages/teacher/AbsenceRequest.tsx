import { AlertCircle, Calendar, Send, History, CheckCircle2, Clock } from 'lucide-react';

const AbsenceRequest = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Request Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle className="text-ruby w-6 h-6" />
            تقديم طلب غياب اضطراري
          </h3>
          <p className="text-sm text-gray-400 mb-8">
            يرجى تقديم الطلب في أقرب وقت ممكن ليتمكن المدير من تعيين معلم بديل لحلقتك.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 mr-1">تاريخ الغياب</label>
                <div className="relative">
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="date" className="w-full input-field pr-12" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 mr-1">نوع الغياب</label>
                <select className="w-full input-field bg-surface-light">
                  <option>طارئ (مرض/ظرف عائلي)</option>
                  <option>مخطط له (إجازة/سفر)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 mr-1">سبب الغياب بالتفصيل</label>
              <textarea 
                rows={4}
                className="w-full input-field resize-none"
                placeholder="يرجى كتابة سبب الغياب هنا..."
                required
              />
            </div>

            <button className="w-full bg-ruby/20 hover:bg-ruby text-ruby hover:text-white font-bold py-4 rounded-xl border border-ruby/30 transition-all flex items-center justify-center gap-2 group">
              <Send className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              إرسال الطلب للمدير
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold px-2 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          الطلبات السابقة
        </h3>
        <div className="space-y-4">
          {[
            { date: '2024-05-10', status: 'approved', reason: 'موعد طبي' },
            { date: '2024-04-15', status: 'approved', reason: 'ظرف عائلي' },
          ].map((req, i) => (
            <div key={i} className="glass-card p-5 border-l-4 border-l-emerald">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold">{req.date}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald">
                  <CheckCircle2 className="w-3 h-3" /> مقبول
                </span>
              </div>
              <p className="text-xs text-gray-400">{req.reason}</p>
            </div>
          ))}
          
          <div className="glass-card p-5 border-l-4 border-l-gold opacity-80">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold">2024-05-25</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gold">
                <Clock className="w-3 h-3" /> قيد المراجعة
              </span>
            </div>
            <p className="text-xs text-gray-400">طلب غياب ليوم غد</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceRequest;
