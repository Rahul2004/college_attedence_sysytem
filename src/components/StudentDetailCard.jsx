import React from 'react';
import {
  X,
  Maximize2,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Check,
  GraduationCap,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function StudentDetailCard({ student, onClose, onToggleStatus }) {
  if (!student) return null;

  const isPresent = student.todayStatus === 'PRESENT';
  const effectiveAttended = isPresent
    ? student.attendedClasses + 1
    : student.attendedClasses;
  const effectiveTotal = student.totalClasses + 1;
  const percentage = Number(((effectiveAttended / effectiveTotal) * 100).toFixed(1));
  const isDefaulter = percentage < 75.0;

  const recoveryClasses = isDefaulter
    ? Math.max(0, Math.ceil((0.75 * effectiveTotal - effectiveAttended) / 0.25))
    : 0;

  const safeMissable = !isDefaulter
    ? Math.max(0, Math.floor((effectiveAttended - 0.75 * effectiveTotal) / 0.75))
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 text-slate-800 w-full animate-in fade-in zoom-in-95 duration-150">
      {/* Card Header (like #Order #4567 header in reference) */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            Student #{student.rollNo}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">CS-602</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Meta Details */}
      <div className="py-3 border-b border-slate-100 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shrink-0 text-sm">
          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-slate-900 truncate">
            {student.name}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{student.email || `${student.rollNo.toLowerCase()}@univ.edu`}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{student.phone || '+1 (555) 382-9102'}</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs inside card: Attendance | History | Notes */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pt-2.5 pb-2">
        <button className="text-slate-900 border-b-2 border-slate-900 pb-2 -mb-2">
          Academic Standing
        </button>
        <button className="hover:text-slate-800">
          Course Log
        </button>
        <button className="hover:text-slate-800">
          Advisories
        </button>
      </div>

      {/* Stats Breakdown */}
      <div className="py-3.5 space-y-3">
        {/* Attendance Percentage progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Cumulative Rate</span>
            <span className={`font-mono font-bold ${isDefaulter ? 'text-rose-600' : 'text-slate-900'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${isDefaulter ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>

        {/* Turnout summary item (like items list in reference) */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Lectures Attended:</span>
            <span className="font-semibold text-slate-800">{effectiveAttended}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Conducted:</span>
            <span className="font-semibold text-slate-800">{effectiveTotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Current Status:</span>
            <span className={`font-semibold ${isPresent ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPresent ? 'Marked Present' : 'Marked Absent'}
            </span>
          </div>
        </div>

        {/* Shortage or Buffer Guidance */}
        <div className={`p-3 rounded-xl border text-xs ${
          isDefaulter
            ? 'bg-rose-50/70 border-rose-200/80 text-rose-800'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800'
        }`}>
          {isDefaulter ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Shortage Alert: </span>
                Must attend next <strong>{recoveryClasses} lectures</strong> consecutively to reach 75%.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Eligible: </span>
                Buffer intact. Safe margin is {safeMissable} class{safeMissable === 1 ? '' : 'es'}.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions (like Export | Duplicate | Print in Mate) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus(student.id, isPresent ? 'ABSENT' : 'PRESENT')}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
            isPresent
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          {isPresent ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
          {isPresent ? 'Toggle Absent' : 'Toggle Present'}
        </button>

        <span className="font-mono text-slate-400 text-[11px]">
          ID: {student.id}
        </span>
      </div>
    </div>
  );
}
