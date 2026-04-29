# Quick Start Guide

## 🎯 Get the App Running in 5 Minutes

### Step 1: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env`

### Step 2: Start Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Start Frontend (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v5.0.0 ready in 123 ms

➜  Local:   http://localhost:3000/
```

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

### Step 5: Create Account & Test

1. Click "Sign up"
2. Fill in details (use any valid email and username)
3. Click "Create Account"
4. You're in! 🎉

### Step 6: Try Features

**Link an Account:**
1. Go to "Accounts"
2. Click "Link Account"
3. Select provider (e.g., "PayPal")
4. Enter any email
5. Verify agreement
6. Account is linked!

**View Dashboard:**
- Go home to see all your balances and recent transactions

**Make a Payment:**
1. Go to "Payment"
2. Select account
3. Enter amount
4. Click "Process Payment"

**Chat with AI:**
1. Click "AI Assistant" in sidebar
2. Ask questions like:
   - "What's my balance?"
   - "Show transactions"
   - "How do I link an account?"

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: Connect failed
```
**Solution:** Make sure MongoDB is running:
```bash
# On Windows
mongod

# On Mac (with Homebrew)
brew services start mongodb-community

# On Linux
sudo service mongod start
```

### Port Already in Use
```
Error: Port 5000 already in use
```
**Solution:** Change port in `backend/.env`:
```
PORT=5001
```

### CORS Errors
**Solution:** Already configured! The backend allows requests from `http://localhost:3000`

### Can't Login After Registration
**Solution:** Make sure backend is running and connected to MongoDB

---

## 📱 Your First Test Flow

1. **Register** → Create account
2. **Link Account** → Add e-wallet
3. **Verify** → Accept agreement
4. **View Dashboard** → See balance
5. **View Transactions** → Check history
6. **Make Payment** → Process transaction
7. **Chat** → Ask AI Assistant

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: "#6366f1",      // Change this
  secondary: "#10b981",
  accent: "#f59e0b",
}
```

### Change App Name
- Backend: Search for "EWallet Aggregator" and replace
- Frontend: Edit `frontend/index.html` title and `MainLayout.tsx`

### Add More Providers
Edit `backend/routes/accounts.js`:
```javascript
provider: {
  type: String,
  enum: ['PayPal', 'GCash', 'Maya', 'YOUR_NEW_PROVIDER'],  // Add here
}
```

---

## 📚 Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check API endpoints in [README.md](./README.md#-api-endpoints)
- Explore the code structure
- Deploy to production!

---

Happy coding! 🚀
