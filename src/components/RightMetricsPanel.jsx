import React from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

export default function RightMetricsPanel({ students, course, onSelectDefaulterFilter }) {
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.todayStatus === 'PRESENT').length;
  const absentCount = totalStudents - presentCount;
  const overallRate = totalStudents > 0
    ? Math.round((presentCount / totalStudents) * 100)
    : 0;

  // Defaulter count (< 75%)
  const defaulters = students.filter(student => {
    const effectiveAttended = student.todayStatus === 'PRESENT'
      ? student.attendedClasses + 1
      : student.attendedClasses;
    const effectiveTotal = student.totalClasses + 1;
    const percentage = (effectiveAttended / effectiveTotal) * 100;
    return percentage < 75.0;
  });

  const compliantCount = totalStudents - defaulters.length;
  const compliantPct = totalStudents > 0 ? Math.round((compliantCount / totalStudents) * 100) : 0;
  const deficitPct = totalStudents > 0 ? Math.round((defaulters.length / totalStudents) * 100) : 0;

  // Svg semi-circle calculation
  // Radius = 60, circumference = 2 * PI * 60 = 376.99
  // Semi-circle length = 188.5
  const semiCircumference = 188.5;
  const strokeDashoffset = semiCircumference - (semiCircumference * (overallRate / 100));

  return (
    <aside className="w-full lg:w-80 space-y-6 shrink-0">
      {/* 1. Gauge Meter Card (like "RECEIPT OF GOODS $2.2m" in Mate) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold tracking-wider uppercase text-slate-400 text-[10px]">
            Cohort Compliance
          </span>
          <span className="text-slate-400 text-xs font-mono">{course.code}</span>
        </div>

        {/* Semi-circular Arch Meter */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
          <svg className="w-48 h-28" viewBox="0 0 160 90">
            {/* Background Arch */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Active Foreground Arch */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#0F172A"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={semiCircumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Metric Label */}
          <div className="absolute top-10 text-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {overallRate}%
            </span>
            <span className="block text-[11px] font-medium text-slate-400 mt-0.5">
              {presentCount} of {totalStudents} present
            </span>
          </div>
        </div>

        {/* Breakdown Row (like $864,600 shipments | $1.34m pickups) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs mt-2">
          <div>
            <div className="flex items-center gap-1.5 text-slate-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
              <span>{presentCount} Present</span>
            </div>
            <span className="text-[11px] text-slate-400 pl-3.5">
              Today's Session
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              <span>{absentCount} Absent</span>
            </div>
            <span className="text-[11px] text-slate-400 pl-3.5">
              Require follow-up
            </span>
          </div>
        </div>
      </div>

      {/* 2. Roster Status Bar (like "ORDERS STATUS: Paid 89% | Cancelled 8% | Refunded 3%") */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold tracking-wider uppercase text-slate-400 text-[10px]">
            Statutory Standing
          </span>
          <span className="text-slate-500 font-semibold text-xs">Active Term</span>
        </div>

        {/* Multi-segment Horizontal Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex mb-4">
          <div
            className="bg-emerald-600 h-full transition-all duration-500"
            style={{ width: `${compliantPct}%` }}
            title={`Eligible: ${compliantPct}%`}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-500"
            style={{ width: `${deficitPct}%` }}
            title={`Shortage: ${deficitPct}%`}
          />
        </div>

        {/* Breakdown Items with % */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-sm bg-emerald-600 inline-block" />
              Eligible (&ge; 75%)
            </span>
            <span className="font-bold font-mono text-slate-800">{compliantPct}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" />
              Shortage Alert (&lt; 75%)
            </span>
            <span className="font-bold font-mono text-rose-600">{deficitPct}%</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Overview Grid (like OVERVIEW $2,246.75 / 16 min / 0.32% in Mate) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-100">
          <span className="font-bold tracking-wider uppercase text-slate-400 text-[10px]">
            Academic Summary
          </span>
          <span className="text-slate-400 text-xs">This semester</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Conducted</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              {course.conductedClasses || 52}
            </span>
            <span className="text-[10px] text-slate-400">Total lectures</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Enrolled</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              {totalStudents}
            </span>
            <span className="text-[10px] text-slate-400">Class size</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Avg. Attendance</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              81.4%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">+1.8% vs last week</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Shortage Count</span>
            <span className="text-lg font-bold font-mono text-rose-600 mt-0.5 block">
              {defaulters.length}
            </span>
            <span className="text-[10px] text-rose-600 font-medium">Require advisory</span>
          </div>
        </div>
      </div>

      {/* 4. Attention Spotlight Card (like TOP SELLERS in Mate) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-100">
          <span className="font-bold tracking-wider uppercase text-slate-400 text-[10px]">
            Priority Advisories
          </span>
          <span className="text-xs text-rose-600 font-semibold font-mono">
            {defaulters.length} Students
          </span>
        </div>

        <div className="space-y-2.5">
          {defaulters.slice(0, 3).map(student => {
            const effectiveAttended = student.todayStatus === 'PRESENT'
              ? student.attendedClasses + 1
              : student.attendedClasses;
            const pct = Math.round((effectiveAttended / (student.totalClasses + 1)) * 100);
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {student.name[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 truncate block">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{student.rollNo}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-rose-600 text-xs">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
