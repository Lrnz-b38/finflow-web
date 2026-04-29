# 🔌 API Documentation

Base URL: `http://localhost:5000/api`

All requests must include:
```
Content-Type: application/json
Authorization: Bearer {token}  (except for login/register)
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "My Business"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "My Business"
  }
}
```

**Errors:**
- `400` - Missing required fields or user exists
- `500` - Server error

---

### Login User
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "My Business"
  }
}
```

**Errors:**
- `400` - Missing credentials
- `401` - Invalid email or password
- `500` - Server error

---

### Get Current User Profile
**GET** `/auth/me`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "My Business",
  "phoneNumber": "+1-555-0123",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `401` - No token or invalid token
- `500` - Server error

---

### Update User Profile
**PUT** `/auth/profile`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1-555-0123",
  "businessName": "Updated Business Name"
}
```

Response (200):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Updated Business Name",
    "phoneNumber": "+1-555-0123"
  }
}
```

---

## 💳 Account Management Endpoints

### Get All Linked Accounts
**GET** `/accounts`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "provider": "PayPal",
    "accountEmail": "paypal@example.com",
    "nickname": "Main Wallet",
    "balance": 2500.50,
    "currency": "USD",
    "accountStatus": "active",
    "thirdPartyAgreement": true,
    "linkedDate": "2024-01-15T10:30:00Z",
    "lastSynced": "2024-01-15T14:30:00Z"
  }
]
```

**Query Parameters:**
None - returns all accounts for authenticated user

---

### Get Single Account
**GET** `/accounts/:accountId`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "provider": "PayPal",
  "accountEmail": "paypal@example.com",
  "nickname": "Main Wallet",
  "balance": 2500.50,
  "currency": "USD",
  "accountStatus": "active",
  "thirdPartyAgreement": true,
  "linkedDate": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `404` - Account not found
- `401` - Unauthorized

---

### Link New Account
**POST** `/accounts/link`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "provider": "GCash",
  "accountEmail": "user@example.com"
}
```

Response (201):
```json
{
  "message": "Account linking initiated. Please verify third-party agreement.",
  "account": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "provider": "GCash",
    "accountEmail": "user@example.com",
    "nickname": "",
    "balance": 1234.56,
    "currency": "USD",
    "accountStatus": "pending",
    "thirdPartyAgreement": false,
    "linkedDate": "2024-01-15T10:30:00Z"
  }
}
```

**Supported Providers:**
- PayPal
- GCash
- Maya
- Stripe
- Square
- Other

**Errors:**
- `400` - Missing fields or account already linked
- `500` - Server error

---

### Verify Third-Party Agreement
**POST** `/accounts/:accountId/verify-agreement`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "agree": true
}
```

Response (200):
```json
{
  "message": "Account successfully linked and activated",
  "account": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "provider": "GCash",
    "accountEmail": "user@example.com",
    "nickname": "",
    "balance": 1234.56,
    "currency": "USD",
    "accountStatus": "active",
    "thirdPartyAgreement": true,
    "thirdPartyAgreementDate": "2024-01-15T10:35:00Z",
    "linkedDate": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `404` - Account not found
- `400` - Agreement not accepted
- `401` - Unauthorized

---

### Update Account Nickname
**PUT** `/accounts/:accountId/nickname`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "nickname": "Personal Savings"
}
```

Response (200):
```json
{
  "message": "Nickname updated successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "provider": "PayPal",
    "accountEmail": "paypal@example.com",
    "nickname": "Personal Savings",
    "balance": 2500.50,
    "currency": "USD",
    "accountStatus": "active"
  }
}
```

**Errors:**
- `404` - Account not found
- `401` - Unauthorized

---

### Unlink Account
**DELETE** `/accounts/:accountId`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "message": "Account unlinked successfully"
}
```

**Errors:**
- `404` - Account not found
- `401` - Unauthorized

---

## 📊 Transaction Endpoints

### Get All Transactions
**GET** `/transactions`

Headers:
```
Authorization: Bearer {token}
```

Query Parameters:
- `accountId` (optional) - Filter by specific account

Example: `GET /transactions?accountId=507f1f77bcf86cd799439012`

Response (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "linkedAccountId": {
      "_id": "507f1f77bcf86cd799439012",
      "provider": "PayPal",
      "nickname": "Main Wallet"
    },
    "type": "debit",
    "amount": 45.99,
    "currency": "USD",
    "description": "Coffee at Starbucks",
    "merchant": "Starbucks",
    "status": "completed",
    "category": "food",
    "date": "2024-01-15T14:30:00Z"
  }
]
```

---

### Get Transaction Summary
**GET** `/transactions/summary`

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "totalAccounts": 3,
  "activeAccounts": 3,
  "totalBalance": 7234.75,
  "totalSpent": 1250.50,
  "recentTransactions": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "type": "debit",
      "amount": 45.99,
      "description": "Coffee",
      "date": "2024-01-15T14:30:00Z"
    }
  ]
}
```

---

### Record New Transaction
**POST** `/transactions`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "linkedAccountId": "507f1f77bcf86cd799439012",
  "type": "debit",
  "amount": 125.50,
  "description": "Grocery Shopping",
  "merchant": "Walmart",
  "category": "shopping"
}
```

Response (201):
```json
{
  "message": "Transaction recorded successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439021",
    "userId": "507f1f77bcf86cd799439011",
    "linkedAccountId": "507f1f77bcf86cd799439012",
    "type": "debit",
    "amount": 125.50,
    "currency": "USD",
    "description": "Grocery Shopping",
    "merchant": "Walmart",
    "status": "completed",
    "category": "shopping",
    "date": "2024-01-15T15:30:00Z"
  }
}
```

**Supported Categories:**
- food
- transportation
- shopping
- utilities
- entertainment
- other

**Supported Types:**
- credit (money in)
- debit (money out)
- transfer (between accounts)

**Errors:**
- `404` - Account not found
- `400` - Missing required fields
- `500` - Server error

---

## 🤖 Chatbot Endpoints

### Send Message to Chatbot
**POST** `/chatbot/message`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "message": "What's my account balance?"
}
```

Response (200):
```json
{
  "userMessage": "What's my account balance?",
  "botResponse": "I can help you check your account balances. Use the dashboard to view all your linked accounts and their current balances.",
  "timestamp": "2024-01-15T15:35:00Z"
}
```

**Example Queries:**
- "What's my balance?"
- "Show transactions"
- "How do I link an account?"
- "Help me with payments"
- "Tell me about my accounts"

---

## 🧪 Test Requests (Using cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get Accounts
```bash
curl -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Link Account
```bash
curl -X POST http://localhost:5000/api/accounts/link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "PayPal",
    "accountEmail": "paypal@example.com"
  }'
```

---

## 📋 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Something went wrong |

---

## 🔒 Authentication

All endpoints (except `/auth/register` and `/auth/login`) require:

```
Authorization: Bearer {jwt_token}
```

Token format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2NzMyNDU2MDB9.
```

Token expiration: 7 days

---

## 💡 Common Workflows

### Complete Workflow: Register → Link Account → Make Payment

```bash
# 1. Register
TOKEN=$(curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}' | jq -r '.token')

# 2. Link Account
curl -X POST http://localhost:5000/api/accounts/link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'

# 3. Verify Agreement
curl -X POST http://localhost:5000/api/accounts/{accountId}/verify-agreement \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"agree": true}'

# 4. Make Payment
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 🚀 Rate Limiting

Currently: **No rate limiting** (add for production!)

Recommended limits:
- Authentication endpoints: 5 requests/minute
- Transaction endpoints: 100 requests/minute
- Chatbot: 30 requests/minute

---

## 📞 Need Help?

- Check console for detailed error messages
- Review server logs for API errors
- Test with Postman for debugging
- Check MongoDB Atlas for data issues

---

**Happy API integration! 🚀**
