# EWallet Aggregator App

A comprehensive e-wallet aggregation platform that allows businesses to manage multiple e-wallet and e-bank accounts in one place.

## 🎯 Features

- ✅ **User Authentication**: Secure registration and login system
- ✅ **Account Linking**: Link multiple e-wallet/e-bank accounts (PayPal, GCash, Maya, Stripe, Square, etc.)
- ✅ **Account Management**: Rename/nickname linked accounts
- ✅ **Dashboard**: Beautiful overview of all accounts and balances
- ✅ **Transaction History**: View all transactions across linked accounts
- ✅ **Payment Processing**: Make payments from any linked account
- ✅ **AI Chatbot Assistant**: Get help with account management and transactions
- ✅ **Third-Party Agreement**: Built-in verification for security
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Project Structure

\`\`\`
ewallet-aggregator/
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   ├── server.js          # Entry point
│   └── package.json
│
└── frontend/               # React TypeScript app
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── services/      # API services
    │   ├── layouts/       # Layout components
    │   ├── styles/        # Global styles
    │   └── App.tsx
    ├── package.json
    └── tailwind.config.js
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env\` file (copy from \`.env.example\`):
   \`\`\`bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ewallet-aggregator
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   \`\`\`

4. Start MongoDB (if running locally):
   \`\`\`bash
   mongod
   \`\`\`

5. Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`

   The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

   The app will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Accounts
- `GET /api/accounts` - Get all linked accounts
- `GET /api/accounts/:id` - Get specific account
- `POST /api/accounts/link` - Link new account
- `POST /api/accounts/:id/verify-agreement` - Verify third-party agreement
- `PUT /api/accounts/:id/nickname` - Update account nickname
- `DELETE /api/accounts/:id` - Unlink account

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/summary` - Get transaction summary
- `POST /api/transactions` - Record new transaction

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot

## 🎨 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

## 📝 Default Demo Credentials

For testing purposes, create an account with:
- Email: demo@example.com
- Password: demo123456

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Third-party agreement verification
- ✅ Protected routes and endpoints
- ✅ CORS enabled for frontend communication

## 🚀 Deployment

### ⚡ Automated GitHub Deployment (Recommended)

**One-click deployment with GitHub Actions:**

1. **Push to GitHub** → Automatic deployment triggered
2. **GitHub Actions** tests and deploys both frontend & backend
3. **Live app** ready in minutes!

**Requirements:**
- GitHub repository
- Vercel account (frontend)
- Railway account (backend)
- MongoDB Atlas (database)

**Setup:**
```bash
# Run the setup script
setup-github.bat

# Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Configure GitHub Secrets:**
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `RAILWAY_TOKEN`
- `VITE_API_URL` (your backend URL)

**That's it!** Every push to `main` automatically deploys.

### Manual Deployment Options

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

#### Backend (Railway)
1. Push code to GitHub
2. Connect to Railway
3. Set environment variables:
   - \`MONGODB_URI\`
   - \`JWT_SECRET\`
4. Deploy

📖 **Detailed instructions:** See [DEPLOYMENT.md](DEPLOYMENT.md)

## 📦 Mock Data

The app comes with mock data for testing. When you link an account, it generates mock balance and transaction data. To use real e-wallet APIs:

1. Get API credentials from each provider (PayPal, GCash, etc.)
2. Update routes in \`backend/routes/\` to call actual APIs
3. Store encrypted API tokens securely

## 🎯 Future Enhancements

- [ ] Real e-wallet API integrations
- [ ] Advanced analytics and reports
- [ ] Budget tracking and alerts
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export transactions to PDF/CSV
- [ ] Integration with accounting software

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ for managing multiple financial accounts efficiently.**
