# TechFieldSolution LMS Portal

A comprehensive Learning Management System for managing internships, mentorship, and learning content.

## 🚀 Features

- **Role-Based Access Control (RBAC)** - Admins, Mentors, and Interns with custom permissions
- **Internship Catalog** - Browse, filter, and enroll in internship programs
- **Learning Modules** - Structured content delivery with videos, documents, and assignments
- **Progress Tracking** - Real-time monitoring of intern progress and completion
- **Assignment Submission** - File uploads and repository links with cloud storage
- **Communication Hub** - Real-time chat, forums, and announcements
- **Auto-Generated Certificates** - PDF certificates upon program completion
- **Portfolio Builder** - Intern profiles with resume builder and LinkedIn integration
- **Analytics Dashboards** - Role-specific dashboards with insights and metrics
- **Mobile Responsive** - WCAG-compliant accessible UI

## 🛠 Tech Stack

### Frontend
- **Next.js** - React framework with SSR/SSG for SEO
- **React** - Component-based UI
- **Tailwind CSS** - Utility-first styling
- **Context API / Redux** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - RESTful API framework
- **MongoDB / PostgreSQL** - Database
- **JWT / OAuth2** - Authentication
- **Cloudinary** - Cloud file storage

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Kubernetes / AWS ECS** - Orchestration

## 📁 Project Structure

```
/lms-portal/
│
├─ frontend/            # Next.js React app
│   ├─ src/
│   │   ├─ components/  # Reusable UI components
│   │   ├─ pages/       # Next.js pages
│   │   ├─ context/     # Auth and global state
│   │   ├─ styles/      # CSS/Tailwind config
│   │   └─ utils/       # Helper functions
│   └─ public/          # Static assets
│
├─ backend/             # Node.js + Express API
│   ├─ controllers/     # Route handlers
│   ├─ models/          # Database schemas
│   ├─ routes/          # Express routers
│   ├─ middleware/      # Auth & RBAC
│   ├─ services/        # Business logic
│   ├─ config/          # Environment config
│   └─ app.js           # Express setup
│
├─ docker/              # Docker configuration
│   ├─ Dockerfile.backend
│   ├─ Dockerfile.frontend
│   └─ docker-compose.yml
│
├─ .github/             # GitHub Actions workflows
│   └─ workflows/
│
└─ scripts/             # Utility scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB or PostgreSQL
- Docker (optional)
- AWS account (for S3) or Firebase

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/techfieldsolution/lms-portal.git
cd lms-portal
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=lms-uploads
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_OAUTH_CLIENT_ID=your-oauth-client-id
```

5. **Run the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Docker Deployment

```bash
docker-compose up -d
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user

### Internships
- `GET /api/internships` - List/filter internships
- `GET /api/internships/:id` - Get internship details
- `POST /api/internships` - Create internship (Admin)
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

### Enrollments
- `POST /api/internships/:id/enroll` - Enroll in internship
- `GET /api/users/:userId/enrollments` - Get user enrollments
- `PUT /api/enrollments/:id/status` - Update enrollment status

### Modules & Assignments
- `GET /api/internships/:id/modules` - Get internship modules
- `POST /api/modules/:id/assignments` - Create assignment
- `POST /api/assignments/:id/submit` - Submit assignment
- `PUT /api/submissions/:id/grade` - Grade submission

### Communication
- `GET /api/conversations/:threadId` - Get conversation
- `POST /api/conversations/:threadId/messages` - Send message
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement

### Analytics
- `GET /api/users/:id/progress` - Get user progress
- `GET /api/metrics/programs` - Get program metrics
- `GET /api/users/:id/certificate` - Download certificate

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### CI/CD with GitHub Actions

Push to `main` branch triggers automatic:
1. Linting and testing
2. Docker image building
3. Deployment to cloud (AWS/Heroku/Vercel)

### Production Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 👥 User Roles

### Admin
- Manage internship programs
- Create/edit learning modules
- View analytics and reports
- Manage users

### Mentor
- Oversee assigned programs
- Create lessons and assignments
- Review submissions and provide feedback
- Communicate with interns

### Intern
- Browse and enroll in internships
- Access learning content
- Submit assignments
- Track progress and earn certificates

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement in production
- Secure file upload validation

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub or contact support@techfieldsolution.com

---

**Built with ❤️ by TechFieldSolution Team**
