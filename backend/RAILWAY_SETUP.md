# Railway Deployment Guide for Backend

## Prerequisites
- Railway account (https://railway.app)
- MongoDB Atlas account (for database)
- Git repository pushed to GitHub

## Step-by-Step Setup

### 1. Create a Railway Project
1. Go to https://railway.app
2. Click "Create New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select the `ewallet-aggregator` repository
5. Railway will automatically detect the Node.js backend

### 2. Configure Environment Variables in Railway
In your Railway project dashboard, go to **Variables** and add these:

```
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ewallet-aggregator?retryWrites=true&w=majority
JWT_SECRET=your_very_strong_random_secret_key_here
NODE_ENV=production
OPENAI_API_KEY=your_openai_key_here
```

**To generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. MongoDB Atlas Setup (if not already done)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user with username and password
4. Get the connection string
5. Add your Railway IP to the IP Whitelist (or use 0.0.0.0/0 for all IPs)
6. Copy the connection string and paste it in Railway's MONGODB_URI variable

### 4. Deploy Configuration
The backend is already configured with:
- ✅ **Procfile** - Tells Railway how to start the app
- ✅ **package.json** - Node.js 18 specified in engines
- ✅ **Build script** - Properly configured for Railway
- ✅ **.nvmrc** - Node version lock file

### 5. Deploy
Once variables are set:
1. Click the "Deploy" button in Railway
2. Watch the build logs
3. Railway will:
   - Install dependencies (`npm install`)
   - Run build script (`npm run build`)
   - Start the server (`npm start`)

### 6. Verify Deployment
After deployment completes:
1. Go to the **Deployments** tab
2. Find the public URL (something like `https://ewallet-backend-prod.up.railway.app`)
3. Test the health endpoint:
   ```
   https://your-railway-url/api/health
   ```
   Should return: `{ "status": "Backend is running" }`

### 7. Connect Frontend to Railway Backend
In your frontend `.env`:
```
VITE_API_URL=https://your-railway-url/api
```

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version is 18+

### App Won't Start
- Check server logs for MongoDB connection errors
- Verify MONGODB_URI is correct
- Check that MongoDB credentials are correct

### API Calls Failing
- Verify CORS is enabled in backend
- Check that environment variables are set correctly
- Test with: `curl https://your-url/api/health`

## Files Modified for Railway Compatibility

- `backend/package.json` - Added Node engine version
- `backend/Procfile` - Added Railway process file
- `backend/.nvmrc` - Added Node version lock
- `backend/railway.json` - Added Railway configuration
- `backend/.env.example` - Added Railway setup instructions

