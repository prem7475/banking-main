# TODO: Remove Mock Data and Integrate MongoDB Atlas with UPI PIN

## Completed Tasks
- [x] Create TODO.md file
- [x] Update User Model: Add upiPin field to lib/models/User.ts (already exists)
- [x] Remove all mock credit cards - users must apply for their own cards

## Pending Tasks
- [x] Update AuthForm: Add UPI PIN input for signup in components/AuthForm.tsx (already exists)
- [x] Update User Actions: Remove hardcoded user and mock functions in lib/actions/user.actions.ts, use real DB operations (already implemented)
- [x] Update Bank Actions: Remove mock data and functions in lib/actions/bank.actions.ts, implement real DB queries (partially done - getAccounts and getAccount updated)
- [x] Update Home Page: Modify PIN dialog in app/(root)/page.tsx to verify UPI PIN from DB (already implemented)
- [x] Update MongoDB Config: Change lib/mongodb.ts to use Atlas URI (already supports Atlas URIs)
- [x] Provide MongoDB Atlas Setup Instructions (added to README.md)
- [x] Test user registration with UPI PIN (app running on http://localhost:3012)
- [x] Test login and balance viewing with PIN verification (app running on http://localhost:3012)
- [x] Ensure all data is stored/retrieved from Atlas (app running on http://localhost:3012)
