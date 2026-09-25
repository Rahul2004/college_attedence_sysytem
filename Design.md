# Visual Parameters & UI Specifications
## College Attendance Management System (CAMS)

---

### 1. Color Palette Tokens

```css
:root {
  /* Surface & Base Canvas */
  --bg-canvas: #F4F4F0;       /* Archival cream paper base */
  --bg-surface: #FFFFFF;      /* Clean card surface */
  --bg-surface-alt: #EAEAE4;  /* Muted container tint */
  --bg-surface-dark: #171717; /* Inverted container fill */

  /* Ink & Typography */
  --ink-primary: #171717;     /* Pure carbon black for high contrast */
  --ink-secondary: #525252;   /* Editorial secondary grey */
  --ink-muted: #737373;       /* De-emphasized footnotes & metadata */
  --ink-inverted: #F4F4F0;    /* Canvas cream text on dark backdrops */

  /* Structural Borders */
  --border-primary: #171717;  /* Mandatory 2px structural ink line */
  --border-muted: #A3A3A3;    /* Secondary interior grid lines */

  /* Semantic Status Indicators */
  --status-present: #15803D;  /* Forest / Hunter Green */
  --status-present-bg: #DCFCE7;
  --status-absent: #B91C1C;   /* Crimson Alert Red */
  --status-absent-bg: #FEE2E2;
  --status-late: #D97706;     /* Amber Hazard */
  --status-late-bg: #FEF3C7;
  --status-excused: #2563EB;  /* Editorial Cobalt */
  --status-excused-bg: #DBEAFE;

  /* Warning / Debarment Accent */
  --alert-critical: #DC2626;  /* Debarment threshold breach (<75%) */
}
```

---

### 2. Typography Hierarchy

| Style Token | Font Family | Size | Weight | Tracking / Case | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Header** | Sans-Serif (`Inter` / `Syne`) | 2.25rem (36px) | 800 (Extrabold) | `-0.03em` | Primary view titles, institution banner |
| **Section Header** | Sans-Serif (`Inter`) | 1.5rem (24px) | 700 (Bold) | `-0.02em` | Bento card titles, section headings |
| **Metric Hero** | Monospace (`JetBrains Mono`) | 3.0rem (48px) | 800 (Extrabold) | `-0.04em` | Main attendance percentage, student count |
| **Metric Sub** | Monospace (`JetBrains Mono`) | 1.125rem (18px) | 700 (Bold) | `-0.01em` | Table numeric values, roll call codes |
| **Body Primary** | Sans-Serif (`Inter`) | 0.9375rem (15px) | 500 (Medium) | Normal | Student names, narrative summaries |
| **Badge / Ticker** | Monospace (`JetBrains Mono`) | 0.75rem (12px) | 700 (Bold) | `+0.08em` / UPPERCASE | Status tags, room codes, timestamps |

---

### 3. Tactile Shadow & Border Parameters

Neo-brutalist interaction is defined by deliberate, hard-edged offset geometry with zero blur radius:

```css
/* Custom Utility Tokens (tailwind.config.js / index.css) */

/* Standard Resting Bento Card */
.brutal-card {
  background-color: var(--bg-surface);
  border: 2px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px #171717;
}

/* Deep Hero Card */
.brutal-card-hero {
  background-color: var(--bg-surface);
  border: 2px solid var(--border-primary);
  box-shadow: 6px 6px 0px 0px #171717;
}

/* Compact / Tile Element */
.brutal-card-sm {
  background-color: var(--bg-surface);
  border: 2px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px #171717;
}

/* Interactive Button Hover & Active States */
.brutal-btn {
  background-color: var(--bg-surface);
  color: var(--ink-primary);
  border: 2px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px #171717;
  font-weight: 700;
  transition: all 0.1s ease-in-out;
}

.brutal-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px 0px #171717;
}

.brutal-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px 0px #171717;
}
```

---

### 4. Bento Grid Layout Specification

```
+-----------------------------------------------------------------------------------------+
| [Header] COLLEGE ATTENDANCE MGMT SYSTEM | 2026-09-24 | ROLE: [FACULTY v] | LOGOUT       |
+-----------------------------------------------------------------------------------------+
| [Card 1: Hero Metric]             | [Card 2: Quick Stats]        | [Card 3: Live Alerts] |
| Current Course: CS-602            | Total Students: 64           | DEFAULTER TICKER      |
| Overall Attendance: 82.4%         | Present Today: 56            | ! CS-401 (68.4%) -2 c |
| [4px 4px Hard Shadow]             | Absent Today: 08             | ! CS-419 (71.2%) -1 c |
+-----------------------------------+------------------------------+-----------------------+
| [Card 4: Interactive Roll Call Grid - Span 2 Cols]               | [Card 5: Calculator]  |
| Search: [__________] Filters: [All] [Defaulters] [Unmarked]      | "Target 75% Engine"   |
| #  | ROLL NO | STUDENT NAME       | STATUS TOGGLE     | % RATE   | Classes Attended: 38  |
| 01 | CS-401  | Alexander Wright   | [P] [A] [L] [E]   | 68.4% [!] | Classes Conducted: 52 |
| 02 | CS-402  | Beatrice Vance     | [P] [A] [L] [E]   | 92.1%    | Need 4 more classes.  |
| 03 | CS-403  | Cyrus Vance        | [P] [A] [L] [E]   | 74.0% [!] |                       |
+------------------------------------------------------------------+-----------------------+
```

---

### 5. Micro-Interactions & State Specifications

#### Attendance State Toggle Buttons
- **Default / Unselected:** White background, 2px solid `#171717`, dark text.
- **Selected `[P] Present`:** Background `#15803D` (or inverted `#171717` with white text and green icon indicator).
- **Selected `[A] Absent`:** Background `#DC2626`, text `#FFFFFF`, 2px solid `#171717`, hard shadow collapsed.
- **Selected `[L] Late`:** Background `#FBBF24`, text `#171717`, 2px solid `#171717`.
- **Selected `[E] Excused`:** Background `#3B82F6`, text `#FFFFFF`, 2px solid `#171717`.

#### Defaulter Pill `< 75%`
- Background: `#FEE2E2` with border `2px solid #DC2626`.
- Text: Bold monospaced `#DC2626` with blinking or high-visibility alert icon (`AlertTriangle`).
