# Product Requirements Document (PRD)
## College Attendance Management System (CAMS)

---

### 1. Executive Summary & Vision
The **College Attendance Management System (CAMS)** is an enterprise-grade academic operations platform designed to eliminate manual tracking inefficiencies, paper-register leakages, and delayed compliance auditing in higher education institutions. By standardizing attendance collection, automating statutory threshold alerts (<75% mandate), and offering role-tailored operational dashboards, CAMS acts as the single source of truth for institutional attendance metrics.

---

### 2. Core Problem Statements
1. **Manual Record Fragility & Human Error:**
   - Traditional paper registers and manual spreadsheet reconciliations produce high error rates (proxy entries, miscounted percentages, loss of physical documents).
2. **Delayed Compliance Visibility:**
   - Under regulatory standards (e.g., UGC / AICTE / University mandates), students falling below 75% attendance are ineligible for term examinations. Legacy workflows identify defaulters only weeks before exams, leaving no remediation window.
3. **Information Asymmetry:**
   - Faculty spend 10–15% of instructional time taking roll and compiling reports.
   - Students lack real-time visibility into their status and the exact count of classes needed to reach eligibility.
   - Deans and Department Chairs lack instantaneous cross-department aggregate metrics to intervene with faculty or students.

---

### 3. User Personas & Permissions Matrix

| Persona | Core Responsibilities | Key Capabilities | Permission Level |
| :--- | :--- | :--- | :--- |
| **Faculty / Instructor** | Lecture-level roll call, subject attendance logging, leave justification review. | Mark individual/bulk attendance, toggle status (Present / Absent / Late / Excused), generate session exports. | `ROLE_FACULTY` |
| **Student** | Self-monitoring, deficit calculation, warning acknowledgment. | View personal subject-wise percentages, projected attendance calculator ("classes required to hit 75%"), download attendance statement. | `ROLE_STUDENT` |
| **Department Admin / HOD** | Compliance oversight, course-wide timetable mapping, audit logging. | Cross-subject deficit analytics, issue automated warning notices, override attendance with auditable reason. | `ROLE_ADMIN` |

---

### 4. Functional Requirements

#### 4.1. Roll Call & Session Logging Engine
- **Session Setup:** Auto-generates daily lecture slots based on course schedule (Date, Slot, Subject Code, Section).
- **Interactive Marking Grid:** Fast keyboard-accessible and tap-optimized roster with states:
  - `P` (Present - 1.0)
  - `A` (Absent - 0.0)
  - `L` (Late - 0.5 or custom institutional factor)
  - `E` (Excused / Medical Leave - excluded or credited based on policy)
- **Batch Actions:** "Mark All Present", "Invert Selection", and undo stack with 10-minute audit leeway.

#### 4.2. Automated Statutory Threshold Alert System (< 75% Warning Engine)
- **Eligibility Metric Formula:**
  $$\text{Attendance Rate (\%)} = \left(\frac{\text{Classes Attended} + (\text{Excused} \times \text{Weight})}{\text{Total Conducted Classes}}\right) \times 100$$
- **Threshold Tiers:**
  - **Optimal (Green / Neutral High):** $\ge 85\%$
  - **Warning Zone (Amber):** $75.0\% \le x < 84.9\%$
  - **Critical Deficit Zone (Red / High Contrast Alert):** $< 75.0\%$ (Barred from Semester Examination)
- **Deficit Recovery Engine:**
  - Computes the minimum consecutive future classes $C_{req}$ a student must attend to reach $75\%$:
    $$C_{req} = \max\left(0, \lceil 3 \times \text{Total Absent} - \text{Total Present} \rceil\right)$$
  - Directly informs students: *"You must attend the next $N$ consecutive classes without absence to achieve 75%."*

#### 4.3. Analytics & Administrative Reporting
- Class-level and cohort-level distribution histograms.
- One-click export formats: CSV, PDF Attendance Roster, and Dean's Weekly Defaulter Summary.
- Comprehensive immutable audit trail logging who marked, updated, or overrode attendance with timestamps.

---

### 5. Non-Functional Requirements
- **Performance:** Sub-100ms client-side calculations for cohorts up to 500 students per batch.
- **Reliability & Offline Tolerance:** Optimistic client state caching with LocalStorage persistence to prevent data loss during campus network interruptions.
- **Accessibility:** High contrast ratios (WCAG AAA compliance), full keyboard traversal (`Tab`, `Space`, `Enter`, Arrow keys for rapid attendance marking).
- **Security & Integrity:** Tamper-evident log entries, strict RBAC authorization boundaries.

---

### 6. Success Metrics & Key Performance Indicators (KPIs)
- **Roll Call Duration:** Under 60 seconds for a standard 60-student class.
- **Notification Latency:** Real-time percentage update immediately upon session submission.
- **Defaulter Resolution:** 40% reduction in end-of-semester exam debarment appeals through early intervention.
