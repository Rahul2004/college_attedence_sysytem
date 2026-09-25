# Technical System Architecture
## College Attendance Management System (CAMS)

---

### 1. Technology Stack Architecture

| Layer | Technology | Version / Spec | Justification |
| :--- | :--- | :--- | :--- |
| **Bundler & Tooling** | Vite | ^5.x / Latest | Lightning-fast HMR, lightweight dev server, zero-overhead static production build. |
| **Core UI Framework** | React | ^18.3.x | Declarative component model, Concurrent Mode, clean hook abstractions for state isolation. |
| **Styling Engine** | Tailwind CSS | v3.4 / v4 compatible | Utility-first CSS configured with custom neo-brutalist theme tokens, deterministic CSS generation. |
| **Iconography** | Lucide React | Latest | Crisp, geometrically balanced 1.75px–2px stroke vector icons matching editorial brutalism. |
| **Persistence Layer** | LocalStorage API | HTML5 Web Storage | Resilient offline-first mock persistence with schema migration wrappers. |
| **Type Safety & Contracts**| TypeScript | ^5.x (or Strict JSDoc) | Compile-time validation of attendance records, audit logs, and persona permissions. |

---

### 2. Component Hierarchy & Module Topology

```
src/
├── app/
│   ├── App.jsx / App.tsx         # Root container & view dispatcher
│   └── main.jsx / main.tsx       # Vite bootstrap entrypoint
├── components/
│   ├── common/
│   │   ├── BrutalButton.jsx      # 2px border, tactile hard-shadow button
│   │   ├── BrutalCard.jsx        # Bento container with custom border & shadow tokens
│   │   ├── BrutalBadge.jsx       # High-contrast status badges (Present/Absent/Warning)
│   │   └── Modal.jsx             # Minimalist overlay modal for session overrides
│   ├── layout/
│   │   ├── Header.jsx            # System ticker, current academic date, persona switcher
│   │   ├── Sidebar.jsx           # Monospaced navigation & section index
│   │   └── BentoGrid.jsx         # Modular grid shell conforming to responsive bento specs
│   ├── dashboard/
│   │   ├── MetricTile.jsx        # Aggregate stats (Total Cohort, Avg Attendance %, Defaulters)
│   │   ├── WarningTicker.jsx     # Live stream of students breaching the 75% boundary
│   │   └── QuickActions.jsx      # Start roll call, batch export, emergency notice
│   ├── attendance/
│   │   ├── RollCallGrid.jsx      # High-speed row-based roster with keyboard toggles
│   │   ├── AttendanceRow.jsx     # Individual student row with status buttons & streak chips
│   │   ├── AttendanceStats.jsx   # Live session counter (Present: 48 | Absent: 12)
│   │   └── DeficitCalculator.jsx # Mathematical projection tool for target attendance
│   └── analytics/
│       ├── AttendanceChart.jsx   # Custom CSS / SVG bar distribution
│       └── DefaulterTable.jsx    # Filterable list of students under threshold
├── context/
│   └── AttendanceContext.jsx     # Centralized dispatch store for attendance data
├── hooks/
│   ├── useAttendance.js          # Encapsulates session marking, stats computation
│   ├── useThresholdAlerts.js     # Real-time alert triggers for records < 75%
│   └── useLocalStorage.js        # Automatic synchronization with browser storage
├── data/
│   └── mockData.js               # Initial seeding: students, courses, historical logs
└── styles/
    └── index.css                 # Base resets, theme tokens, border & tactile shadow utilities
```

---

### 3. State Management & Data Flow Architecture

#### 3.1. Unified State Flow Diagram
```
                     +----------------------------+
                     |    User Action Event       |
                     | (Click / Keyboard Shortcut)|
                     +--------------+-------------+
                                    |
                                    v
                     +----------------------------+
                     |  AttendanceContext Dispatch|
                     |  Action: TOGGLE_ATTENDANCE |
                     +--------------+-------------+
                                    |
         +--------------------------+--------------------------+
         |                                                     |
         v                                                     v
+-------------------------------+             +-------------------------------+
|  Pure Calculation Engine     |             |  Persistence Subsystem        |
|  - Recompute Present/Absent   |             |  - Sync to LocalStorage       |
|  - Recompute Subject Rate (%) |             |  - Append Audit Trail Entry   |
|  - Evaluate Threshold Alert   |             +-------------------------------+
+---------------+---------------+
                |
                v
+-------------------------------+
| Reactive UI Rerender          |
| - Bento metric cards          |
| - Deficit counter             |
| - High-contrast badges        |
+-------------------------------+
```

#### 3.2. Data Models & Schemas

##### Student Record Entity
```typescript
interface Student {
  id: string;               // e.g., "STU-2026-081"
  rollNo: string;           // e.g., "CS-401"
  name: string;             // e.g., "Alexander Wright"
  avatarUrl?: string;       // Monochromatic/High-contrast avatar
  department: string;       // e.g., "Computer Science & Engineering"
  semester: number;         // e.g., 6
  section: string;          // e.g., "Section A"
  email: string;            // e.g., "a.wright@college.edu"
}
```

##### Session Attendance Record Entity
```typescript
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceRecord {
  id: string;               // Unique session record UUID
  studentId: string;        // Reference to Student.id
  courseCode: string;       // e.g., "CS602 - Operating Systems"
  date: string;             // ISO Date (YYYY-MM-DD)
  timeSlot: string;         // e.g., "09:00 - 10:00 AM"
  status: AttendanceStatus;
  markedBy: string;         // Faculty ID
  timestamp: string;        // Precise ISO timestamp
  remarks?: string;         // Required for 'EXCUSED' overrides
}
```

##### Aggregate Subject Metric
```typescript
interface SubjectAggregate {
  courseCode: string;
  courseName: string;
  conductedLectures: number;
  attendedLectures: number;
  excusedLectures: number;
  percentage: number;       // Calculated float (e.g., 73.4)
  isDefaulter: boolean;     // percentage < 75.0
  recoveryClasses: number;  // Consecutive classes needed to reach 75%
}
```

---

### 4. Real-time Calculation & Warning Engine

The calculation engine uses pure functions to guarantee instantaneous deterministic results:

```javascript
export function calculateAttendanceMetrics(attended, total, excused = 0, weight = 1.0) {
  if (!total || total === 0) return { percentage: 0, isDefaulter: true, recoveryNeeded: 0 };
  
  const effectiveAttended = attended + (excused * weight);
  const percentage = Number(((effectiveAttended / total) * 100).toFixed(1));
  const isDefaulter = percentage < 75.0;
  
  // To reach 75%: (effectiveAttended + X) / (total + X) >= 0.75
  // effectiveAttended + X >= 0.75 * total + 0.75 * X
  // 0.25 * X >= 0.75 * total - effectiveAttended
  // X >= 3 * total - 4 * effectiveAttended
  const recoveryNeeded = isDefaulter 
    ? Math.max(0, Math.ceil((0.75 * total - effectiveAttended) / 0.25)) 
    : 0;

  return {
    percentage,
    isDefaulter,
    recoveryNeeded
  };
}
```

---

### 5. Deployment & Production Build Pipeline
- Build Command: `vite build` $\rightarrow$ outputs optimized, chunked assets to `/dist`.
- Asset Target: ES2022 modern browsers.
- Zero external runtime server dependencies required for core demo/evaluation.
