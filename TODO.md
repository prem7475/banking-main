# UdharPay Enhancement & Bug Fix Plan

## Part 1: Fix Critical Bugs (Data Flow & Security)

### 1. Fix UPI PIN Hashing & Validation
- [ ] Update `/api/banks/route.ts` to hash PINs when saving banks (use bcrypt.hash)
- [ ] Update `/api/validate-pin/route.ts` to use bcrypt.compare for PIN validation
- [ ] Test PIN validation works correctly

### 2. Fix Data Fetching on All Pages
- [ ] Update Dashboard (`app/(root)/page.tsx`) to fetch real banks and transactions
- [ ] Update Transfer Funds (`app/(root)/payment-transfer/page.tsx`) to fetch connected banks
- [ ] Update Scan & Pay (`app/(root)/scan-pay/page.tsx`) to fetch connected banks
- [ ] Update Udhari (`app/(root)/udhari/page.tsx`) to fetch real transactions
- [ ] Add useEffect/useState pattern to all pages for data fetching

## Part 2: Apply Liquid Carbon Theme Classes

### 3. Update Form Components
- [ ] Update Connect Bank page to use `.form-group`, `.form-label`, `.form-input`, `.btn-primary`
- [ ] Update Transfer Funds page to use new CSS classes
- [ ] Update Scan & Pay page to use new CSS classes
- [ ] Update all forms across the app

### 4. Add Animations & Polish
- [ ] Add fade-in animations for transaction table rows
- [ ] Add pulse animation for primary buttons
- [ ] Add stagger effects for list items

## Part 3: Testing & Verification

### 5. Test All Flows
- [ ] Test 1: Add Bank flow (verify PIN hashing in MongoDB)
- [ ] Test 2: Data fetching (verify banks appear on all pages)
- [ ] Test 3: PIN validation (wrong/correct PIN handling)
- [ ] Test 4: Add transaction flow (verify appears on dashboard)

## Part 4: Additional Enhancements

### 6. Implement PocketPal Features
- [ ] Complete Udhari split bill tracking
- [ ] Add budgeting with progress bars
- [ ] Implement recurring transactions
- [ ] Add custom categories
- [ ] Integrate Plaid transaction categorization

### 7. UI/UX Improvements
- [ ] Add Quick Add button for transactions
- [ ] Improve mobile responsiveness
- [ ] Add loading states and error handling
- [ ] Implement budget alerts
