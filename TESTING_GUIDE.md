# Testing Guide - Banking App

## Test Environment Setup

Before running tests:
1. Start the dev server: `npm run dev`
2. Open browser to: `http://localhost:3000`
3. Open browser console to monitor any errors
4. Open browser DevTools → Storage → localStorage to inspect data

---

## Test Scenarios

### 1. FIRST-TIME USER TEST

**Objective**: Verify demo data loads correctly

**Steps**:
1. Open the app in a fresh browser profile (incognito mode)
2. Observe the home page loads

**Expected Results**:
- ✅ App loads without errors
- ✅ One bank account visible: "Savings Account - SBI" with ₹50,000
- ✅ One credit card visible: "RUPAY Credit Card" with ₹100,000 limit
- ✅ No transactions visible initially
- ✅ localStorage has 4 keys:
  - `banking_bankAccounts`
  - `banking_creditCards`
  - `banking_transactions`
  - `banking_userProfile`

---

### 2. BANK ACCOUNT MANAGEMENT TEST

#### 2.1 Add Bank Account

**Objective**: Test adding a new bank account

**Steps**:
1. Navigate to "My Banks" page
2. Click "Add Bank Account"
3. Fill form with:
   - Bank Name: `HDFC Bank`
   - Account Name: `Checking Account`
   - Account Number: `9876543210`
   - IFSC Code: `HDFC0000001`
   - Balance: `75000`
4. Click "Add Account"

**Expected Results**:
- ✅ Success message appears
- ✅ New account appears in the list
- ✅ Total accounts count increases
- ✅ Data persists on page refresh

#### 2.2 Remove Bank Account

**Objective**: Test removing a bank account

**Steps**:
1. On "My Banks" page
2. Click trash icon on newly added account
3. Confirm deletion in dialog

**Expected Results**:
- ✅ Success message appears
- ✅ Account removed from list
- ✅ Total accounts count decreases
- ✅ Deletion persists on page refresh

#### 2.3 Invalid Account Input

**Objective**: Test form validation

**Steps**:
1. Try to add account with missing fields
2. Leave "Bank Name" empty
3. Click "Add Account" (button should be disabled)

**Expected Results**:
- ✅ Button is disabled
- ✅ No error message (validation prevents submission)
- ✅ Form clears and dialog closes after successful add

---

### 3. CREDIT CARD MANAGEMENT TEST

#### 3.1 Add Valid Credit Card

**Objective**: Test adding a valid credit card

**Steps**:
1. Navigate to "Credit Cards" page
2. Click "Add Credit Card"
3. Fill form with:
   - Card Name: `My Mastercard`
   - Card Network: `Mastercard`
   - Card Number: `5234567890123456`
   - Expiry Date: `12/25`
   - CVV: `456`
   - Credit Limit: `200000`
   - Balance: `50000`
4. Click "Add Card"

**Expected Results**:
- ✅ Success message appears
- ✅ Card appears in the grid
- ✅ Card shows red/pink gradient (Mastercard color)
- ✅ Card count increases
- ✅ Data persists on refresh

#### 3.2 Test Card Number Validation

**Objective**: Verify invalid card numbers are rejected

**Steps**:
1. Click "Add Credit Card"
2. Try different card numbers:
   - `123` (too short)
   - `12345678901234567` (too long)
   - `abcdefghijklmnop` (letters)
3. Verify button stays disabled

**Expected Results**:
- ✅ Validation error shows: "Must be 16 digits"
- ✅ Button remains disabled
- ✅ Valid 16-digit number clears the error

#### 3.3 Test Expiry Date Validation

**Objective**: Verify MM/YY format is enforced

**Steps**:
1. Click "Add Credit Card"
2. Try different formats:
   - `1225` (no slash)
   - `12/2025` (wrong format)
   - `13/25` (invalid month)
   - `12/25` (valid)

**Expected Results**:
- ✅ Only MM/YY format accepted
- ✅ Error message shows for invalid format
- ✅ Valid format clears error

#### 3.4 Remove Credit Card

**Objective**: Test removing a credit card

**Steps**:
1. Click trash icon on any card
2. Confirm deletion in dialog

**Expected Results**:
- ✅ Card removed from grid
- ✅ Success message shows
- ✅ Card count decreases
- ✅ Deletion persists on refresh

---

### 4. SECURITY SETTINGS TEST

#### 4.1 Change Password

**Objective**: Test password change functionality

**Steps**:
1. Go to "Profile" page
2. Click "Change Password"
3. Enter:
   - Current Password: `password123`
   - New Password: `NewPass456`
   - Confirm Password: `NewPass456`
4. Click "Update"

**Expected Results**:
- ✅ Success message appears
- ✅ Dialog closes
- ✅ Password changes in localStorage

#### 4.2 Password Validation

**Objective**: Test password requirements

**Steps**:
1. Click "Change Password"
2. Try these scenarios:
   - Current password wrong: `wrongpass`
   - New password too short: `ab123`
   - Passwords don't match: `New123` vs `New456`
   - Correct password: Use actual current

**Expected Results**:
- ✅ Error messages for each scenario
- ✅ Password not updated for invalid entries
- ✅ Success only with valid inputs

#### 4.3 Change UPI PIN

**Objective**: Test UPI PIN change

**Steps**:
1. Go to "Profile" page
2. Click "Change UPI PIN"
3. Enter:
   - Current PIN: `1234`
   - New PIN: `5678`
   - Confirm PIN: `5678`
4. Click "Update"

**Expected Results**:
- ✅ Success message appears
- ✅ Dialog closes
- ✅ New PIN stored in localStorage
- ✅ Old PIN no longer works

#### 4.4 UPI PIN Validation

**Objective**: Test PIN format requirements

**Steps**:
1. Click "Change UPI PIN"
2. Try these scenarios:
   - Non-numeric: `abcd`
   - Too short: `123`
   - Too long: `12345`
   - Correct: `1234`

**Expected Results**:
- ✅ Only 4-digit numeric accepted
- ✅ Error for invalid format
- ✅ Button disabled for invalid input

---

### 5. SCAN & PAY TEST

#### 5.1 Merchant Payment with Bank Account

**Objective**: Test merchant detection and bank payment

**Steps**:
1. Go to "Scan & Pay"
2. Simulate QR scan with merchant name: `Amazon`
3. Select payment method: Bank account (SBI)
4. Enter amount: `500`
5. Click "Pay Now"
6. Enter UPI PIN: `1234` (or new PIN if changed)

**Expected Results**:
- ✅ System detects as "Merchant Payment"
- ✅ Merchant badge shows
- ✅ Both bank and RUPAY card options available
- ✅ RUPAY card option available
- ✅ Payment marked as "completed"
- ✅ Transaction appears in history
- ✅ Transaction shows merchant name

#### 5.2 Merchant Payment with RUPAY Card

**Objective**: Test merchant payment using RUPAY card

**Steps**:
1. Go to "Scan & Pay"
2. Scan merchant QR: `Flipkart`
3. Select RUPAY credit card
4. Enter amount: `2000`
5. Click "Pay Now"
6. Enter PIN: current UPI PIN

**Expected Results**:
- ✅ RUPAY card option is available for merchants
- ✅ Visa/Mastercard options NOT available (only RUPAY)
- ✅ Payment recorded as credit card payment
- ✅ Transaction shows card name as source

#### 5.3 P2P Transfer (No Merchant)

**Objective**: Test P2P payment restrictions

**Steps**:
1. Go to "Scan & Pay"
2. Scan QR for person: `user@upi`
3. Observe payment method options

**Expected Results**:
- ✅ System detects as "P2P Payment"
- ✅ Only bank account option available
- ✅ RUPAY card option NOT available
- ✅ Error message if trying to use card

#### 5.4 Merchant Payment with Invalid PIN

**Objective**: Test PIN verification

**Steps**:
1. Scan merchant QR
2. Select bank account
3. Enter amount
4. Click "Pay Now"
5. Enter wrong PIN: `9999`

**Expected Results**:
- ✅ PIN dialog appears
- ✅ Error message: "Invalid UPI PIN"
- ✅ Payment NOT processed
- ✅ Transaction NOT added to history
- ✅ Dialog stays open for retry

#### 5.5 Insufficient Balance Check

**Objective**: Test balance validation (if implemented)

**Steps**:
1. Scan merchant QR
2. Select bank account with ₹50,000 balance
3. Try to pay ₹100,000

**Expected Results**:
- ✅ Either prevents payment or records as overdraft
- ✅ Clear indication in transaction history
- ✅ Balance logic is consistent

---

### 6. TRANSACTION HISTORY TEST

#### 6.1 View All Transactions

**Objective**: Test transaction list displays correctly

**Steps**:
1. Make 3-4 payments via Scan & Pay
2. Go to "Transaction History"
3. Observe statistics and list

**Expected Results**:
- ✅ All payments appear in list
- ✅ Statistics updated:
  - Total transactions count correct
  - Total spent amount correct
  - Merchant vs P2P count correct
- ✅ Transactions sorted by date (newest first)
- ✅ Each shows: amount, recipient, method, date, status

#### 6.2 Filter by Type

**Objective**: Test filtering functionality

**Steps**:
1. Make different types of payments:
   - Merchant payment with bank
   - Merchant payment with card
   - P2P transfer with bank
2. Go to "Transaction History"
3. Click "Filter by Type"
4. Select "Merchant Payments"

**Expected Results**:
- ✅ Only merchant payments show
- ✅ P2P transfers hidden
- ✅ Correct count displayed
- ✅ Filter by other types works similarly

#### 6.3 Filter by Account/Card

**Objective**: Test account-based filtering

**Steps**:
1. Make payments from different accounts
2. Go to "Transaction History"
3. Click "Filter by Account/Card"
4. Select specific account

**Expected Results**:
- ✅ Only transactions from that account show
- ✅ Correct count displayed
- ✅ Filter by card works similarly
- ✅ "All" option shows everything

#### 6.4 Transaction Details

**Objective**: Verify all transaction info is correct

**Steps**:
1. Make a test payment noting:
   - Exact amount
   - Payment method used
   - Time it was made
2. Check transaction history

**Expected Results**:
- ✅ Amount matches exactly
- ✅ Payment method correct (bank/card)
- ✅ Date and time recorded
- ✅ Merchant/recipient name correct
- ✅ Status shows "completed"
- ✅ Type icon correct (merchant/P2P)

---

### 7. DATA PERSISTENCE TEST

#### 7.1 Refresh and Data Retention

**Objective**: Verify data persists across refreshes

**Steps**:
1. Add a bank account
2. Add a credit card
3. Make a payment
4. Refresh page (Ctrl+R)
5. Check all data is still there

**Expected Results**:
- ✅ Bank account still visible
- ✅ Credit card still visible
- ✅ Transaction still recorded
- ✅ No data loss

#### 7.2 localStorage Inspection

**Objective**: Verify data structure in localStorage

**Steps**:
1. Open DevTools (F12)
2. Go to Application → Storage → localStorage
3. Check for keys:
   - `banking_bankAccounts`
   - `banking_creditCards`
   - `banking_transactions`
   - `banking_userProfile`

**Expected Results**:
- ✅ All 4 keys exist
- ✅ Data is valid JSON
- ✅ Can be parsed and inspected
- ✅ Changes persist after refresh

---

### 8. EDGE CASES & ERROR HANDLING

#### 8.1 Empty State Tests

**Objective**: Test behavior with no data

**Steps**:
1. Clear localStorage
2. Refresh app
3. Go to each page

**Expected Results**:
- ✅ Demo data loads
- ✅ No errors in console
- ✅ All pages functional
- ✅ Add buttons work

#### 8.2 Large Dataset Test

**Objective**: Test with many records

**Steps**:
1. Add 20+ bank accounts
2. Add 20+ credit cards
3. Make 50+ transactions
4. Check performance

**Expected Results**:
- ✅ App still responsive
- ✅ No performance degradation
- ✅ Filtering still works
- ✅ No crashes or errors

#### 8.3 Concurrent Operations

**Objective**: Test rapid user actions

**Steps**:
1. Quickly add/remove accounts
2. Quickly change PIN and password
3. Rapidly make payments

**Expected Results**:
- ✅ No data corruption
- ✅ All operations complete
- ✅ State remains consistent
- ✅ No duplicate entries

---

### 9. MOBILE RESPONSIVENESS TEST

#### 9.1 Mobile View

**Objective**: Test on mobile-sized screens

**Steps**:
1. Open DevTools → Device Emulation
2. Select mobile device (iPhone 12, etc.)
3. Test each page:
   - Home
   - My Banks
   - Credit Cards
   - Profile
   - Scan & Pay
   - Transaction History

**Expected Results**:
- ✅ All pages responsive
- ✅ No horizontal scrolling
- ✅ Touch-friendly buttons
- ✅ Form inputs work on mobile
- ✅ Navigation accessible

#### 9.2 Tablet View

**Objective**: Test on tablet-sized screens

**Steps**:
1. Select tablet device (iPad, etc.)
2. Test layout and functionality

**Expected Results**:
- ✅ Layout optimized for tablet
- ✅ All features accessible
- ✅ Good use of screen space

---

### 10. PERFORMANCE TEST

#### 10.1 Initial Load Time

**Objective**: Measure app startup time

**Steps**:
1. Open DevTools → Network tab
2. Clear cache
3. Reload page
4. Measure total load time

**Expected Results**:
- ✅ Initial load < 3 seconds
- ✅ No blocking resources
- ✅ All assets loaded

#### 10.2 Operation Speed

**Objective**: Test responsiveness of operations

**Steps**:
1. Add account - should be instant
2. Make payment - should be instant
3. Change PIN - should be instant
4. Filter transactions - should be instant

**Expected Results**:
- ✅ All operations complete within 1 second
- ✅ No lag or delays
- ✅ Smooth animations

---

## Test Data Sets

### Sample Bank Accounts
```
1. State Bank of India
   Account: 1234567890
   IFSC: SBIN0001234
   Balance: ₹50,000

2. HDFC Bank
   Account: 9876543210
   IFSC: HDFC0000001
   Balance: ₹75,000

3. ICICI Bank
   Account: 5555666677
   IFSC: ICIC0000005
   Balance: ₹100,000
```

### Sample Credit Cards
```
1. RUPAY Card
   Number: 5234567890123456
   Expiry: 12/25
   CVV: 456
   Limit: ₹100,000

2. Visa Card
   Number: 4111111111111111
   Expiry: 06/26
   CVV: 123
   Limit: ₹50,000

3. Mastercard
   Number: 5234567890123456
   Expiry: 09/27
   CVV: 789
   Limit: ₹200,000
```

### Sample Merchants
```
- Amazon
- Flipkart
- Swiggy
- Zomato
- Uber
- Myntra
```

---

## Troubleshooting Guide

### Issue: Data not persisting
**Solution**: 
- Check if localStorage is enabled
- Check browser's storage settings
- Clear cache and retry

### Issue: PIN verification fails
**Solution**:
- Verify correct current PIN
- Check if PIN was actually saved
- Try changing PIN again

### Issue: Payment not recording
**Solution**:
- Verify UPI PIN is correct
- Check payment method is selected
- Check amount is valid
- Verify in localStorage

### Issue: Mobile buttons not clickable
**Solution**:
- Check viewport settings
- Use proper touch targets (44x44px minimum)
- Check for z-index issues

---

## Sign-Off

All tests should be completed before deployment:
- [ ] All 10 test scenarios passed
- [ ] No console errors
- [ ] Data persists correctly
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Edge cases handled

**Date Tested**: _______________
**Tester Name**: _______________
**Status**: ✅ READY FOR DEPLOYMENT
