import { useState, useEffect } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Filter, Download, Loader2 } from 'lucide-react';
import { db } from '../../services/dbService';
import { FinancialRecord } from '../../types';

const FinancialManagement = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      const data = await db.getFinancialRecords();
      setRecords(data);
      setLoading(false);
    };
    fetchRecords();
  }, []);

  const totalRevenue = records.filter(r => r.type === 'revenue').reduce((acc, r) => acc + r.amount, 0);
  const totalExpenses = records.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
  const balance = totalRevenue - totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-primary/20 text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">إجمالي الرصيد</span>
          </div>
          <p className="text-3xl font-bold mb-1">{balance.toLocaleString()} DA</p>
          <p className="text-xs text-emerald flex items-center gap-1">
            <ArrowUpCircle className="w-3 h-3" /> الرصيد الحالي
          </p>
        </div>

        <div className="glass-card p-6 border-emerald/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald/10 text-emerald">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">إجمالي المداخيل</span>
          </div>
          <p className="text-3xl font-bold mb-1">{totalRevenue.toLocaleString()} DA</p>
          <p className="text-xs text-gray-500">من المداخيل والتبرعات</p>
        </div>

        <div className="glass-card p-6 border-ruby/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-ruby/10 text-ruby">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">إجمالي المصاريف</span>
          </div>
          <p className="text-3xl font-bold mb-1">{totalExpenses.toLocaleString()} DA</p>
          <p className="text-xs text-ruby flex items-center gap-1">
            <ArrowDownCircle className="w-3 h-3" /> رواتب وفواتير
          </p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-xl font-bold">سجل المعاملات المالية</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold">
              <Filter className="w-4 h-4" /> تصفية
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm font-bold">
              <Download className="w-4 h-4" /> تصدير PDF
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {records.length > 0 ? records.map((item, _i) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'revenue' ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'}`}>
                  {item.type === 'revenue' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.description}</h4>
                  <p className="text-[10px] text-gray-500">{item.date} • {item.category}</p>
                </div>
              </div>
              <span className={`font-bold ${item.type === 'revenue' ? 'text-emerald' : 'text-ruby'}`}>
                {item.type === 'revenue' ? '+' : '-'}{item.amount.toLocaleString()} DA
              </span>
            </div>
          )) : (
            <p className="text-center text-gray-500 py-8">لا توجد معاملات مالية مسجلة حتى الآن</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
