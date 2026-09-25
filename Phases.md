# Development Roadmap & Release Phases
## College Attendance Management System (CAMS)

---

### Project Timeline Overview

```
+-------------------------------------------------------------------------------+
|  Phase 1: Foundation, Design System & Bento Layout Grid                        |
|  - Setup Vite + React + Tailwind + Brutalist Tokens                           |
|  - Global Shell, Header, Role Switcher, Overview Metric Bento                 |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  Phase 2: Interactive Daily Roll Call & Live Attendance Engine                 |
|  - Student Roster Grid, Status Toggles (P/A/L/E), Keyboard Shortcuts           |
|  - Batch Marking ("Mark All Present"), Real-Time Count Synchronization         |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  Phase 3: Real-Time Analytics & < 75% Statutory Warning Engine                |
|  - Deficit Calculator ("Classes to reach 75%"), Filterable Defaulter Roster   |
|  - Cross-Course Summary & High-Contrast Alert Banners                         |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  Phase 4: Export Utilities, UI Polish & Micro-Interactions                     |
|  - CSV/Print Export Modals, Tactile Sound/Click Animation Tweaks              |
|  - Audit Log Viewer, Mobile Responsiveness Hardening                          |
+-------------------------------------------------------------------------------+
```

---

### Phase 1: Foundation, Design System & Bento Layout Grid
**Objective:** Establish core development infrastructure, configure the Minimal Brutalist theme tokens, and construct the responsive executive Bento dashboard.

- **Milestone 1.1: Environment Initialization**
  - Setup Vite + React + Tailwind CSS with customized font declarations (`Inter` / `JetBrains Mono`).
  - Configure `tailwind.config.js` with bespoke hard-shadow utilities (`brutal`, `brutal-sm`, `brutal-lg`).
- **Milestone 1.2: Core Design System Primitives**
  - Implement `<BrutalButton>`, `<BrutalCard>`, `<BrutalBadge>`, and typographic headers.
- **Milestone 1.3: Application Shell & Bento Grid Structure**
  - Construct header with real-time academic calendar date, semester indicator, and user persona switcher (`Faculty` / `Student` / `Admin`).
  - Assemble primary Bento layout displaying:
    - **Total Cohort Size**
    - **Current Aggregate Attendance %**
    - **Active Defaulters Count (< 75%)**
    - **Recent Session Summary**

---

### Phase 2: Interactive Daily Roll Call & Live Attendance Engine
**Objective:** Provide faculty with an ultra-efficient, tactile roll call interface capable of logging attendance in under 60 seconds.

- **Milestone 2.1: Student Roster Grid**
  - Implement `<RollCallGrid>` with search filtering (by Roll No, Name, or Status).
  - Design `<AttendanceRow>` featuring instant tactile status buttons:
    - `[P] Present` (Green / Black invert)
    - `[A] Absent` (Red / White border)
    - `[L] Late` (Amber)
    - `[E] Excused` (Blue tint)
- **Milestone 2.2: Keyboard & Batch Operations**
  - Add hotkeys: `P` for present, `A` for absent, `ArrowDown` to advance to next student.
  - Quick action toolbar: "Mark All Present", "Clear All", "Invert Attendance".
- **Milestone 2.3: State Store & Session Persistence**
  - Build `AttendanceContext` with LocalStorage automatic syncing.
  - Append every save action to an auditable session history log.

---

### Phase 3: Real-Time Analytics & < 75% Statutory Warning Engine
**Objective:** Enforce compliance through algorithmic deficit analysis and prominent warning surfaces.

- **Milestone 3.1: Automated Threshold Detection**
  - Real-time evaluation of student percentage across enrolled courses.
  - Dynamic classification into *Compliant* ($\ge 85\%$), *Borderline* ($75-84.9\%$), and *Critical Defaulter* ($< 75\%$).
- **Milestone 3.2: Deficit Recovery Engine & Student View**
  - Integrate recovery formula: calculate exact number of consecutive classes required to restore eligibility.
  - Implement Student Persona view: individual course breakdown cards displaying deficit warnings and recovery roadmaps.
- **Milestone 3.3: Departmental Defaulter Center (Admin View)**
  - Tabular breakdown of at-risk students with one-click filtering.
  - Action to simulate sending official debarment warnings or flagging for academic advising.

---

### Phase 4: UI Polish, Data Export & Production Hardening
**Objective:** Perfect the tactile editorial aesthetic, finalize data export capabilities, and guarantee flawless usability across all screen sizes.

- **Milestone 4.1: Export & Reporting Engine**
  - Export current session roster and aggregate defaulters to CSV.
  - Clean print stylesheet for generating physical examination eligibility rosters.
- **Milestone 4.2: Micro-Interactions & Brutalist Polish**
  - Perfect the `:active` translate-and-shadow-collapse micro-interactions.
  - High-contrast marquee/ticker for critical campus attendance bulletins.
- **Milestone 4.3: Cross-Device Responsiveness & Verification**
  - Test and verify UI on standard desktop (1920x1080), laptop (1366x768), tablet, and mobile breakpoints.
  - Final QA check against all rules defined in [Rules.md](file:///c:/Users/acer/OneDrive/Desktop/attendence/Rules.md).
