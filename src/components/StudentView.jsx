import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Bell,
  Mail,
  ShieldCheck,
  Globe,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export default function StudentView({ student }) {
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS-602');

  const effectiveAttended = student.todayStatus === 'PRESENT'
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

  // Student Courses Catalog (like "My Courses" in the Ace Academy reference)
  const courses = [
    {
      code: 'CS-602',
      name: 'Advanced Distributed Systems',
      faculty: 'Prof. R. Vance',
      attended: effectiveAttended,
      total: effectiveTotal,
      percentage: percentage,
      accent: 'blue',
      lessonsLeft: 8,
      status: isDefaulter ? 'Warning' : 'Compliant',
      icon: 'globe'
    },
    {
      code: 'CS-604',
      name: 'Cloud Computing & DevOps',
      faculty: 'Prof. Linda Cruz',
      attended: 45,
      total: 50,
      percentage: 90.0,
      accent: 'purple',
      lessonsLeft: 6,
      status: 'Compliant',
      icon: 'clipboard'
    },
    {
      code: 'CS-606',
      name: 'Network Security & Cryptography',
      faculty: 'Prof. Jonathan Reyes',
      attended: 41,
      total: 48,
      percentage: 85.4,
      accent: 'amber',
      lessonsLeft: 7,
      status: 'Compliant',
      icon: 'megaphone'
    }
  ];

  // Calendar days setup (like December mini calendar in Ace Academy reference)
  const calendarDays = [
    { day: 1, current: false }, { day: 2, current: false }, { day: 3, current: false }, { day: 4, current: false },
    { day: 5, current: false }, { day: 6, current: false }, { day: 7, current: false }, { day: 8, current: false },
    { day: 9, current: false }, { day: 10, current: false }, { day: 11, active: true }, { day: 12, current: false },
    { day: 13, current: false }, { day: 14, current: false }, { day: 15, current: false }, { day: 16, highlighted: true },
    { day: 17, current: false }, { day: 18, current: false }, { day: 19, highlighted: true }, { day: 20, current: false },
    { day: 21, current: false }, { day: 22, current: false }, { day: 23, current: false }, { day: 24, current: false },
    { day: 25, current: false }, { day: 26, current: false }, { day: 27, current: false }, { day: 28, current: false },
    { day: 29, current: false }, { day: 30, current: false }, { day: 31, current: false }
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Student Experience layout matching Ace Academy */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column: Hero Welcome Banner + My Courses Cards + Academic Certifications */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* 1. Large Blue Welcome Banner (like "Welcome back, Diane!" in reference) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white p-7 sm:p-8 shadow-lg shadow-indigo-600/15">
            <div className="relative z-10 max-w-md">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
                Friday, September 25 • Semester VI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-white">
                Welcome back, {student.name.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 font-medium leading-relaxed">
                {isDefaulter
                  ? `Your current attendance is ${percentage}%. You need ${recoveryClasses} consecutive attended classes to restore statutory exam eligibility.`
                  : `You've achieved ${percentage}% cumulative attendance, well above the 75% examination threshold!`}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20">
                <span className={`w-2 h-2 rounded-full ${isDefaulter ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span>
                  Today's Session: {student.todayStatus === 'PRESENT' ? 'Marked Present' : 'Marked Absent'}
                </span>
              </div>
            </div>

            {/* 3D Graduation Cap Decorative Graphic */}
            <div className="absolute right-4 -bottom-3 sm:bottom-0 opacity-80 sm:opacity-100 pointer-events-none">
              <div className="w-36 h-36 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs">
                <GraduationCap className="w-20 h-20 text-white/90 transform -rotate-12" />
              </div>
            </div>
          </div>

          {/* 2. Subjects Section (like the 3 colorful course cards in Ace Academy) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Subjects &amp; Attendance
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                3 Enrolled Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {courses.map(course => {
                const isSelected = selectedCourseCode === course.code;
                const isUnder = course.percentage < 75.0;

                return (
                  <div
                    key={course.code}
                    onClick={() => setSelectedCourseCode(course.code)}
                    className={`cursor-pointer rounded-2xl p-5 transition-all flex flex-col justify-between border bg-white ${
                      isSelected
                        ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                        : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Icon Container in 3D pastel style */}
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
                        {course.icon === 'globe' && <Globe className="w-7 h-7" />}
                        {course.icon === 'clipboard' && <FileText className="w-7 h-7 text-purple-600" />}
                        {course.icon === 'megaphone' && <Radio className="w-7 h-7 text-amber-600" />}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {course.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {course.faculty}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400 text-[11px]">
                          {course.attended}/{course.total} classes
                        </span>
                        <span className={`font-mono font-bold text-xs ${isUnder ? 'text-rose-600' : 'text-slate-900'}`}>
                          {course.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUnder ? 'bg-rose-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, course.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Achievements & Statutory Certificates (like Achievements in Ace Academy reference) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Certificates & Standing
              </h3>
              <span className="text-xs font-semibold text-slate-500">Academic Records</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Attendance Clearance Notice */}
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Statutory Compliance
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">
                    Semester Exam Hall Ticket
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isDefaulter ? 'Pending clearance (< 75%)' : 'Verified & Eligible for Exams'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Academic Statement */}
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Official Record
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">
                    Attendance Transcript
                  </h4>
                  <p className="text-xs text-slate-500">
                    Signed by Department of CS
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Shortage Alert Banner (If Applicable) */}
          {isDefaulter && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs leading-relaxed text-rose-800">
                <h4 className="font-bold text-sm text-rose-900">
                  Official Attendance Shortage Advisory
                </h4>
                <p className="mt-1">
                  Your aggregate attendance in <strong>CS-602</strong> is currently <strong>{percentage}%</strong> (under the mandatory 75.0% threshold).
                  You must attend the next <strong>{recoveryClasses} consecutive lectures</strong> without absence to regain eligibility for semester end examinations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: "My Schedule" Mini Calendar + "Upcoming Tasks" (Directly from Ace Academy reference) */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          {/* 1. My Schedule Calendar Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                My Schedule
              </h3>
              <span className="text-xs font-semibold text-slate-500">September 2026</span>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Calendar Numbers Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((item, idx) => {
                const isToday = item.day === 25;
                const isSelected = item.active;

                return (
                  <div
                    key={idx}
                    className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      isSelected || isToday
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : item.highlighted
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>

            {/* Today's Schedule Time Slot */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                10:30 AM – 11:45 AM
              </span>
              <span className="font-mono text-slate-400">Hall 4B</span>
            </div>
          </div>

          {/* 2. Upcoming Tasks / Lecture Sessions (like "Upcoming Tasks" in Ace Academy) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                Upcoming Lectures
              </h3>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                See All
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Task 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-800 block">
                      Consensus Protocols
                    </span>
                    <span className="text-[10px] text-slate-400">CS-602 • Hall 4B</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-800 block">
                      Kubernetes Pod Networking
                    </span>
                    <span className="text-[10px] text-slate-400">CS-604 • Lab 2</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-800 block">
                      Mid-Term Review Session
                    </span>
                    <span className="text-[10px] text-slate-400">CS-606 • Seminar Room</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
