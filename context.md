🏋️‍♂️ Gym + Physiotherapy Management System — Copilot Context File
📌 Project Description

This project is a Gym & Physiotherapy Center Management System built using:

Next.js (App Router)

React 18

Material UI (MUI v5+)

Redux Toolkit

React Hook Form

Zod/Yup validation

Recharts / Chart.js for charts

Axios for API requests

Fully responsive UI

The system manages members, physiotherapy patients, appointments, trainers, attendance, plans, payments, and reports.

📁 Project Folder Structure

Copilot must follow this structure strictly:

src/
  app/
    dashboard/
    members/
    physiotherapy/
    attendance/
    appointments/
    trainers/
    plans/
    payments/
    inventory/
    reports/
    settings/
  components/
    tables/
    forms/
    charts/
    layout/
    common/
  features/
    members/
    physiotherapy/
    attendance/
    payments/
  layouts/
    MainLayout.tsx
  services/
    apiClient.ts
  hooks/
  utils/

🎨 Global UI Rules

Copilot must always:

Use clean modern UI

Use MUI Box, Grid, Card, Paper for layout

Use Spacing: padding={2}, gap={2}, mt={2}

Ensure 100% responsiveness (mobile → desktop)

Use Grid system with xs={12} md={6} lg={4}

Use Dark/Light theme support

Include:

Loading skeletons

Error boundaries

Snackbar notifications

Reusable components only (no duplicate UI code)

🧩 Reusable Components Required

Copilot must always generate and use:

<AppTable />
<AppForm />
<AppDialog />
<AppDrawer />
<AppChart />
<AppCard />


All table pages must support:

Pagination

Search

Filters

Sort

Row actions (View, Edit, Delete)

Loader state

📊 Dashboard Requirements

Dashboard must include:

Stats Cards

Active Members

Sessions Today

Total Revenue

Physiotherapy Sessions

Charts

Attendance Line Chart

Revenue Bar Chart

Physiotherapy Cases Pie Chart

Membership Growth

Other Sections

Recent Members

Upcoming Appointments

Announcements

🧑‍🤝‍🧑 Members Module Requirements
Pages:

Member List (DataGrid)

Add/Edit Member

Member Profile Page:

Membership plan

Progress (BMI, Weight, Fat)

Attendance log

Payment history

Medical history notes

Progress photos

UI Rules:

Use MUI DataGrid

Use Modals for View/Delete

Forms with React Hook Form + Zod

🏋️ Membership Plans Module

Plan List

Add/Edit Plan

Attach plan to member

Renewal reminders

Auto-expiry warnings

Offer bundles

📍 Attendance Module
Features:

Gym attendance list

Physiotherapy attendance list

Manual check-in/out

QR check-in support (future)

Attendance reports (daily, monthly)

Export to PDF/Excel

🩺 Physiotherapy Module
Pages:

Patient List

Add/Edit Patient

Physiotherapy Appointments

Treatment Sessions:

Exercises

Pain scale

Session notes

Attach photos/reports

Invoice & payments

UI Requirements:

Calendar-based scheduling

Drawer for session details

Chart for pain scale history

📅 Appointments Module

Supports:

Personal Training Appointments

Physiotherapy Appointments

UI:

Full Calendar view (day/week/month)

Trainers/Physios availability

Book appointment form

Reschedule modal

🧑‍🏫 Trainers / Staff Module

Trainer List

Add/Edit Trainer

Specializations

Assigned Members

Appointment schedule

Performance analytics

💳 Payments & Billing Module

Features:

Invoice list

Add payment

Membership renewals

Physiotherapy payments

Expense management

Revenue reports

PDF invoice generation

🛒 Inventory Module

Supplements stock

Physiotherapy tools/equipment

Low stock alerts

Purchase records

📈 Reports Module

Includes:

Membership report

Attendance report

Physiotherapy treatment report

Trainer performance

Revenue/profits report

All reports must support:

Filters

Export CSV/PDF

Charts + tables

🔔 Notifications Module

SMS / WhatsApp / Email templates

Membership expiry reminders

Appointment reminders

Payment pending notifications

Announcement board

⚙️ Settings Module

Logo & business details

Role-based permissions

User accounts

Physiotherapy configurations

Membership categories

Email/SMS gateway settings

🧭 Sidebar Navigation Structure (Exact Order)
Dashboard

Members
  - Member List
  - Add Member
  - Progress Tracking
  - Attendance

Membership Plans

Attendance
  - Gym Attendance
  - Physio Attendance
  - Reports

Physiotherapy
  - Patients
  - Appointments
  - Sessions
  - Reports

Appointments
  - Training
  - Physiotherapy
  - Calendar

Trainers / Staff

Payments
  - Invoices
  - Add Payment
  - Expenses
  - Reports

Inventory
  - Supplements
  - Equipments

Reports

Notifications

Settings

🧱 Coding Standards

Copilot must:

Use TypeScript everywhere

Prefer reusable config-driven components

Use React Hook Form for ALL forms

Use Zod/Yup for validation schemas

Avoid code duplication

Write modular, clean functions

🚀 Outcome Expected from Copilot

Copilot must generate:

1. ⚡ Fully responsive, modern UI
2. 📄 Well-structured Next.js App Router pages
3. 🧱 Reusable components to avoid rewriting code
4. 📊 Professional charts & tables
5. 🎯 Production-ready, real-world layouts