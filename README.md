# PRIVACYGUARD: Your Data. Your Control.

> **Data Deletion Request Management System**  
> An enterprise-grade, privacy-focused platform inspired by India’s **Digital Personal Data Protection (DPDP) Act, 2023** principles, combining an Apple-inspired liquid-glass design system with rigorous authorization boundaries, deterministic state machines, and cryptographic proof of erasure.

---

## 🌟 Architecture & Product Highlights

PrivacyGuard combines three complete products into one cohesive system:

1. **A. Premium Visual Experience**
   - **Liquid-Glass Design Tokens**: Translucent surfaces (`backdrop-blur-xl`), fine inner specular highlights, ambient glow, and high-density fallback surfaces.
   - **3D Interactive Shield Centerpiece**: Multi-layered data orbit rings, pointer-responsive depth with perspective transforms, and strict `prefers-reduced-motion` compliance.
   - **Border-Beam Search**: Luminous traveling border beam around input perimeter with keyboard accessibility (`/` and `Ctrl+K`), debouncing, and role-authorized filtering.
   - **3D CoverFlow Carousel**: Interactive 3D perspective cards illustrating the 6-stage deletion lifecycle with touch swipe, mouse drag, and keyboard arrow controls.
   - **Adaptive Themes**: Dynamic midnight-navy dark theme and pearl-white light theme with CSS variables.

2. **B. Full-Stack Data & Authorization Engine**
   - **Authentication**: Native Supabase Authentication client with session persistence, email challenge tokens, and seamless fallbacks.
   - **Demonstration Mode**: Immediate zero-config interactive sandbox featuring pre-seeded fictional data principals (Priya Sharma, Arjun Patel) and internal compliance roles (Dr. Vikram Malhotra - DPO Admin, Sunita Rao - Auditor).
   - **PostgreSQL Database Schema**: Versioned SQL migrations (`supabase/migrations/20261011_privacyguard_schema.sql`) with foreign keys, constraints, and relational indexes.
   - **Row Level Security (RLS)**: Enforced at the database level (`auth.uid() = user_id`); clients cannot manipulate status fields or bypass tenancy boundaries.
   - **Role Separation**: Public self-registration strictly defaults to the `user` role; administrative elevation is restricted to internal provisioning.

3. **C. Advanced Privacy & Lifecycle Management**
   - **Deterministic State Machine**: Explicit transitions (`SUBMITTED` → `VERIFICATION_PENDING` → `VERIFIED` → `UNDER_REVIEW` → `APPROVED` → `DELETION_IN_PROGRESS` → `COMPLETED` / `PARTIALLY_COMPLETED`).
   - **Documented Retention Holds**: Section 8(7) DPDP compliance registry preserving statutory financial/tax records (e.g. Indian Income Tax Act 1961 Section 44AA) while pruning personal telemetry.
   - **Distributed Deletion Workers**: Idempotent jobs across relational databases, object storage, and search clusters with exponential backoff retries.
   - **Cryptographic Verification**: Verifiable SHA-256 certificate of erasure hashes generated only after all storage silos confirm deletion.
   - **Append-Only Audit Trail**: Structured event logging with masked IPs (`103.***.***.***`), correlation IDs, and revoked client `UPDATE`/`DELETE` permissions.
   - **Formula-Safe CSV Export**: Defense against **CSV Formula Injection (CWE-1236)** by neutralizing `=`, `+`, `-`, `@`, `\t` triggers.
   - **Recharts Analytics**: Interactive request volumes, SLA turnaround metrics, and lifecycle breakdown distributions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript (Strict Mode), Vite 8, Tailwind CSS |
| **Routing** | React Router v7 (Code-split with `lazy` & `Suspense`) |
| **Icons & UI** | Lucide React, Custom Liquid-Glass Tokens |
| **Motion & 3D** | CSS 3D Transforms, Hardware-accelerated animations |
| **Forms & Validation** | React Hook Form, Zod schema validation |
| **Visualization** | Recharts (Responsive SVG charts with accessible tooltips) |
| **Database & Auth** | PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **Testing** | Vitest, React Testing Library, `@testing-library/jest-dom`, JSDOM |

---

## 📂 Project Structure

```
privacyguard/
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute component
│   │   ├── layout/         # PublicLayout, UserPortalLayout, AdminPortalLayout
│   │   ├── navigation/     # Translucent Navbar, Sidebar, Footer
│   │   └── ui/             # GlassCard, BorderBeamSearch, CoverFlowCarousel,
│   │                       # ShieldCenterpiece3D, StatusBadge, DemoModeBanner,
│   │                       # NotificationModal, ToastContainer, LoadingFallback
│   ├── context/
│   │   ├── AuthContext.tsx         # Auth state, role switching, Supabase client
│   │   ├── ThemeContext.tsx        # Dark/light mode switching
│   │   └── NotificationContext.tsx # In-app notification center & toasts
│   ├── pages/
│   │   ├── admin/          # AdminDashboard, RequestReview, DeletionJobs,
│   │   │                   # RetentionManagement, AuditLogs, Analytics, Users, Settings
│   │   ├── auth/           # LoginPage, RegisterPage, ForgotPassword, Reset, Verify
│   │   ├── public/         # LandingPage, FeaturesPage, HowItWorks, Security, Privacy, Terms
│   │   └── user/           # UserDashboard, NewRequestPage, RequestsList, RequestDetail, Profile
│   ├── services/
│   │   ├── deletionEngine.ts # State machine transitions, worker scheduler & receipt generator
│   │   ├── exportService.ts  # CSV generation with formula injection defense (CWE-1236)
│   │   ├── storage.ts        # Seed fixtures, local persistence, audit logger
│   │   └── supabase.ts       # Supabase client initialization & detection
│   ├── test/               # Vitest & React Testing Library test suites
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── index.css           # Liquid-glass tokens, variables, keyframes
│   ├── main.tsx            # Application entrypoint
│   └── App.tsx             # Code-split routing configuration
├── supabase/
│   └── migrations/
│       └── 20261011_privacyguard_schema.sql # PostgreSQL schema & RLS policies
├── tailwind.config.js      # Custom theme colors, glass shadows, border-beam keyframes
├── vite.config.ts          # Vite configuration with path aliases & Vitest setup
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- Node.js `v20.0.0` or later (`node -v`)
- npm `v10.0.0` or later (`npm -v`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Test Suite
```bash
npm run test
```
Runs 17 unit and integration tests across authorization boundaries, state machines, CSV formula injection sanitization, and UI components.

### 5. Production Build
```bash
npm run build
```
Typechecks with TypeScript strict mode and compiles code-split bundles into the `dist/` directory.

---

## 🔐 Demonstration Mode & Role Switching

PrivacyGuard includes a built-in Demonstration Mode that functions immediately without requiring external database provisioning:
- **Priya Sharma** (`priya.sharma@example.com`): Standard Data Principal. Submit, track, and challenge personal deletion requests.
- **Dr. Vikram Malhotra** (`dpo.vikram@privacyguard.internal`): Authorized Data Protection Officer. Evaluate compliance, document retention holds, and dispatch deletion workers.
- **Sunita Rao** (`auditor.sunita@privacyguard.internal`): Compliance Auditor. Inspect immutable audit trails and download formula-safe CSV records.

Switch between identities instantly via the top **Demonstration Mode Banner** or click the quick-login buttons on `/login`.

---

## 🗄️ Supabase Production Configuration

To connect a live Supabase project:
1. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
2. In the Supabase SQL Editor, execute the migration file:
   `supabase/migrations/20261011_privacyguard_schema.sql`
3. Restart the dev server (`npm run dev`). PrivacyGuard will automatically detect your Supabase credentials and transition from Demo Store to live PostgreSQL RLS mode.

---

## 🛡️ Security Defenses & Threat Model

| Security Vector | Implementation Detail |
|---|---|
| **Insecure Direct Object References (IDOR)** | Enforced via PostgreSQL RLS `auth.uid() = user_id`. All request IDs use high-entropy random identifiers (`PG-2026-XXXX-XX`). |
| **Privilege Escalation** | Self-registration endpoints enforce `role = 'user'`. Administrative elevation requires trusted backend provisioning. |
| **CSV Formula Injection (CWE-1236)** | `sanitizeCsvField` prepends `'` to cells beginning with `=`, `+`, `-`, `@`, `\t`, or `\r`. |
| **Audit Log Tampering** | Database-level `REVOKE UPDATE, DELETE ON public.audit_events` guarantees immutable append-only provenance. |
| **Accidental Data Destruction** | Approval is separated from worker execution; multi-store cryptographic verification is required before requests can be finalized. |
