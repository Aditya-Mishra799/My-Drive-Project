# My Drive

A full-stack file sharing application similar to Google Drive, built with React, Node.js, Express, SQL, and AWS S3.

## Features

### Core Features
- User authentication (signup, login, logout)
- File upload with bulk upload support
- File compression for text-based files
- File download
- File management (view, delete)
- Share files with specific users
- Generate shareable links
- View files shared with you
- Activity logging (upload, download, share actions)

### Security Features
- JWT-based authentication
- Secure file access control
- Authorization checks for all file operations
- Only authenticated users can access shared links
- File type and size validation
- Expirable shares and links

### Storage
- AWS S3 for file storage
- Storage abstraction layer (easy to swap providers)
- File compression to reduce storage costs

## Tech Stack

### Frontend
- React 19
- React Router for navigation
- React Hook Form with Zod validation
- Lucide React for icons
- CSS Modules for styling
- Pako for file compression

### Backend
- Node.js with Express 5
- PostgreSQL for database
- AWS SDK for S3 operations
- JWT for authentication
- Multer for file uploads
- Pako for file compression

## Project Structure

```
.
├── backend/
│   ├── migrations/          # Database migrations
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routers/         # API routes
│   │   ├── services/        # Business logic
│   │   ├── storage/         # Storage abstraction layer
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── Pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── validation-schema/ # Form validation schemas
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- AWS S3 bucket
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (use `.env.example` as template):
```env
PORT=5000
NODE_ENV=development

DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret_key
#comma separated origins
ALLOWED_ORIGINS=http://localhost:5173

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_s3_bucket_name
```

4. Run the database migrations:
```bash
psql -U your_db_user -d your_db_name -f init.sql
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_BASE_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Database Schema

### Tables

1. **users** - User accounts
2. **files** - File metadata
3. **file_shares** - User-to-user file sharing
4. **shareable_links** - Shareable link tokens
5. **file_activity_log** - Activity tracking

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Files
- `POST /api/files/upload` - Upload single file
- `POST /api/files/upload/multiple` - Upload multiple files
- `GET /api/files/my-files` - Get user's files (paginated)
- `GET /api/files/shared-with-me` - Get files shared with user (paginated)
- `GET /api/files/:fileId/download` - Download file
- `DELETE /api/files/:fileId` - Delete file

### Sharing
- `POST /api/files/:fileId/share/user` - Share file with user
- `DELETE /api/files/:fileId/share/user` - Remove user share
- `GET /api/files/:fileId/shares` - Get file shares
- `POST /api/files/:fileId/share/link` - Generate shareable link
- `GET /api/files/:fileId/share/links` - Get shareable links
- `DELETE /api/files/share/link/:linkId` - Delete shareable link
- `GET /api/files/share/link/:token` - Access file via link

### Activity
- `GET /api/files/:fileId/activity` - Get file activity log
- `GET /api/files/activity/me` - Get user activity log

## Usage

1. Sign up for an account
2. Log in with your credentials
3. Upload files (single or multiple)
4. View your files in the dashboard
5. Share files with other users by email
6. Generate shareable links with optional expiry
7. Access files shared with you in the "Shared" section
8. View your activity log in the "Activity" section
9. Download files directly from the interface

## Security Considerations

- All routes require authentication
- File access is validated on every request
- Only file owners can share or delete files
- Shareable links can only be accessed by authenticated users
- File type validation prevents malicious uploads
- File size limits prevent abuse
- SQL injection protection via parameterized queries
