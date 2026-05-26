import { Download, CheckCircle2, AlertCircle, Clock, History } from 'lucide-react';

const FinancialStatement = ({ child: _child }: { child: any }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-xl font-bold">الوضعية المالية</h3>
          <p className="text-xs text-gray-500">متابعة الاشتراكات الشهرية والوصولات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-6 relative z-10">الاشتراك الحالي (ماي 2024)</h4>
            <div className="flex items-center justify-between relative z-10 mb-8">
              <span className="text-4xl font-bold">1,500 DA</span>
              <span className="px-3 py-1 rounded-full bg-emerald/20 text-emerald text-[10px] font-bold border border-emerald/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> تم الدفع
              </span>
            </div>
            <button className="w-full py-4 rounded-xl bg-primary text-background font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all relative z-10">
              <Download className="w-5 h-5" />
              تحميل وصل الدفع
            </button>
          </div>

          <div className="glass-card p-6 border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">ملاحظة مالية</h4>
                <p className="text-[10px] text-gray-500">يرجى تسديد اشتراك شهر جوان قبل يوم 05</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <History className="text-gray-400 w-5 h-5" />
            سجل المدفوعات التاريخي
          </h3>
          <div className="space-y-4">
            {[
              { month: 'أفريل 2024', amount: '1,500 DA', date: '2024-04-02', status: 'paid' },
              { month: 'مارس 2024', amount: '1,500 DA', date: '2024-03-05', status: 'paid' },
              { month: 'فيفري 2024', amount: '1,500 DA', date: '2024-02-01', status: 'paid' },
              { month: 'جانفي 2024', amount: '1,500 DA', date: '2024-01-08', status: 'paid' },
            ].map((payment, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-light border border-white/10 flex flex-col items-center justify-center text-gray-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">اشتراك شهر {payment.month}</h4>
                    <p className="text-[10px] text-gray-500">تاريخ الدفع: {payment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-emerald">{payment.amount}</span>
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-gray-500 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatement;
