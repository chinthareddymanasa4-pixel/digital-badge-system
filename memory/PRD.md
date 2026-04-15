# Digital Badge and Certification Generation Software - PRD

## Original Problem Statement
Build a complete full-stack web application called "Digital Badge and Certification Generation Software" for a university final-year project. The system must allow an institution or training provider to create, issue, manage, and verify digital badges and certificates securely.

## User Personas
1. **Administrator** - Institution staff who manages recipients, templates, and issues credentials
2. **Recipient** - Person who receives certificates/badges
3. **Public Verifier** - Anyone who needs to verify credential authenticity

## Core Requirements (Static)
- JWT-based authentication with role-based access control
- Dashboard with statistics
- Full CRUD for recipients with CSV import/export
- Full CRUD for certificate and badge templates
- Credential issuance workflow
- PDF certificate generation with QR codes
- Public verification system
- Verification logging

## Technology Choices
- Frontend: React 19, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, MongoDB
- PDF Generation: ReportLab
- QR Code: qrcode library
- Theme: Purple and white, corporate professional style

## What's Been Implemented (2026-04-07)
- [x] Landing page with hero, features, quick verify
- [x] Admin login page with JWT auth
- [x] Admin dashboard with statistics
- [x] Recipients CRUD with CSV import/export
- [x] Templates CRUD (certificate + badge types)
- [x] Credential issuance workflow
- [x] PDF certificate generation with QR codes
- [x] QR code generation
- [x] Public verification page
- [x] Verification logging
- [x] Demo data seeding (10 recipients, 6 templates, 10 credentials)
- [x] Settings page with environment variable documentation

## Prioritized Backlog

### P0 (Must Have) - COMPLETED
- All core features implemented

### P1 (Should Have)
- Email notifications on credential issuance
- Bulk credential issuance
- Certificate PDF customization (colors, fonts, logos)
- Password reset functionality

### P2 (Nice to Have)
- Recipient portal for viewing their credentials
- Badge image generation (PNG)
- Certificate template visual editor
- API for third-party integrations
- LinkedIn sharing integration

## Next Tasks
1. Add email notification capability
2. Implement bulk credential issuance
3. Add certificate template customization
4. Create recipient portal
5. Add badge image generation
