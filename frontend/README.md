# EduManage – Next.js Frontend

> School Management System — **Next.js 14 (App Router)** frontend connecting to **PHP Laravel** backend via REST API.

---

## 🎨 Brand
- **Font:** Palatino Linotype (Palatino, Book Antiqua, Georgia fallbacks)
- **Primary Color:** `#C9A020` (Gold)
- **Background/Dark:** `#0D0D0D` (Near Black)
- **Surface:** `#F7F6F3` (Warm Off-White)

---

## 📁 Project Structure

```
edumanage/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirects → /dashboard
│   ├── login/page.tsx          # Login screen
│   ├── dashboard/page.tsx      # Admin dashboard
│   ├── admission/page.tsx      # Admission portal
│   ├── fee-management/page.tsx # Fee dashboard
│   ├── academics/page.tsx      # Courses & subjects
│   ├── attendance/page.tsx     # Attendance management
│   ├── timetable/page.tsx      # Master timetable
│   ├── staff/page.tsx          # Faculty directory
│   ├── students/page.tsx       # Student information
│   ├── messaging/page.tsx      # Internal messaging
│   ├── reports/page.tsx        # Reporting & analytics
│   ├── results/page.tsx        # Examination & results
│   ├── report-card/page.tsx    # Student report card ★ NEW
│   ├── inventory/page.tsx      # Inventory management
│   ├── settings/page.tsx       # Class & term settings
│   └── portal/page.tsx         # Portal links
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Topbar.tsx          # Top header bar
│   │   └── AppLayout.tsx       # Page wrapper
│   └── Providers.tsx           # React Query + Toast
├── lib/
│   ├── api.ts                  # ⭐ ALL Laravel API pipelines
│   ├── auth-store.ts           # Zustand auth state
│   └── utils.ts                # Helpers
├── tailwind.config.ts          # Brand colors + Palatino
├── app/globals.css             # CSS variables & components
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL=http://your-laravel-app.test/api

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## 🔌 Laravel API Endpoints Expected

All endpoints prefixed with `/api`. Auth via Bearer token (Laravel Sanctum compatible).

### Auth — `AuthController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login, returns `{ token, user }` |
| POST | `/auth/logout` | Invalidate token |
| GET  | `/auth/me` | Get current user |
| POST | `/auth/forgot-password` | Send reset email |

### Dashboard — `DashboardController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Stats: students, staff, revenue, attendance |
| GET | `/dashboard/activities` | Recent activity feed |

### Admission — `AdmissionController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admissions` | List applications (paginated, filterable) |
| POST | `/admissions` | Create new application |
| GET | `/admissions/{id}` | Single application |
| PUT | `/admissions/{id}` | Update application |
| DELETE | `/admissions/{id}` | Delete application |
| PUT | `/admissions/{id}/status` | Update status |

### Fee Management — `FeeController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fees/dashboard` | Fee totals & overdue |
| GET | `/fees/breakdown` | Fee type breakdown |
| GET | `/fees/transactions` | Recent transactions |
| POST | `/fees/payments` | Record new payment |
| GET | `/fees/payments/{id}` | Payment details |

### Academics — `AcademicsController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/academics/classes` | Class tree structure |
| GET | `/academics/subjects` | Subjects (filter by class/section) |
| POST | `/academics/subjects` | Add subject |
| PUT | `/academics/subjects/{id}` | Update subject |
| DELETE | `/academics/subjects/{id}` | Delete subject |

### Attendance — `AttendanceController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance/students` | Students list for class/section/date |
| POST | `/attendance/save` | Save attendance records |
| GET | `/attendance/summary` | Daily summary stats |
| GET | `/attendance/report` | Monthly attendance report |

### Timetable — `TimetableController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/timetable` | Timetable for class/section |
| POST | `/timetable/generate` | Auto-generate timetable |
| PUT | `/timetable/{id}` | Update period |

### Faculty/Staff — `StaffController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff` | Staff list (paginated, filterable) |
| POST | `/staff` | Add staff member |
| GET | `/staff/{id}` | Staff profile |
| PUT | `/staff/{id}` | Update staff |
| DELETE | `/staff/{id}` | Remove staff |

### Students — `StudentController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Student list (paginated, searchable) |
| POST | `/students` | Enroll student |
| GET | `/students/{id}` | Student profile |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Remove student |

### Examinations & Results — `ExaminationController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams` | List exams |
| POST | `/exams` | Create exam |
| GET | `/exams/{id}/marks` | Get marks entry data |
| POST | `/marks/save` | Save marks |
| POST | `/exams/{id}/publish` | Toggle result visibility |
| GET | `/report-card` | Get student report card data |
| POST | `/report-card/generate` | Generate PDF (returns blob) |
| POST | `/report-card/bulk-generate` | Bulk PDF generation (returns ZIP) |

### Inventory — `InventoryController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory` | Item list (filterable by category/status) |
| POST | `/inventory` | Add item |
| GET | `/inventory/{id}` | Item details |
| PUT | `/inventory/{id}` | Update item |
| DELETE | `/inventory/{id}` | Remove item |
| POST | `/inventory/{id}/stock/add` | Add stock |
| POST | `/inventory/{id}/issue` | Issue stock to department |

### Messaging — `MessagingController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages/inbox` | Inbox messages |
| GET | `/messages/sent` | Sent messages |
| GET | `/messages/drafts` | Drafts |
| GET | `/messages/{id}` | Single message |
| POST | `/messages/send` | Send message |
| POST | `/messages/bulk` | Bulk email send |
| DELETE | `/messages/{id}` | Delete message |

### Reports — `ReportController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/analytics` | Aggregated analytics data |
| GET | `/reports/enrollment` | Enrollment trends by quarter |
| GET | `/reports/fee-collection` | Fee collection chart |
| GET | `/reports/top-performers` | Top students |
| GET | `/reports/attendance` | Attendance breakdown |
| POST | `/reports/generate` | Generate PDF report (returns blob) |
| GET | `/reports/export` | Export data CSV (returns blob) |

### Settings — `SettingsController`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/classes` | Class directory |
| POST | `/settings/classes` | Add class |
| PUT | `/settings/classes/{id}` | Update class |
| GET | `/settings/terms` | Academic terms |
| POST | `/settings/terms` | Add term |
| PUT | `/settings/terms/{id}` | Update term |
| GET | `/settings/notices` | Notice board |
| POST | `/settings/notices` | Post notice |
| DELETE | `/settings/notices/{id}` | Delete notice |

---

## 🔐 Authentication Flow

1. User submits login form → `POST /api/auth/login`
2. Laravel returns `{ token: "...", user: {...} }`
3. Token stored in `localStorage` as `edu_token`
4. All subsequent requests include `Authorization: Bearer <token>` header
5. On 401 response → user auto-redirected to `/login`

---

## 🗄️ Suggested MySQL Tables

```sql
users, roles, students, staff, classes, sections, subjects,
admissions, fee_types, fee_payments, timetable_periods,
attendance_records, exams, exam_marks, inventory_items,
inventory_transactions, messages, notices, academic_terms
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | Framework |
| `axios` | HTTP client |
| `@tanstack/react-query` | Server state management |
| `zustand` | Auth state (client) |
| `lucide-react` | Icons |
| `react-hot-toast` | Notifications |
| `recharts` | Charts (reports page) |
| `tailwindcss` | Styling |
| `date-fns` | Date formatting |

---

## 🖨️ Report Card Print

The `/report-card` page includes a print stylesheet — clicking "Print Report Card" calls `window.print()` which hides the sidebar and topbar, showing only the report card document. For server-side PDF generation, wire `reportCardApi.generatePdf()` to your Laravel PDF controller (e.g. using Dompdf or Browsershot).

---

*EduManage Administration System V2.4.1 — Built with Next.js 14 + PHP Laravel*
