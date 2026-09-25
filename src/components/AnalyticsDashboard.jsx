import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  TrendingUp, 
  BarChart3, 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Layers
} from 'lucide-react';

const WEEKLY_DATA = [
  { label: 'Wk 1', percentage: 88.5, conducted: 6, presentAvg: 53 },
  { label: 'Wk 2', percentage: 91.2, conducted: 6, presentAvg: 55 },
  { label: 'Wk 3', percentage: 84.0, conducted: 6, presentAvg: 50 },
  { label: 'Wk 4', percentage: 79.5, conducted: 6, presentAvg: 48 },
  { label: 'Wk 5', percentage: 86.8, conducted: 6, presentAvg: 52 },
  { label: 'Wk 6', percentage: 82.4, conducted: 6, presentAvg: 49 },
  { label: 'Wk 7', percentage: 80.1, conducted: 6, presentAvg: 48 },
  { label: 'Wk 8', percentage: 85.3, conducted: 6, presentAvg: 51 },
  { label: 'Wk 9', percentage: 78.2, conducted: 6, presentAvg: 47 },
  { label: 'Wk 10', percentage: 81.6, conducted: 4, presentAvg: 49 },
];

const MONTHLY_DATA = [
  { label: 'Jan', percentage: 87.8, conducted: 14, defaulters: 2 },
  { label: 'Feb', percentage: 84.2, conducted: 16, defaulters: 3 },
  { label: 'Mar', percentage: 80.9, conducted: 18, defaulters: 4 },
  { label: 'Apr (Cur)', percentage: 82.4, conducted: 4, defaulters: 4 },
];

const DEPARTMENT_COMPARISONS = [
  { dept: 'Computer Science (CS-602)', code: 'CSE', rate: 82.4, defaulterCount: 4, status: 'Compliant' },
  { dept: 'Electrical Engineering', code: 'EE', rate: 76.1, defaulterCount: 7, status: 'At Risk' },
  { dept: 'Mechanical Engineering', code: 'ME', rate: 88.9, defaulterCount: 1, status: 'Optimal' },
  { dept: 'Civil Engineering', code: 'CE', rate: 71.8, defaulterCount: 9, status: 'Deficit' },
  { dept: 'Information Technology', code: 'IT', rate: 84.5, defaulterCount: 3, status: 'Compliant' },
];

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('WEEKLY');
  const [logData, setLogData] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      setLoadingLogs(true);
      try {
        const { data, error } = await supabase
          .from('attendance_logs')
          .select('date, status')
          .order('date', { ascending: false })
          .limit(30);
        if (!error && data) setLogData(data);
      } catch {
        // Fall back gracefully to internal benchmarks
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

  const activeTrendData = timeframe === 'WEEKLY' ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="space-y-6 mb-8">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        {/* Header and Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Attendance Trends & Demographic Benchmarks
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Historical compliance cycles and cross-department turnout metrics.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeframe('WEEKLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'WEEKLY'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Trajectory
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'MONTHLY'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Summary
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">
              {timeframe === 'WEEKLY' ? 'Weekly Cumulative Turnout (%)' : 'Monthly Cohort Average (%)'}
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm inline-block"></span>
                Eligible (&ge; 75%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block"></span>
                Shortage (&lt; 75%)
              </span>
              <span className="text-rose-500 font-medium">--- 75% Minimum Requirement</span>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="border border-slate-100 rounded-xl p-6 bg-slate-50/50 relative">
            {/* 75% Reference Guide Line */}
            <div 
              className="absolute left-0 right-0 border-b border-dashed border-rose-400/80 z-10 pointer-events-none"
              style={{ bottom: '75%' }}
            >
              <span className="absolute right-3 -top-5 text-[10px] font-semibold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-xs">
                75.0% Exam Threshold
              </span>
            </div>

            {/* Visual Columns */}
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-5 pt-6">
              {activeTrendData.map((item, index) => {
                const isUnder = item.percentage < 75.0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-center pointer-events-none z-20">
                      <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[11px] font-semibold shadow-md whitespace-nowrap">
                        {item.percentage}% ({item.conducted} sessions)
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-semibold mb-1 text-slate-700">
                      {item.percentage}%
                    </span>

                    <div 
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-200 group-hover:opacity-90 ${
                        isUnder 
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/20' 
                          : 'bg-indigo-600 shadow-sm shadow-indigo-600/20'
                      }`}
                      style={{ height: `${item.percentage}%` }}
                    />

                    <span className="mt-2 text-xs font-medium text-slate-500">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Logs from Supabase */}
          <div className="mt-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Historical Log Source:</span>{' '}
            {loadingLogs ? (
              <span>Loading attendance_logs...</span>
            ) : logData.length > 0 ? (
              <span className="font-mono text-indigo-600">
                {logData.length} records fetched from attendance_logs
              </span>
            ) : (
              <span>No historical log records yet (submit a session to populate).</span>
            )}
          </div>
        </div>

        {/* Section 2: Department Comparisons */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Cross-Department Turnout Benchmarks
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENT_COMPARISONS.map((dept, idx) => {
              const isCritical = dept.rate < 75.0;
              return (
                <div 
                  key={idx} 
                  className={`rounded-xl border p-4 transition-all ${
                    isCritical 
                      ? 'border-rose-200 bg-rose-50/30' 
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                        {dept.code}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 mt-0.5">
                        {dept.dept}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isCritical 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {dept.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xl font-bold font-mono ${
                        isCritical ? 'text-rose-600' : 'text-slate-900'
                      }`}>
                        {dept.rate}%
                      </span>
                      <span className="text-[10px] text-slate-400">average</span>
                    </div>

                    <span className={`text-xs font-semibold ${isCritical ? 'text-rose-600' : 'text-slate-500'}`}>
                      {dept.defaulterCount} Defaulters
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(100, dept.rate)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
