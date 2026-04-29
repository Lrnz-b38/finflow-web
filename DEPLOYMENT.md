# Deployment Guide

Deploy your EWallet Aggregator app to production!

## 📦 Deployment Options

### 🚀 GitHub Actions + Vercel + Railway (Recommended)

**Automated deployment with every push to main branch**

#### Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: [vercel.com](https://vercel.com)
3. **Railway Account**: [railway.app](https://railway.app)
4. **MongoDB Atlas**: [mongodb.com/atlas](https://mongodb.com/atlas)

#### Setup GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

```
VERCEL_TOKEN          # From Vercel Dashboard → Settings → Tokens
VERCEL_ORG_ID         # From Vercel Dashboard → Settings → General
VERCEL_PROJECT_ID     # From Vercel project settings
VITE_API_URL          # Your Railway backend URL (e.g., https://your-app.railway.app)
RAILWAY_TOKEN         # From Railway Dashboard → Account → Tokens
```

#### Deploy Process

1. **Push to GitHub main branch**
2. **GitHub Actions automatically:**
   - Tests your code
   - Deploys backend to Railway
   - Deploys frontend to Vercel
3. **Get your URLs:**
   - Frontend: Vercel provides the URL
   - Backend: Railway provides the API URL

#### Manual Override

You can also deploy manually using the individual options below.

---

## 🔄 GitHub Actions Setup Details

### Workflow Files Created

The following workflows are automatically created in `.github/workflows/`:

- **`deploy.yml`**: Combined workflow (tests + deploys both)
- **`frontend-deploy.yml`**: Frontend-only deployment
- **`backend-deploy.yml`**: Backend-only deployment

### Workflow Triggers

- **Automatic**: Push to `main`/`master` branch
- **Path-based**: Only runs when relevant files change
- **PR checks**: Runs tests on pull requests

### Environment Variables in Workflows

**Frontend Build:**
```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

**Backend Deploy:**
```yaml
env:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Troubleshooting GitHub Actions

**Common Issues:**

1. **"Vercel deployment failed"**
   - Check `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Ensure Vercel project is connected to your GitHub repo

2. **"Railway deployment failed"**
   - Check `RAILWAY_TOKEN`
   - Ensure Railway project is initialized

3. **"Build failed"**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`

4. **"Environment variable not found"**
   - Verify secrets are set in GitHub repo settings
   - Check secret names match exactly

**Logs:**
- Go to GitHub repo → Actions tab
- Click on failed workflow run
- Check logs for detailed error messages

---

### Frontend Deployment

#### Option 1: Vercel (Recommended - Free)

1. **Build the app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Link to GitHub repo (optional)
   - Confirm project settings
   - Deploy!

5. **Set Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com/api`

#### Option 2: Netlify (Free)

1. **Build the app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy:**
   - Drag & drop the `dist/` folder to [Netlify](https://netlify.com)
   - Or connect GitHub repo

3. **Configure:**
   - Add build command: `npm run build`
   - Add publish directory: `dist`

#### Option 3: GitHub Pages (Free)

1. **Update `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/ewallet-aggregator/',
     // ... rest of config
   });
   ```

2. **Build and deploy:**
   ```bash
   npm install gh-pages --save-dev
   npm run build
   npm run gh-pages
   ```

---

### Backend Deployment

#### Option 1: Railway.app (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g railway
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   cd backend
   railway init
   ```

4. **Add MongoDB:**
   - Go to Railway Dashboard
   - Click "+ New"
   - Select "MongoDB"
   - Connect to your project

5. **Add environment variables:**
   - `MONGODB_URI` (from Railway MongoDB)
   - `JWT_SECRET` (generate a strong random string)
   - `NODE_ENV=production`

6. **Deploy:**
   ```bash
   railway up
   ```

#### Option 2: Heroku (Free tier deprecated)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create Procfile** in backend/:
   ```
   web: node server.js
   ```

4. **Add MongoDB:**
   - Use MongoDB Atlas (free tier)
   - Get connection string from Atlas

5. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   git push heroku main
   ```

#### Option 3: DigitalOcean (App Platform)

1. **Push to GitHub**

2. **Go to DigitalOcean App Platform**

3. **Connect GitHub repo**

4. **Configure:**
   - Build command: `npm install`
   - Run command: `npm start`
   - Port: 5000

5. **Add environment variables**

6. **Deploy!**

---

### Database Deployment

#### MongoDB Atlas (Free - Recommended)

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**

2. **Create free cluster:**
   - Sign up (free tier available)
   - Create cluster (512MB free storage)
   - Wait for provisioning (5-10 mins)

3. **Get connection string:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
     ```

4. **Update `.env`:**
   ```
   MONGODB_URI=your_connection_string
   ```

---

## 🔧 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] `.env` file NOT committed to Git
- [ ] `.gitignore` includes `node_modules/` and `.env`
- [ ] `npm run build` works without errors
- [ ] No console errors in browser
- [ ] API calls use environment variables
- [ ] JWT_SECRET is a strong random string
- [ ] Database connection works
- [ ] All dependencies listed in `package.json`

---

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=https://api.yourdomain.com
```

### Backend (`.env`)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_very_strong_random_secret_key_minimum_32_characters
OPENAI_API_KEY=sk-... (optional for AI chatbot)
```

---

## 🚀 Step-by-Step Deployment (Railway + Vercel)

### 1. Prepare Code for Production

```bash
# Backend
cd backend
npm run build  # if applicable
git add .
git commit -m "Ready for production"

# Frontend
cd frontend
npm run build
git add .
git commit -m "Build frontend for production"

# Push to GitHub
git push origin main
```

### 2. Deploy Backend (Railway)

```bash
# Install Railway
npm install -g railway

# Login and init
railway login
cd backend
railway init

# Add environment variables in Railway Dashboard
# MONGODB_URI, JWT_SECRET, NODE_ENV

# Deploy
railway up
# Get your API URL from Railway dashboard
```

### 3. Deploy Frontend (Vercel)

```bash
# Install Vercel
npm install -g vercel

# Deploy
cd frontend
vercel

# When asked, add environment variable:
# VITE_API_URL = https://your-railway-url.com
```

### 4. Test Production

1. Go to your Vercel URL
2. Try to register/login
3. Link an account
4. Make a payment
5. Check chatbot

### 5. Update DNS (Optional)

If you have a domain:
- Frontend: Point to Vercel
- Backend: Point to Railway
- Use subdomain structure:
  - `app.yourdomain.com` → Vercel
  - `api.yourdomain.com` → Railway

---

## 🔒 Security Checklist

- [ ] `JWT_SECRET` is secure and long (32+ characters)
- [ ] `MONGODB_URI` uses strong password
- [ ] Environment variables NOT in code
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] CORS configured properly
- [ ] Rate limiting enabled (for production)
- [ ] Error messages don't leak sensitive info
- [ ] API validates all inputs
- [ ] No console.log of sensitive data

---

## 📊 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build
npm install -g serve
serve -s dist
```

### Backend
- Add caching headers
- Implement pagination
- Use MongoDB indexes
- Add compression middleware

```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🐛 Monitoring & Logs

### Vercel
- Go to Deployment → Analytics
- Monitor Edge Function logs
- Check error logs

### Railway
- Go to Logs tab
- Real-time log streaming
- Error alerts

### MongoDB Atlas
- Go to Monitoring
- Check connection stats
- View slow queries

---

## 🆘 Troubleshooting

### "Cannot GET /"
- Check if frontend is deployed correctly
- Verify build folder was deployed

### API calls return 404
- Check API URL in frontend environment variables
- Verify backend is running
- Check CORS settings

### Database connection fails
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### 502 Bad Gateway
- Check backend logs
- Restart backend process
- Verify environment variables

---

## 💾 Backup Strategy

### Database
```bash
# Backup MongoDB
mongoexport --uri "your_connection_string" \
  --collection accounts \
  --out accounts_backup.json
```

### Code
```bash
# Push to GitHub regularly
git push origin main
```

---

## 📈 Scaling (Future)

When you grow:

1. **Add CDN** - CloudFlare for static files
2. **Database Replication** - MongoDB Atlas M cluster
3. **Load Balancing** - Multiple backend instances
4. **Caching** - Redis for session storage
5. **Analytics** - Sentry for error tracking

---

## 🎉 Deployment Complete!

Once deployed, share your app URL:
```
https://your-app.vercel.app
```

**Congratulations on going live! 🚀**

---

For help:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com
- React: https://react.dev
