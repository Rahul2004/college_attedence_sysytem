import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldAlert,
  Download,
  Calendar,
  BookOpen,
  FileText,
  Award,
  Layers,
  GraduationCap,
  X
} from 'lucide-react';

export default function MateSidebar({
  activeTab,
  onTabChange,
  lowWarningCount,
  course,
  role,
  currentStudent,
  session,
  onLogout,
  isSidebarOpen = false,
  onMobileClose
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container: static on md+, fixed drawer on mobile */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 md:w-56 shrink-0 bg-slate-950 text-slate-300
        flex flex-col justify-between py-5 px-3 min-h-screen border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Header: Academia */}
          <div className="flex items-center justify-between px-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block leading-none">
                  Academia
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  {role === 'student' ? 'Student Workspace' : 'Faculty Operations'}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Dynamic Context Header */}
        <div className="px-2">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-400">
            <span className="text-[11px] truncate">
              {role === 'student' ? `Roll: ${currentStudent?.rollNo || 'CS-401'}` : `⌘ Course: ${course.code}`}
            </span>
          </div>
        </div>

        {/* Navigation Menu: Conditionally changes based on Faculty vs Student role */}
        <nav className="space-y-1 px-1">
          {role === 'faculty' ? (
            /* ================= FACULTY NAVIGATION ================= */
            <>
              <button
                type="button"
                onClick={() => onTabChange('roster')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'roster'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 ${activeTab === 'roster' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>Students Roster</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('analytics')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>Analytics & Trends</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('warnings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'warnings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={`w-4 h-4 ${activeTab === 'warnings' ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>Shortage Alerts</span>
                </div>
                {lowWarningCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {lowWarningCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onTabChange('reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'reports'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Download className={`w-4 h-4 ${activeTab === 'reports' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>Export Reports</span>
                </div>
              </button>
            </>
          ) : (
            /* ================= STUDENT NAVIGATION (Ace Academy Style) ================= */
            <>
              <button
                type="button"
                onClick={() => onTabChange('overview')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>My Overview</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('courses')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>Subjects</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('schedule')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className={`w-4 h-4 ${activeTab === 'schedule' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>Class Schedule</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('leave')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'leave'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${activeTab === 'leave' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>Leave & Excuses</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('certificates')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'certificates'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>Hall Ticket &amp; Certs</span>
                </div>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="space-y-4 pt-4 border-t border-slate-900 px-2">
        {/* Verified Database Role Badge */}
        <div className="py-1 px-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-semibold flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Access Level</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            role === 'faculty'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
          }`}>
            {role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
          </span>
        </div>

        {/* Dynamic User Profile Card */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700 shrink-0">
            {role === 'student' 
              ? (currentStudent?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'AW')
              : 'RV'
            }
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-white block truncate">
              {role === 'student' ? (currentStudent?.name || 'Alexander Wright') : 'Prof. R. Vance'}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {role === 'student' ? `${currentStudent?.rollNo || 'CS-401'} • 2nd Year` : 'Department Chair'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onLogout?.()}
          className="w-full text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 px-2 py-1 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
