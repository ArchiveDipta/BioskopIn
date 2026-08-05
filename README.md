# BioskopIn Backend API 🎬🍿

A progressive Node.js backend application built with **NestJS**, **Prisma ORM**, and **MySQL**, designed to power a modern cinema ticketing platform (BioskopIn). It provides robust and secure APIs for managing movies, studios, seating, showtimes, and an end-to-end ticketing system.

## 🚀 Key Features

### 1. Authentication & Authorization (RBAC)
- **Local Authentication**: Supports standard registration and login using Email and Password (secured with `bcryptjs`).
- **Google OAuth 2.0 Integration**: Supports seamless login via Google for both **Web Clients** (via redirection) and **Native Android Clients** (via ID Token verification).
- **Custom JWT Generation**: Generates secure JSON Web Tokens for stateless authentication.
- **Role-Based Access Control (RBAC)**: Enforces strict access boundaries using custom `@Roles()` decorators (`ADMIN` vs `USER`). All new sign-ups default to the `USER` role.

### 2. File Storage & Supabase Integration
- **User Avatars**: Automatically intercepts users' Google profile pictures, downloads them, and securely re-uploads them to an AWS S3-compatible **Supabase Storage** bucket (`avatars`).
- **Movie Posters**: Supports `multipart/form-data` uploads for movie posters. Images are automatically uploaded to the `movie-posters` bucket in Supabase during Movie creation/update operations.

### 3. Master Data Management
- **Studios & Smart Seating**: Admins can create a studio by simply providing rows (e.g., A to L) and capacity. The system automatically generates and indexes every single seat (e.g., A1, A2... L14).
- **Movies & Showtimes**: Complete CRUD operations to manage now-playing movies, descriptions, durations, and trailer URLs, linked directly to specific studios and air-times. Include automated poster uploads.

### 4. Robust Ticketing & Order System
- **Double-Booking Prevention**: Built with strict Prisma Transactions (`$transaction`) and database-level unique constraints (`@@unique([showtimeId, seatId])`) to guarantee that two customers can never book the exact same seat simultaneously.
- **Order Tracking**: Customers can check out multiple seats in one cart, track their transaction status (`PENDING`, `SUCCESS`, `CANCELLED`), and receive an automatically generated 8-character unique `bookingCode`.

### 5. Automated Seeding & Analytics
- Pre-configured `npx prisma db seed` script to easily populate the database with mock movies, standard XXI-sized studios (168 seats), dummy showtimes, and an Admin account.
- **Admin Dashboard Analytics**: Dedicated endpoints to retrieve top-performing movies based on ticket sales and total revenue aggregations.

### 6. Interactive API Documentation
- Fully integrated with **Swagger UI**. Developers can visit `/api` (or `/docs`) to explore all available endpoints, required payload schemas, and test them directly from the browser using Bearer Token authorization.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript
- **Database**: MySQL (via XAMPP / Laragon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: Zod (via `nestjs-zod`)
- **Cloud Storage**: Supabase Storage
- **Authentication**: Passport.js, Google Auth Library, JWT

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- MySQL Server running on `localhost:3306`

### Installation
```bash
# Install dependencies
$ npm install
```

### Environment Configuration
Create a `.env` file in the root directory and configure the following variables:
```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/bioskopin_db"

# JWT Secret
JWT_SECRET="your_super_secret_jwt_key"

# Supabase Storage
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_KEY="your-anon-or-service-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

### Database Setup
```bash
# Sync Prisma schema with MySQL database
$ npx prisma db push

# Generate Prisma Client
$ npx prisma generate

# Populate database with dummy data
$ npx prisma db seed
```

### Running the App
```bash
# Development
$ npm run start

# Watch mode (Hot Reload)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## 👨‍💻 Contributing
This project is built as a core backend system. Frontend developers (Web/Android) can refer to the Swagger documentation at `http://localhost:3000/api` for API contracts and payload requirements.

## 📄 License
This project is [MIT licensed](LICENSE).
