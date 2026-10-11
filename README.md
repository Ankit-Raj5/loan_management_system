# LMS Bank – Loan Management System

A lending platform where **borrowers apply for loans online** and **internal executives manage each loan through its lifecycle**: review, sanction, disbursement and repayment collection.

- **Borrower portal:** sign up, check eligibility, upload a salary slip, pick an amount and tenure with live calculations, apply, and track every application.
- **Operations dashboard:** four role-guarded workspaces (Sales, Sanction, Disbursement, Collection) plus an Admin overview, with a full audit trail on every loan.

> Built as a full-stack assignment: **Next.js + TypeScript + Tailwind** frontend, **Node.js + Express + TypeScript** backend, **MongoDB + Mongoose** database, **JWT + bcrypt** authentication.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [How it works](#how-it-works)
4. [Roles and access](#roles-and-access)
5. [Project structure](#project-structure)
6. [Setup](#setup)
   - [Prerequisites](#prerequisites)
   - [Backend setup](#backend-setup)
   - [Frontend setup](#frontend-setup)
   - [Run the whole app](#run-the-whole-app)
7. [Test accounts](#test-accounts)
8. [Try the full flow in five minutes](#try-the-full-flow-in-five-minutes)
9. [API reference](#api-reference)
10. [Security notes](#security-notes)
11. [Troubleshooting](#troubleshooting)
12. [Known limitations](#known-limitations)
13. [Contact](#contact)

---

## Features

### Borrower portal
- **Sign up and sign in** with a role toggle. Passwords are hashed with bcrypt. Every page except the landing, login and sign-up pages is protected.
- **Personal details with an instant eligibility check** (Business Rule Engine, run on the server).
- **Salary slip upload** (PDF, JPG or PNG, up to 5 MB), stored privately in Cloudinary.
- **Loan configuration with sliders** and a live repayment summary (amount ₹50,000 – ₹5,00,000, tenure 30 – 365 days, 12% a year simple interest).
- **My applications:** every application with its status, loan terms and a step-by-step timeline. A borrower with no applications sees a clear "Apply for a loan" call to action.
- Unfinished applications resume exactly where the borrower left off.

### Operations dashboard
| Module | What it does |
|---|---|
| **Sales** | Lists leads: borrowers who started but never submitted an application (draft in progress, or rejected by the eligibility check). |
| **Sanction** | Reviews applied loans, views the private salary slip through a short-lived link, then approves or rejects (a reason is mandatory). |
| **Disbursement** | Marks sanctioned loans as disbursed. |
| **Collection** | Records repayments (unique UTR, amount, date). The loan closes automatically when the balance reaches zero. |
| **Admin** | Can open every module, and sees an overview with live counts (for example "Waiting for sanction"). |

### Platform
- **Role-based access control on both the frontend and the backend.** Hiding a menu item is never the only protection; the API rejects unauthorised calls (401 not signed in, 403 wrong role).
- **Audit trail** on every loan: each status change records who did it, their role, when, and any note.
- **Consistent API responses and errors** across every endpoint.
- **Responsive design** for phones, tablets and desktops, with light animations that respect "reduce motion".

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, lucide-react icons |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT (stored in an httpOnly cookie) and bcrypt (`bcryptjs`) |
| File storage | Cloudinary (salary slips are private assets; brand images are public) |

---

## How it works

### Loan lifecycle

```
DRAFT ──▶ APPLIED ──▶ SANCTIONED ──▶ DISBURSED ──▶ CLOSED
   │          └──────▶ REJECTED (by Sanction, with a reason)
   └─────────────────▶ REJECTED (by the eligibility check)
```

| Transition | Done by |
|---|---|
| Create `DRAFT`, then `DRAFT → APPLIED` | Borrower |
| `DRAFT → REJECTED` | Eligibility check (automatic) |
| `APPLIED → SANCTIONED` or `REJECTED` | Sanction |
| `SANCTIONED → DISBURSED` | Disbursement |
| `DISBURSED → CLOSED` | Automatic, when the full amount is repaid |

Each action checks the current status first, so a loan can never skip a stage or repeat one (wrong state returns 409).

### Eligibility check (Business Rule Engine)
Runs **on the server** (the client can be bypassed). An application is rejected if any rule fails, and **every failed rule is reported at once**:

| Rule | Rejected when |
|---|---|
| Age | Not between 23 and 50 |
| Salary | Below ₹25,000 a month |
| PAN | Does not match `^[A-Z]{5}[0-9]{4}[A-Z]$` |
| Employment | Applicant is Unemployed |

A rejected attempt is **stored with status `REJECTED`** (with the reasons), so borrowers can see all their past applications. While a borrower has an unfinished draft, re-submitting details updates that draft. A new record is created only after the previous application was rejected, closed or otherwise finished. A borrower cannot start a new application while one is `APPLIED`, `SANCTIONED` or `DISBURSED`.

### Loan maths
Simple interest, with the tenure in days:

```
Interest         = (Principal × 12 × Days) / (365 × 100)
Total repayment  = Principal + Interest
```

Example: ₹1,00,000 for 90 days → interest ₹2,958.90 → total ₹1,02,958.90. The live calculation panel calls the server, so the preview always matches what is saved.

### Payments (Collection)
- **UTR number:** 6 to 30 letters or digits, stored in upper case, **unique across all payments**.
- **Amount:** greater than 0, at most 2 decimal places, and **never more than the outstanding balance**. Partial payments are allowed.
- **Date:** a real date, not in the future (Indian time), and not before the disbursement date.
- **Outstanding balance** = total repayment minus everything paid so far. Money is calculated in whole paise to avoid floating-point errors.
- Concurrent payments are protected, so two simultaneous requests cannot push the total over the repayment amount.
- When the balance reaches exactly zero, the loan **closes automatically** and the audit trail records it.

### Authentication flow
1. The browser posts credentials to the **Next.js server** (`/api/auth/login`).
2. Next.js calls the backend, then stores the JWT in an **httpOnly, SameSite=Lax cookie**. The token is never visible to browser JavaScript and is not returned in the response body.
3. Every later call goes through a Next.js proxy (`/api/*`) that adds the token as a `Bearer` header and forwards the request to the backend.
4. `src/proxy.ts` (Next.js route guard) redirects visitors to the right place by role, and server layouts re-check the user against the backend on every page.

---

## Roles and access

| Role | Can open |
|---|---|
| **Borrower** | Applications, Apply, Profile |
| **Sales** | Sales module, Profile |
| **Sanction** | Sanction module, Profile |
| **Disbursement** | Disbursement module, Profile |
| **Collection** | Collection module, Profile |
| **Admin** | Overview and all four modules, Profile (not the borrower portal) |

- **Landing page:** the landing page (`/`) is public. Signed-in users skip it and go straight to their home: Borrower → Applications, executives → their module, Admin → Overview.
- **Login:** the login screen has a role toggle. If the account's role does not match the selected role, the server answers "No account found for the selected role".
- **Sign-up:** **only borrowers can sign up.** Sales, Sanction, Disbursement and Collection are shown but locked, with a message that an administrator creates those accounts. The backend enforces this too (staff roles get a 422).
- **Wrong area:** an executive opening another module, or a borrower opening the dashboard, is sent to a "no access" page. The backend also returns 403 for the same calls.

---

## Project structure

```
LMS/
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/        environment, database, Cloudinary, loan limits, upload limits
│   │   ├── models/        User, LoanApplication, Payment
│   │   ├── routes/        auth, applications, sales, sanction, disbursement, collection
│   │   ├── controllers/   request handling and validation
│   │   ├── services/      business logic (eligibility check, workflow/audit trail, storage, ...)
│   │   ├── middleware/    authenticate, authorize (RBAC), file upload, error handler
│   │   ├── utils/         errors, response format, messages, validators, loan maths, money, dates
│   │   ├── types/         roles, loan enums, audit actor
│   │   ├── seed/          seed.ts (creates one account per role)
│   │   ├── app.ts         Express app
│   │   └── server.ts      starts the server and prints all routes
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           public landing page
    │   │   ├── (auth)/            login, register
    │   │   ├── (app)/             signed-in pages
    │   │   │   ├── (portal)/      apply, applications, applications/[id]   (borrowers)
    │   │   │   ├── dashboard/     overview + sales, sanction, disbursement, collection
    │   │   │   ├── profile/       account and change password
    │   │   │   └── forbidden/     "no access" page
    │   │   └── api/               auth (cookie) and the proxy to the backend
    │   ├── components/            ui (shared kit), layout, auth, landing, apply, loans, ops, profile
    │   ├── lib/                   config, roles, access rules, types, formatting, API clients
    │   └── proxy.ts               route guard (login redirect and role routing)
    ├── .env.example
    └── package.json
```

**Backend architecture:** every feature follows three layers. **Routes** (wiring and middleware) → **Controllers** (validate input, shape the response) → **Services** (business rules and database access).

---

## Setup

### Prerequisites
- **Node.js 20 or newer** (developed and tested on Node 22) and npm
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017`), or a MongoDB Atlas connection string
- A free **[Cloudinary](https://cloudinary.com) account** (needed for salary slip uploads)

### Backend setup

```bash
cd backend
npm install
```

1. Copy the example environment file and fill it in:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

2. Edit `backend/.env`:

   | Variable | Description | Example |
   |---|---|---|
   | `PORT` | Port the API listens on. The frontend expects **8080** by default. | `8080` |
   | `NODE_ENV` | `development` or `production` | `development` |
   | `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/lms` |
   | `JWT_SECRET` | Long random string used to sign tokens. **Change it.** | `a-long-random-string` |
   | `JWT_EXPIRES_IN` | Token lifetime | `1d` |
   | `CLIENT_URL` | Frontend address (used for CORS) | `http://localhost:3000` |
   | `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard | `my-cloud` |
   | `CLOUDINARY_API_KEY` | From your Cloudinary dashboard | `1234567890` |
   | `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard (keep private) | `…` |

3. Create the test accounts (one per role):

   ```bash
   npm run seed
   ```

4. Start the API:

   ```bash
   npm run dev
   ```

   You should see `MongoDB connected`, `Server running on http://localhost:8080` and a list of every registered route. Quick check: open `http://localhost:8080/api/health`.

| Script | What it does |
|---|---|
| `npm run dev` | Development server with auto-restart |
| `npm run seed` | Creates or resets the six test accounts |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs the compiled build (`dist/server.js`) |

> If the Cloudinary values are missing, the server still starts but prints a warning, and salary slip uploads fail with "File storage is not configured on the server".

### Frontend setup

```bash
cd frontend
npm install
```

1. Copy the example environment file:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local
   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

2. Edit `frontend/.env.local`:

   | Variable | Description | Default |
   |---|---|---|
   | `API_URL` | Address of the backend API, **including `/api`**. Used only on the server, never exposed to the browser. | `http://localhost:8080/api` |

3. Start the app:

   ```bash
   npm run dev
   ```

   Open **http://localhost:3000**.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serves the production build (run `npm run build` first) |
| `npm run lint` | Runs ESLint |

### Run the whole app
Use two terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Then open http://localhost:3000.

---

## Test accounts

Created by `npm run seed` in the backend. **Every account uses the password `Password@123`** (note the `@`).

| Role | Email | Lands on after login |
|---|---|---|
| Borrower | `borrower@lms.com` | My applications |
| Sales | `sales@lms.com` | Sales |
| Sanction | `sanction@lms.com` | Sanction |
| Disbursement | `disbursement@lms.com` | Disbursement |
| Collection | `collection@lms.com` | Collection |
| Admin | `admin@lms.com` | Overview (all modules) |

On the login screen, **select the matching role** before signing in. Running `npm run seed` again resets these accounts and their password.

---

## Try the full flow in five minutes

1. **Borrower rejected by the eligibility check.** Sign in as the Borrower and open *Apply for a loan*. Enter a monthly salary of `10000`. You will see exactly which rule failed, and the attempt appears in *My applications* as **Rejected**.
2. **Borrower accepted.** Apply again with valid details, for example PAN `ABCDE1234F`, date of birth `1995-06-15`, salary `60000`, Salaried. Upload any small PDF, JPG or PNG as the salary slip. Move the sliders, watch the live summary, and click **Apply**.
3. **Sanction.** Sign out, then sign in as `sanction@lms.com` (select *Sanction*). Open the loan, view the salary slip, and click **Approve**. The Overview and queue counts update.
4. **Disbursement.** Sign in as `disbursement@lms.com` and click **Mark as disbursed**.
5. **Collection.** Sign in as `collection@lms.com`, open the loan and **Record payment** (a unique UTR such as `UTR000001`, an amount and a date). Pay in parts if you like. When the balance reaches zero, the loan closes by itself.
6. **Audit trail.** Open the loan from any module, or as the borrower, to see every step with who did it and when.
7. **Sales and Admin.** Sign in as `sales@lms.com` to see leads (borrowers with unfinished or rejected applications), and as `admin@lms.com` to see everything.

---

## API reference

Base URL: `http://localhost:8080/api`. Protected routes need `Authorization: Bearer <token>`. (In the web app the Next.js proxy adds this from the cookie.)

### Response format
Every endpoint uses the same envelope.

```jsonc
// Success
{ "success": true, "message": "Logged in successfully", "data": { ... } }

// Error
{ "success": false, "message": "Validation failed", "error": { "code": "VALIDATION_ERROR", "details": { "email": "A valid email is required" } } }
```

| Status | Error code | Meaning |
|---|---|---|
| 400 | `BAD_REQUEST` | Malformed request or id |
| 401 | `UNAUTHORIZED` | Not signed in, bad token, or wrong credentials |
| 403 | `FORBIDDEN` | Signed in but the role is not allowed |
| 404 | `NOT_FOUND` | Resource or route not found |
| 409 | `CONFLICT` | Duplicate (email, UTR) or the loan is in the wrong status |
| 422 | `VALIDATION_ERROR` | Invalid input (with per-field messages) |
| 422 | `BRE_REJECTED` | Rejected by the eligibility check (lists every failed rule) |
| 502 | `STORAGE_ERROR` | File storage (Cloudinary) failed |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/auth/register` | Public | Create a borrower account |
| POST | `/auth/login` | Public | Sign in (body: `email`, `password`, optional `role`) |
| GET | `/auth/me` | Signed in | Current user |
| PATCH | `/auth/change-password` | Signed in | Change own password |
| GET | `/applications/calculate?amount=&tenureDays=` | Borrower | Live loan calculation |
| POST | `/applications/personal-details` | Borrower | Eligibility check; creates or updates the draft |
| POST | `/applications/:id/salary-slip` | Borrower | Upload salary slip (`multipart`, field `salarySlip`) |
| POST | `/applications/:id/apply` | Borrower | Submit the loan (`amount`, `tenureDays`) |
| GET | `/applications` | Borrower | List own applications |
| GET | `/applications/:id` | Borrower | One own application, with audit trail |
| GET | `/sales/leads?stage=&page=&limit=` | Sales, Admin | Leads |
| GET | `/sanction/applications?status=&page=&limit=` | Sanction, Admin | Review queue |
| GET | `/sanction/applications/:id` | Sanction, Admin | Loan detail with audit trail |
| GET | `/sanction/applications/:id/salary-slip` | Sanction, Admin | Short-lived (5 minute) link to the private salary slip |
| POST | `/sanction/applications/:id/approve` | Sanction, Admin | Approve (optional `note`) |
| POST | `/sanction/applications/:id/reject` | Sanction, Admin | Reject (`reason` required) |
| GET | `/disbursement/loans?status=&page=&limit=` | Disbursement, Admin | Disbursement queue |
| GET | `/disbursement/loans/:id` | Disbursement, Admin | Loan detail |
| POST | `/disbursement/loans/:id/disburse` | Disbursement, Admin | Mark as disbursed (optional `note`) |
| GET | `/collection/loans?status=&page=&limit=` | Collection, Admin | Active loans |
| GET | `/collection/loans/:id` | Collection, Admin | Loan with balance and payment history |
| POST | `/collection/loans/:id/payments` | Collection, Admin | Record a payment (`utr`, `amount`, `date`) |

List endpoints accept `page` (default 1) and `limit` (default 20, maximum 100) and return a `pagination` object.

---

## Security notes

- **Passwords** are hashed with bcrypt and never returned by the API. Login failures give the same message for an unknown email and a wrong password.
- **Sessions** use an httpOnly, SameSite=Lax cookie (marked `Secure` in production). No token is stored in `localStorage`.
- **Authorization is enforced in the backend** on every protected route, and role is re-read from the database on each request, so disabling an account takes effect immediately.
- **Public sign-up cannot create staff accounts**, whatever the request says.
- **Salary slips are private** Cloudinary assets, checked by file type, size and real file content, and viewable only through short-lived signed links.
- The API uses `helmet` security headers and validates all input.
- Never commit `.env` or `.env.local`; both are git-ignored. Only the `.env.example` files are committed.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| The login page loads but sign-in says it "could not reach the server" | The backend is not running, or `API_URL` in `frontend/.env.local` does not match the backend `PORT`. Both default to **8080**. |
| `MongooseServerSelectionError` or the backend exits at start | MongoDB is not running, or `MONGO_URI` is wrong. Start MongoDB (on Windows, check the "MongoDB" service). |
| "Missing required environment variable" | Create `backend/.env` from `.env.example` and fill in `MONGO_URI` and `JWT_SECRET`. |
| Salary slip upload says "File storage is not configured" | Add the three `CLOUDINARY_*` values to `backend/.env` and restart the backend. |
| "Invalid email or password" for a seeded account | The password is `Password@123` (with an `@`). Re-run `npm run seed` to reset it. |
| "No account found for the selected role" | The role toggle on the login screen does not match that account's role. |
| Code changes do not show after `npm run build` | An old server is still on port 3000. Stop it (on Windows: `Get-NetTCPConnection -LocalPort 3000` and stop that process) and start again. |
| Port already in use | Stop the other process, or change `PORT` (backend) and `API_URL` (frontend) to match. |

---

## Known limitations

- **No admin screen for creating staff accounts yet.** Sales, Sanction, Disbursement and Collection accounts currently come from the seed script. Sign-up is borrower-only by design, so an admin account-management page is the natural next step.
- Salary slips are viewed by a person; their contents are not parsed or verified automatically.
- There is no automated test suite in the repository. The flows were verified by running them end to end against the live backend and frontend.
- The brand logo and landing illustration are loaded from the project's Cloudinary account.

---

## Contact

- LinkedIn: https://www.linkedin.com/in/ankit-rajpoot01/
- Email: ankitrajrajpoot5@gmail.com
- GitHub: https://github.com/Ankit-Raj5
