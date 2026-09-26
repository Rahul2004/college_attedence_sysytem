import React, { useState, useEffect, useCallback } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import MateSidebar from './components/MateSidebar';
import OrdersTableRoster from './components/OrdersTableRoster';
import StudentDetailCard from './components/StudentDetailCard';
import RightMetricsPanel from './components/RightMetricsPanel';
import StudentView from './components/StudentView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import WarningDeficitEngine from './components/WarningDeficitEngine';
import ExportReporting from './components/ExportReporting';
import AdminDashboard from './components/AdminDashboard';
import AuthScreen from './components/AuthScreen';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { INITIAL_STUDENTS, COURSE_METADATA } from './data/mockData';

// Protected Admin Route wrapper that enforces admin privileges
function AdminRoute({ role, children }) {
  if (role !== 'admin') {
    return (
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-8 text-center text-slate-300">
        <h2 className="text-base font-bold text-rose-400 mb-2">403 — Unauthorized Administrative Access</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          You do not possess the required clearance level to access the Institutional Admin Suite.
        </p>
      </div>
    );
  }
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('faculty');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roster');
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [toast, setToast] = useState({ type: null, message: '' });
  const [isCommitting, setIsCommitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeDetailStudent, setActiveDetailStudent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer open/close
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Desktop expanded (w-64) vs compact (w-18)

  // Supabase Auth Listener with Role Resolution
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const resolveRoleAndSetSession = async (currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setLoading(true);
        let resolvedRole = null;
        try {
          // 1. Strictly query public.profiles using .single()
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();

          if (!error && profile?.role) {
            resolvedRole = profile.role;
          }
        } catch {
          // Fallback handled below
        }

        // Fallback to user metadata if profile table is not synced yet
        if (!resolvedRole) {
          resolvedRole = currentSession.user.user_metadata?.role || 'student';
        }

        // 2. Strict Conditional Routing
        setRole(resolvedRole);
        setActiveTab(resolvedRole === 'admin' ? 'admin' : resolvedRole === 'faculty' ? 'roster' : 'overview');
        setLoading(false);
      } else {
        setSession(null);
        setRole('student');
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      resolveRoleAndSetSession(sess);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        resolveRoleAndSetSession(data.session);
      } else {
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setStudents(INITIAL_STUDENTS);
        if (INITIAL_STUDENTS.length > 0) setActiveDetailStudent(INITIAL_STUDENTS[0]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.from('students').select('*').order('name');
        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map(s => ({
            id: s.id,
            rollNo: s.roll_number,
            name: s.name,
            email: s.email || `${s.roll_number.toLowerCase()}@univ.edu`,
            phone: s.phone || '+1 (555) 382-9102',
            department: s.department || 'Computer Science',
            attendedClasses: s.attended_classes,
            totalClasses: s.total_classes,
            todayStatus: s.today_status || 'ABSENT',
          }));
          setStudents(formatted);
          setActiveDetailStudent(formatted[0]);
        } else {
          setStudents(INITIAL_STUDENTS);
          setActiveDetailStudent(INITIAL_STUDENTS[0]);
        }
      } catch {
        setStudents(INITIAL_STUDENTS);
        setActiveDetailStudent(INITIAL_STUDENTS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleToggleStatus = useCallback((studentId, newStatus) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === studentId ? { ...s, todayStatus: newStatus } : s);
      setPendingChanges(old => new Set(old).add(studentId));
      return updated;
    });

    setActiveDetailStudent(prev => prev && prev.id === studentId ? { ...prev, todayStatus: newStatus } : prev);
  }, []);

  const handleMarkAll = useCallback((status) => {
    setStudents(prev => {
      const updated = prev.map(s => ({ ...s, todayStatus: status }));
      setPendingChanges(new Set(prev.map(s => s.id)));
      return updated;
    });
  }, []);

  const handleCommit = async () => {
    if (!supabase || pendingChanges.size === 0) return;
    setIsCommitting(true);
    try {
      const logRows = students
        .filter(s => pendingChanges.has(s.id))
        .map(s => ({
          roll_number: s.rollNo,
          date: selectedDate,
          status: s.todayStatus === 'PRESENT' ? 'Present' : 'Absent',
        }));

      const { error: logError } = await supabase
        .from('attendance_logs')
        .upsert(logRows, { onConflict: 'roll_number,date' });
      if (logError) throw logError;

      const updates = students
        .filter(s => pendingChanges.has(s.id))
        .map(s => {
          const newAttended = s.todayStatus === 'PRESENT' ? s.attendedClasses + 1 : s.attendedClasses;
          const newTotal = s.totalClasses + 1;
          const newPct = Math.round((newAttended / newTotal) * 10000) / 100;
          return {
            id: s.id,
            roll_number: s.rollNo,
            name: s.name,
            department: s.department || 'Computer Science',
            semester: 'Semester VI — Spring 2026',
            total_classes: newTotal,
            attended_classes: newAttended,
            attendance_percentage: newPct,
            today_status: s.todayStatus,
            status: s.todayStatus,
            updated_at: new Date().toISOString(),
          };
        });

      const { error: upsertError } = await supabase.from('students').upsert(updates);
      if (upsertError) throw upsertError;

      setPendingChanges(new Set());
      setToast({ type: 'success', message: 'Attendance records synchronized to cloud database.' });
    } catch {
      setToast({ type: 'error', message: 'Failed to save attendance session. Please check permissions.' });
    } finally {
      setIsCommitting(false);
      setTimeout(() => setToast({ type: null, message: '' }), 4000);
    }
  };

  const lowWarningCount = students.filter(s => {
    const attended = s.todayStatus === 'PRESENT' ? s.attendedClasses + 1 : s.attendedClasses;
    return ((attended / (s.totalClasses + 1)) * 100) < 75.0;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading Academic Suite...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthScreen
        onLogin={(userRole) => {
          setRole(userRole || 'student');
          if (supabase) {
            supabase.auth.getSession().then(({ data }) => {
              if (data?.session) setSession(data.session);
            });
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans flex text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 1. Left Dark Sidebar */}
      <MateSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        lowWarningCount={lowWarningCount}
        course={COURSE_METADATA}
        role={role}
        currentStudent={students[0] || INITIAL_STUDENTS[0]}
        session={session}
        isSidebarOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(prev => !prev)}
        onLogout={async () => {
          try {
            if (supabase) {
              await supabase.auth.signOut();
            }
          } catch {
            // Teardown state unconditionally
          } finally {
            // Complete state isolation and teardown
            setSession(null);
            setRole('student');
            setPendingChanges(new Set());
            setActiveDetailStudent(null);
            setActiveTab('roster');
            setIsSidebarOpen(false);
          }
        }}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full transition-all duration-300">
        <header className="h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {/* Mobile Hamburger Toggle Button (☰) */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="md:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarExpanded(prev => !prev)}
              className="hidden md:flex p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors items-center justify-center"
              title={isSidebarExpanded ? "Collapse Sidebar (Compact mode)" : "Expand Sidebar (Full width)"}
              aria-label="Toggle Sidebar Expansion"
            >
              {isSidebarExpanded ? (
                <PanelLeftClose className="w-4.5 h-4.5 text-slate-600 hover:text-slate-900" />
              ) : (
                <PanelLeftOpen className="w-4.5 h-4.5 text-indigo-600 hover:text-indigo-700" />
              )}
            </button>

            <span className="font-semibold text-slate-800">{COURSE_METADATA.code}</span>
            <span className="hidden sm:inline">/</span>
            <span className="hidden sm:inline truncate max-w-[180px] md:max-w-none">{COURSE_METADATA.name}</span>
            <span className="hidden md:inline">/</span>
            <span className="text-slate-400 font-mono hidden md:inline">{COURSE_METADATA.room}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border border-amber-200/80'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="hidden xs:inline">{isSupabaseConfigured ? 'Cloud DB' : 'Local Demo'}</span>
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium">Spring 2026</span>
          </div>
        </header>

        {toast.message && (
          <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-5 md:px-8 mt-3.5">
            <div className={`rounded-xl px-4 py-3 text-xs font-semibold shadow-xs border ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                : 'bg-rose-50 text-rose-800 border-rose-200/80'
            }`}>
              {toast.message}
            </div>
          </div>
        )}

        <main className="p-3.5 sm:p-5 md:p-8 flex-1 w-full max-w-7xl mx-auto">
          {role === 'admin' ? (
            /* ================= ADMIN ROLE VIEWS ================= */
            <>
              {activeTab === 'admin' && (
                <AdminRoute role={role}>
                  <AdminDashboard currentSession={session} />
                </AdminRoute>
              )}

              {activeTab === 'roster' && (
                <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
                  <div className="flex-1 min-w-0 relative w-full">
                    <OrdersTableRoster
                      students={students}
                      onToggleStatus={handleToggleStatus}
                      onMarkAll={handleMarkAll}
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                      onCommit={handleCommit}
                      isCommitting={isCommitting}
                      hasPendingChanges={pendingChanges.size > 0}
                      onSelectStudentDetail={setActiveDetailStudent}
                      activeDetailStudent={activeDetailStudent}
                    />

                    {activeDetailStudent && (
                      <div className="fixed top-24 right-8 z-40 w-80 hidden 2xl:block">
                        <StudentDetailCard
                          student={activeDetailStudent}
                          onClose={() => setActiveDetailStudent(null)}
                          onToggleStatus={handleToggleStatus}
                        />
                      </div>
                    )}
                  </div>

                  <RightMetricsPanel
                    students={students}
                    course={COURSE_METADATA}
                    onSelectDefaulterFilter={() => setActiveTab('warnings')}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="w-full">
                  <AnalyticsDashboard />
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="w-full">
                  <WarningDeficitEngine students={students} />
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="w-full">
                  <ExportReporting students={students} course={COURSE_METADATA} />
                </div>
              )}
            </>
          ) : role === 'faculty' ? (
            /* ================= FACULTY ROLE VIEWS ================= */
            <>
              {activeTab === 'roster' && (
                <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
                  <div className="flex-1 min-w-0 relative w-full">
                    <OrdersTableRoster
                      students={students}
                      onToggleStatus={handleToggleStatus}
                      onMarkAll={handleMarkAll}
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                      onCommit={handleCommit}
                      isCommitting={isCommitting}
                      hasPendingChanges={pendingChanges.size > 0}
                      onSelectStudentDetail={setActiveDetailStudent}
                      activeDetailStudent={activeDetailStudent}
                    />

                    {activeDetailStudent && (
                      <div className="fixed top-24 right-8 z-40 w-80 hidden 2xl:block">
                        <StudentDetailCard
                          student={activeDetailStudent}
                          onClose={() => setActiveDetailStudent(null)}
                          onToggleStatus={handleToggleStatus}
                        />
                      </div>
                    )}
                  </div>

                  <RightMetricsPanel
                    students={students}
                    course={COURSE_METADATA}
                    onSelectDefaulterFilter={() => setActiveTab('warnings')}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="w-full">
                  <AnalyticsDashboard />
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="w-full">
                  <WarningDeficitEngine students={students} />
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="w-full">
                  <ExportReporting students={students} course={COURSE_METADATA} />
                </div>
              )}
            </>
          ) : (
            /* ================= STUDENT ROLE VIEWS ================= */
            <div className="w-full">
              <StudentView
                student={students[0] || INITIAL_STUDENTS[0]}
                activeTab={activeTab}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
