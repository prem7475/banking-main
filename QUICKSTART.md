# Banking App - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. First Time Setup
When you first open the app, default demo data will be created:
- **Bank Account**: State Bank of India Savings Account with ₹50,000 balance
- **Credit Card**: RUPAY card with ₹100,000 limit
- **Default Credentials**:
  - UPI PIN: `1234`
  - Password: `password123`
  - User: `John Doe`

## Feature Guide

### 1. **Adding Bank Accounts**
Navigate to **My Banks** page:
- Click "Add Bank Account"
- Fill in:
  - Bank Name (e.g., HDFC Bank)
  - Account Name (e.g., Savings Account)
  - Account Number
  - IFSC Code
  - Initial Balance
- Click "Add Account"

### 2. **Adding Credit Cards**
Navigate to **Credit Cards** page:
- Click "Add Credit Card"
- Select card network (Visa, Mastercard, or RuPay)
- Enter:
  - Card Name
  - 16-digit card number
  - Expiry date (MM/YY)
  - 3-digit CVV
  - Credit limit
- Click "Add Card"

### 3. **Making Payments via Scan & Pay**
Navigate to **Scan & Pay** page:

#### For Merchant Payments:
1. Scan/Upload a merchant QR code
2. System detects merchant automatically
3. Select payment source:
   - Bank account, OR
   - RUPAY credit card (for merchants only)
4. Enter amount
5. Click "Pay Now"
6. Verify with UPI PIN: `1234`
7. Payment is recorded in transaction history

#### For P2P Transfers:
1. Scan/Upload a person's QR code
2. System detects as P2P
3. Select bank account only (credit cards not allowed)
4. Enter amount
5. Click "Pay Now"
6. Verify with UPI PIN: `1234`
7. Transfer is recorded in transaction history

### 4. **Setting UPI PIN**
Navigate to **Profile** page:
- Click "Change UPI PIN"
- Enter current PIN: `1234`
- Enter new 4-digit PIN
- Confirm new PIN
- Click "Update"

### 5. **Changing Password**
Navigate to **Profile** page:
- Click "Change Password"
- Enter current password: `password123`
- Enter new password (minimum 6 characters)
- Confirm new password
- Click "Update"

### 6. **Viewing Transaction History**
Navigate to **Transaction History** page:
- View all transactions with details
- Filter by:
  - Transaction type (All, Bank, Card, Merchant, P2P)
  - Account/Card
- See statistics:
  - Total spent
  - Total received
  - Merchant vs P2P payment count

## Key Payment Rules

### Merchant Payments:
- ✅ Can use bank account
- ✅ Can use RUPAY credit card
- ❌ Cannot use Visa or Mastercard
- ✅ Shows merchant badge
- ✅ Requires UPI PIN

### P2P Transfers:
- ✅ Can use bank account only
- ❌ Cannot use any credit card
- ✅ Marked as P2P in history
- ✅ Requires UPI PIN

## Data Storage

All data is stored in browser's localStorage:
- **banking_bankAccounts**: Bank account information
- **banking_creditCards**: Credit card details
- **banking_transactions**: All transaction records
- **banking_userProfile**: User credentials and settings

### Important Notes:
- Data persists across page refreshes
- Clearing browser cache will delete all data
- No internet connection required after first load
- No backend server needed

## Default Test Data

To start with demo data, simply open the app. Default accounts include:
- **Bank**: SBI Savings Account - ₹50,000
- **Credit Card**: RUPAY - ₹100,000 limit

You can add more accounts and cards as needed.

## Troubleshooting

### Payment not recording:
- Verify UPI PIN is correct (default: 1234)
- Ensure bank account is selected for P2P
- Check that merchant is properly detected

### Can't see balance:
- Click the eye icon
- Enter UPI PIN when prompted
- PIN should be your current UPI PIN

### Cards not showing in payment:
- Only RUPAY cards are available for merchant payments
- Add new credit cards from the Credit Cards page
- Ensure card status is "active"

### Lost transaction history:
- Open browser developer tools → Application → Storage
- Verify localStorage has "banking_transactions" key
- If data is missing, it may have been cleared by browser

## Support Features

All pages include:
- ✅ Form validation
- ✅ Error messages
- ✅ Success confirmations
- ✅ Security tips
- ✅ Back navigation
- ✅ Responsive design

## Build for Production

```bash
npm run build
npm start
```

The production build will be optimized and ready to deploy.

## Development

For development with hot reload:
```bash
npm run dev
```

## Customization

To modify default demo data, edit `lib/context/AppContext.tsx`:
- Update `demoBankAccounts` array
- Update `demoCreditCards` array
- Update default `UserProfile` values
