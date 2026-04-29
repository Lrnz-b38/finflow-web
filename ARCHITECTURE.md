# Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                     React Frontend (Port 3000)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Login      │  │  Dashboard   │  │  Accounts    │           │
│  │  Register    │  │  Transactions│  │  Payment     │           │
│  │  Profile     │  │  Chatbot     │  │  AI Assist   │           │
│  └──────┬───────┘  └──────────────┘  └──────────────┘           │
│         │                                                         │
│         │ HTTP/REST + JWT Token                                 │
│         ↓                                                         │
├─────────────────────────────────────────────────────────────────┤
│           Node.js/Express API Server (Port 5000)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Auth Routes  │  │ Account Mgmt  │  │ Transactions │           │
│  │ - login      │  │ - link        │  │ - get all    │           │
│  │ - register   │  │ - verify      │  │ - summary    │           │
│  │ - profile    │  │ - unlink      │  │ - record     │           │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘           │
│         │                 │                  │                   │
│         │ Mongoose ODM    │                  │                   │
│         └─────────────────┼──────────────────┘                   │
│                           ↓                                       │
├─────────────────────────────────────────────────────────────────┤
│            MongoDB Database (Local or Atlas)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Users        │  │Linked Accounts│ │Transactions  │           │
│  │- email       │  │- provider     │ │- type        │           │
│  │- password    │  │- balance      │ │- amount      │           │
│  │- profile     │  │- status       │ │- category    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Authentication Flow

```
User
  │
  ├─→ [Registration Page]
  │     │
  │     └─→ POST /api/auth/register
  │           { username, email, password, ... }
  │           ↓
  │         [Hash Password] → [Create User] → [Generate JWT]
  │           ↓
  │        Login Successful
  │
  └─→ [Login Page]
        │
        └─→ POST /api/auth/login
              { email, password }
              ↓
            [Verify Password] → [Generate JWT]
              ↓
           JWT Token Stored in LocalStorage
```

---

## 💳 Account Linking Flow

```
User
  │
  └─→ [Accounts Page] → [Link Account Button]
        │
        └─→ [LinkAccountModal]
              │
              ├─ Step 1: Select Provider & Email
              │    └─→ POST /api/accounts/link
              │         { provider, accountEmail }
              │         ↓
              │      [Create Pending Account]
              │      [Generate Mock Balance]
              │
              ├─ Step 2: Show Verification Dialog
              │    └─ Display Third-Party Agreement Info
              │
              └─ Step 3: Verify Agreement
                   └─→ POST /api/accounts/:id/verify-agreement
                        ↓
                     [Activate Account]
                     [Set Agreement = true]
                     ↓
                  Account Active ✅
```

---

## 💰 Transaction Flow

```
User at Payment Page
  │
  └─→ Select Account → Enter Amount → Select Category
        │
        └─→ POST /api/transactions
             { linkedAccountId, type, amount, description, category }
             ↓
          [Create Transaction Record]
          [Update Account Balance]
             ↓
          Transaction Recorded ✅
          
View Transactions Page
  │
  └─→ GET /api/transactions?accountId=xxx&type=debit
        ↓
     [Query MongoDB]
     [Return Filtered Results]
        ↓
     Display in UI with Filters
```

---

## 🤖 Chatbot Flow

```
User
  │
  └─→ Click AI Assistant
        │
        └─→ Type Message
             │
             └─→ POST /api/chatbot/message
                  { message: "What's my balance?" }
                  ↓
               [Keyword Matching Analysis]
               [Generate Response]
                  ↓
               Return Bot Message
             │
             └─→ Display in Chat Widget
```

---

## 🔒 Security & Authentication

```
┌─ Frontend ─────────────────────┐
│                                 │
│  LocalStorage: JWT Token        │
│         ↓ (on each request)      │
│  Authorization: Bearer <token>  │
│         ↓                        │
├─────────── API ────────────────┤
│                                 │
│  Middleware: auth.js            │
│  Verify JWT Token               │
│  Extract userId                 │
│         ↓                        │
│  If Valid → Continue            │
│  If Invalid → 401 Error         │
│         ↓                        │
├─────────── Database ───────────┤
│                                 │
│  Query with userId Filter       │
│  Ensure Data Isolation          │
│         ↓                        │
│  Return User's Data Only        │
│                                 │
└─────────────────────────────────┘
```

---

## 📊 Data Model Relationships

```
User (1) ─── has many ─→ (Many) LinkedAccount
  │
  ├─ _id
  ├─ username
  ├─ email
  ├─ password (hashed)
  ├─ firstName, lastName
  ├─ businessName
  └─ phoneNumber


LinkedAccount (1) ─── has many ─→ (Many) Transaction
  │
  ├─ _id
  ├─ userId (FK → User)
  ├─ provider (PayPal, GCash, etc.)
  ├─ accountEmail
  ├─ nickname
  ├─ balance
  ├─ currency
  ├─ accountStatus (active/pending/inactive)
  ├─ thirdPartyAgreement
  └─ linkedDate


Transaction
  │
  ├─ _id
  ├─ userId (FK → User)
  ├─ linkedAccountId (FK → LinkedAccount)
  ├─ type (credit/debit/transfer)
  ├─ amount
  ├─ description
  ├─ merchant
  ├─ category
  ├─ status (completed/pending/failed)
  └─ date
```

---

## 🔑 API Communication Example

```
Frontend Request:
┌────────────────────────────────────────┐
│ GET /api/accounts                       │
│ Authorization: Bearer eyJhbGc...       │
│ Content-Type: application/json          │
└────────────────────────────────────────┘
        ↓
Backend Processing:
┌────────────────────────────────────────┐
│ 1. Check Authorization header          │
│ 2. Verify JWT token validity           │
│ 3. Extract userId from token           │
│ 4. Query: LinkedAccount.find({         │
│    userId: userId                       │
│ })                                     │
│ 5. Return sorted results               │
└────────────────────────────────────────┘
        ↓
Frontend Response:
┌────────────────────────────────────────┐
│ Status: 200 OK                          │
│ [                                      │
│   {                                    │
│     _id: "xxx",                        │
│     provider: "PayPal",                │
│     accountEmail: "user@example.com",  │
│     nickname: "Main Account",          │
│     balance: 2500.50,                  │
│     accountStatus: "active",           │
│     ...                                │
│   }                                    │
│ ]                                      │
└────────────────────────────────────────┘
```

---

## 🌐 Frontend Component Hierarchy

```
<App>
  │
  ├─→ <AuthProvider>
  │    └─→ Context for auth state
  │
  └─→ <Router>
       │
       ├─→ <Login />
       ├─→ <Register />
       │
       ├─→ <ProtectedRoute>
       │   │
       │   └─→ <MainLayout>
       │       │
       │       ├─→ <Sidebar>
       │       │   ├─ Navigation Links
       │       │   ├─ Chatbot Toggle
       │       │   └─ Logout
       │       │
       │       ├─→ <TopBar>
       │       │   ├─ User Info
       │       │   ├─ Business Name
       │       │   └─ Avatar
       │       │
       │       └─→ <Content>
       │           │
       │           ├─→ <Dashboard />
       │           │   ├─ Stats Cards
       │           │   └─ Recent Transactions
       │           │
       │           ├─→ <Accounts />
       │           │   ├─ LinkAccountModal
       │           │   └─ Account Cards
       │           │
       │           ├─→ <Transactions />
       │           │   ├─ Filters
       │           │   └─ Transaction List
       │           │
       │           ├─→ <Payment />
       │           │   └─ Payment Form
       │           │
       │           └─→ <Profile />
       │               └─ Profile Edit Form
       │
       └─→ <Chatbot />
           ├─ Message Display
           ├─ Message Input
           └─ Send Button
```

---

## 🚀 Deployment Architecture (Future)

```
Vercel
┌──────────────────┐─→ React SPA
│   Frontend       │   (Static Files)
│  (Deployed)      │   CDN Cached
└────────┬─────────┘
         │ API Calls
         ↓
Railway / Heroku
┌──────────────────────┐
│   Backend Server     │
│   (Node.js Express)  │
└────────┬─────────────┘
         │ Database Queries
         ↓
MongoDB Atlas
┌──────────────────┐
│  Cloud Database  │
│   (Encrypted)    │
└──────────────────┘
```

---

This architecture ensures:
✅ **Scalability** - Easy to add features
✅ **Security** - JWT + Password hashing
✅ **Data Isolation** - Each user sees only their data
✅ **Performance** - Indexed queries
✅ **Maintainability** - Clear separation of concerns
