# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Cloudinary Account (for file storage)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/techfieldsolution/lms-portal.git
cd lms-portal
```

### 2. Install Dependencies

```bash
npm run install:all
```

Or install individually:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lms

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=lms-uploads

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@techfieldsolution.com

# OAuth2
OAUTH_CLIENT_ID=your-google-oauth-client-id
OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
OAUTH_CALLBACK_URL=http://localhost:5000/api/auth/oauth/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TechFieldSolution LMS
NEXT_PUBLIC_OAUTH_CLIENT_ID=your-google-oauth-client-id
```

### 4. Database Setup

Start MongoDB:

```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
mongod
```

### 5. Start Development Servers

#### Windows (PowerShell)

**Option 1: Using the provided setup script**

```powershell
# From root directory (f:\LMS)
.\scripts\setup.ps1
```

This will:
- Check Node.js, npm, and MongoDB prerequisites
- Install all dependencies (root, backend, frontend)
- Copy `.env.example` files to `.env` if they don't exist

**Option 2: Manual installation and start**

```powershell
# Install dependencies
cd f:\LMS\backend
npm install

cd f:\LMS\frontend
npm install

# Start backend (in first terminal)
cd f:\LMS\backend
npm run dev

# Start frontend (in second terminal - open new PowerShell window)
cd f:\LMS\frontend
npm run dev
```

#### Linux/Mac

**Option 1: Using the provided setup script**

```bash
# From root directory
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

**Option 2: Manual installation and start**

```bash
# Install dependencies
cd backend
npm install

cd ../frontend
npm install

# Start backend (in first terminal)
cd backend
npm run dev

# Start frontend (in second terminal)
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Docker Deployment

### Using Docker Compose

**Note:** Your `.env` file is already configured to use MongoDB Atlas, so the MongoDB container in `docker-compose.yml` is optional. You can use your existing Atlas connection.

```powershell
# Windows PowerShell
cd f:\LMS
docker-compose up --build -d
```

```bash
# Linux/Mac
docker-compose up --build -d
```

This will start:
- MongoDB container (optional - you can disable this and use Atlas)
- Backend API on port 5000
- Frontend on port 3000

### Stop services:

```powershell
docker-compose down
```

### View logs:

```powershell
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild after code changes:

```powershell
docker-compose up --build -d
```

## Cloudinary Setup

1. Create a free account at https://cloudinary.com
2. Go to Dashboard to find your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. (Optional) Create upload presets for different file types
4. Update the environment variables with your credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_FOLDER` (folder name for organizing uploads)

## Email Configuration

### Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings → Security
   - Select "App passwords"
   - Generate a new password for "Mail"
3. Use this password in the `EMAIL_PASS` environment variable

## Creating Admin User

After starting the backend, you can create an admin user using the API:

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"Admin","lastName":"User","email":"admin@techfieldsolution.com","password":"Admin@123456","role":"admin"}'
```

**Bash/curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@techfieldsolution.com",
    "password": "Admin@123456",
    "role": "admin"
  }'
```

Or use an API testing tool like Postman or Thunder Client (VS Code extension).

## Production Deployment

### Prerequisites

- Domain name (e.g., lms.techfieldsolution.com)
- Cloud server (AWS EC2, DigitalOcean, etc.)
- SSL certificate

### Steps

1. **Build the applications:**

```bash
npm run build
```

2. **Set environment to production:**

Update `.env` files with production values and set `NODE_ENV=production`

3. **Deploy using Docker:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Configure Nginx as reverse proxy:**

```nginx
server {
    listen 80;
    server_name lms.techfieldsolution.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL with Let's Encrypt:**

```bash
sudo certbot --nginx -d lms.techfieldsolution.com
```

## Quick Start Guide (Windows)

**Step 1:** Ensure you have Node.js 18+ installed
```powershell
node --version
npm --version
```

**Step 2:** Your `.env` is already configured with:
- ✅ MongoDB Atlas connection (TFS-LMS database)
- ✅ Cloudinary credentials
- ⚠️ Update `JWT_SECRET` to a secure random string

**Step 3:** Install dependencies
```powershell
cd f:\LMS\backend
npm install
```

**Step 4:** Create `frontend/.env.local`
```powershell
cd f:\LMS\frontend
New-Item -ItemType File -Path ".env.local" -Force
```

Add this content to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Step 5:** Install frontend dependencies
```powershell
npm install
```

**Step 6:** Start backend (Terminal 1)
```powershell
cd f:\LMS\backend
npm run dev
```

**Step 7:** Start frontend (Terminal 2 - new PowerShell window)
```powershell
cd f:\LMS\frontend
npm run dev
```

**Step 8:** Open browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

**Step 9:** Create admin user (use PowerShell or Postman)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"Admin","lastName":"User","email":"admin@techfieldsolution.com","password":"Admin@123456","role":"admin"}'
```

## Testing

### MongoDB Connection Issues

**Check if MongoDB is running (local installation):**
```powershell
# Windows - check MongoDB service
Get-Service MongoDB

# Or test connection with mongosh
mongosh "mongodb://localhost:27017/TFS-LMS"
```

**For MongoDB Atlas:**
- Verify your connection string in `backend/.env`
- Check IP whitelist in Atlas dashboard (add 0.0.0.0/0 for all IPs during development)
- Ensure network access is configured
- Your current URI: `mongodb+srv://techfieldsolutionsocial_db_user:TechField@techfieldsolution.zsni4rn.mongodb.net/TFS-LMS`

### Port Already in Use

**Windows PowerShell:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Cloudinary Upload Issues

- Verify credentials in `backend/.env`:
  - `CLOUDINARY_CLOUD_NAME=dbvmdhdjl`
  - `CLOUDINARY_API_KEY=268988225168126`
  - `CLOUDINARY_API_SECRET` is set correctly
- Check folder permissions in Cloudinary dashboard
- Ensure `CLOUDINARY_FOLDER=lms-uploads` exists (auto-created on first upload)

### CORS Issues

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL:
```env
FRONTEND_URL=http://localhost:3000
```

### Module Not Found Errors

```powershell
# Clear node_modules and reinstall
cd f:\LMS\backend
Remove-Item -Recurse -Force node_modules
npm install

cd f:\LMS\frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/techfieldsolution/lms-portal/issues
- Email: support@techfieldsolution.com

## License

MIT License - see LICENSE file for details
