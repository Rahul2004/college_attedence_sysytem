# Engineering & Design Rules
## College Attendance Management System (CAMS)

---

### 1. Philosophy: Minimal Brutalist & High-Craft Editorial
CAMS adheres strictly to an intentional, functional, high-density editorial aesthetic inspired by technical broadsheets, Swiss design, and neo-brutalist digital interfaces. 

Every pixel must communicate intent, academic rigor, and immediate operational clarity.

---

### 2. The Strict Design Commandments

#### Rule 1: Zero Generic Soft Radii & No Blur Shadows
- **FORBIDDEN:** `rounded-2xl`, `rounded-3xl`, `shadow-xl`, `backdrop-blur-md`, glowing borders, soft ambient drop shadows, or generic SaaS gradients.
- **MANDATORY:** Sharp edges or ultra-tight borders (`rounded-none` or `rounded-sm` max 2px). Hard, offset tactical shadows:
  ```css
  box-shadow: 4px 4px 0px 0px #171717;
  ```
  On active/click states, translate down-right to collapse the shadow:
  ```css
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #171717;
  ```

#### Rule 2: Absolute 2px Solid Dark Border Architecture
- Every card, button, table header, separator, and input field must have an explicit:
  ```css
  border: 2px solid #171717; /* Or #000000 / border-neutral-900 */
  ```
- Sub-elements or nested grids within cards may use `border-t-2 border-b-2` or `divide-y-2 divide-neutral-900`.

#### Rule 3: Curated Warm Monochrome & Alert Palette
- **Canvas / Background:** `#F4F4F0` (warm archival cream / paper tint).
- **Surface / Card Background:** `#FFFFFF` or `#F9F9F7`.
- **Primary Ink / Contrast Dark:** `#171717` (rich carbon black).
- **Secondary Ink / Metadata:** `#525252` (high-contrast muted dark).
- **Deficit / Critical Alert (<75%):** `#DC2626` (Stark Red) or high-contrast Red background with pure black border and bold ink.
- **Warning Zone (75-80%):** `#EAB308` (Industrial Amber / Safety Yellow).
- **Compliant / Optimal (>=85%):** `#16A34A` (Precision Green) or pure carbon inversion.
- **Accents:** `#2563EB` (Cobalt Blue for selected actions) or `#E2E8F0` for neutral fills.

#### Rule 4: High-Density Monospace & Editorial Typography
- Header elements must pair **bold geometric sans-serif** (e.g., `Inter`, `Syne`, or system sans) with **monospaced data figures** (e.g., `JetBrains Mono`, `IBM Plex Mono`, or `Space Mono`).
- All numeric metrics, percentages, roll numbers, dates, and times must be displayed in monospaced font to ensure tabular alignment and numerical gravitas.
- All caps labels for category tickers and status tags: `tracking-wider text-xs font-mono uppercase font-bold`.

---

### 3. Engineering & Code Quality Standards

#### 3.1. Component Isolation & Predictability
- **Pure Functions for Calculations:** No mathematical logic directly in JSX renders. Percentages, deficits, and attendance statuses must reside in typed helper modules with unit tests.
- **Strict Prop Validation:** Every interactive component (`BrutalButton`, `AttendanceRow`, `MetricCard`) must handle fallback states and boundary conditions without crashing.
- **Accessible State Toggles:** Buttons must maintain distinct visual focus rings:
  ```css
  focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2
  ```

#### 3.2. State Management Rules
- **Optimistic UI Updates:** When an instructor toggles attendance, the UI must reflect the new state instantly (<16ms) without awaiting asynchronous confirmations.
- **Single Source of Truth:** Subject aggregates must be derived reactively from individual session logs. Never maintain desynchronized secondary percentage variables.
- **LocalStorage Sync Safety:** All localStorage interactions must be wrapped in `try/catch` handlers with automatic schema fallback to mock defaults if stored JSON is corrupt.

#### 3.3. Performance & Asset Directives
- **Zero Heavy Graphing Bloat:** Favor custom SVG or clean HTML/CSS percentage bars and column blocks over bulky 500KB chart libraries.
- **Bundle Hygiene:** Ensure all Lucide icons are imported individually (`import { Check, X, AlertTriangle } from 'lucide-react'`).

---

### 4. Code Review Checklist (PR Gatekeeper)
1. [ ] Is the background `#F4F4F0` and are cards using `border-2 border-neutral-900`?
2. [ ] Are all shadows crisp hard-edges (`4px 4px 0px 0px #171717`) without blur radius?
3. [ ] Are percentages rendered with monospaced precision?
4. [ ] Does any student with $< 75\%$ attendance trigger the stark warning indicator?
5. [ ] Is keyboard navigation intact for attendance roll call?
