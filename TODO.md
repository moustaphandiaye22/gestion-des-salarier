# Super Admin Dashboard Enhancement - TODO List

## Phase 1: Enhance Entreprises.jsx for Super Admin
- [ ] Add toggle between list (table) and card view
- [ ] Add search bar to filter companies by name/email
- [ ] Display company logos in both table and card views
- [ ] Show additional stats (employees, payments) in card view

## Phase 2: Enhance DashboardEnhanced.jsx
- [ ] Add dedicated companies section with list/card toggle
- [ ] Integrate search functionality for companies
- [ ] Display company logos in dashboard
- [ ] Add payments evolution diagram over 6 months using KPI service
- [ ] Add icons to KPI cards before diagrams
- [ ] Improve company overview section with real data

## Phase 3: Backend Enhancements
- [ ] Verify entreprise API returns logo paths correctly
- [ ] Add search/filter endpoint if needed

## Phase 4: UI/UX Improvements
- [ ] Add distinctive styling for super admin dashboard
- [ ] Ensure responsive design for card/list views
- [ ] Test logo display functionality
- [ ] Test search and filtering
- [ ] Test payments diagram integration

# Employee Details and Salary Payment Management Enhancements

## Backend Security Fix
- [x] Add role-based access control to paiement routes (requireAdminOrSuper middleware)

## Frontend Enhancements
- [x] Create EmployeeDetail.jsx page for viewing detailed employee information
- [x] Create PaiementForm.jsx page for creating/editing payments
- [x] Update EmployeeList.jsx to link to employee detail view
- [x] Update Paiements.jsx to link to payment edit form
- [x] Add payment history in employee detail view
- [x] Update API utilities for payment CRUD operations

## Integration Features
- [x] Add salary calculation preview in employee form
- [ ] Add payment status tracking and notifications
- [ ] Add employee payment summary in detail view
