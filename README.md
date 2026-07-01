# Healthcare Management System Backend

A modern, secure, and scalable backend for a healthcare platform that supports patients, doctors, administrators, appointments, payments, notifications, and AI-powered medical assistance.

This project is designed to power a complete digital healthcare experience with role-based access, real-time scheduling workflows, payment processing, and intelligent document/knowledge retrieval capabilities.

## Overview

The Healthcare Management System Backend provides the core server-side infrastructure for managing:

- Patient registration and authentication
- Doctor profiles and specialties
- Appointment scheduling and status management
- Secure payments and billing workflows
- Admin operations and system oversight
- AI-assisted medical question answering and knowledge retrieval
- File uploads and media management

## Key Features

- Role-based authentication and authorization for patients, doctors, admins, and super admins
- Google OAuth integration and email-based authentication flow
- Appointment booking, rescheduling, and status updates
- Payment initiation and Stripe webhook support
- Cloudinary-based file uploads for medical/media content
- Prisma ORM with PostgreSQL database support
- Redis integration for caching and supporting services
- AI-powered RAG module using OpenAI embeddings and chat models
- Email notifications for authentication and account actions
- Structured error handling and request validation

## Tech Stack

- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Better Auth
- Stripe
- Cloudinary
- Nodemailer
- Zod
- OpenAI API

## Project Structure

```text
src/
  app/
    config/
    middleware/
    modules/
      admin/
      appointment/
      auth/
      doctor/
      doctorSchedule/
      payment/
      rag/
      schedule/
      specialty/
      user/
    routes/
    shared/
    utils/
```

## Prerequisites

Make sure the following are installed on your system:

- Node.js 18 or higher
- npm or pnpm
- PostgreSQL
- Redis

## Installation

1. Clone the repository
   ```bash
   git clone <your-repository-url>
   cd Healthcare-Management-System-Backend-
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   Create a `.env` file in the root directory and configure the required values for:
   - Database connection
   - Authentication secrets
   - Email service credentials
   - Cloudinary credentials
   - Stripe keys
   - OpenAI API keys
   - Frontend and app URLs

4. Run Prisma migrations
   ```bash
   npm run migrate
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

The server will start on the configured port (default is usually 5000 depending on your environment configuration).

## Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production build
npm run lint     # Run ESLint
npm run migrate  # Run Prisma migrations
```

## Environment Variables

The application expects several environment variables such as:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `APP_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `FRONTEND_URL`
- `EMAIL_SENDER_SMTP_*`
- `CLOUDINARY_*`
- `STRIPE_*`
- `OPENAI_API_KEY`
- `OPENAI_EMBEDDING_MODEL`
- `OPENAI_CHAT_MODEL`

You can review the full list in the environment configuration file under [src/app/config/env.ts](src/app/config/env.ts).

## API Structure

The API is exposed under the following base routes:

- `/api/auth` for authentication and user account management
- `/api/v1/auth` for general auth-related APIs
- `/api/v1/users` for user operations
- `/api/v1/doctors` for doctor management
- `/api/v1/appointments` for bookings and appointment workflows
- `/api/v1/schedules` and `/api/v1/doctor-schedules` for scheduling logic
- `/api/v1/rag` for AI-powered retrieval and assistant capabilities

## Database

This project uses Prisma with PostgreSQL. Database schema definitions are organized under the `prisma/schema` directory and migrations are stored in `prisma/migrations`.

## Payment Integration

Stripe is integrated for secure payment flows and webhook handling. The backend listens for Stripe webhook events and processes appointment-related billing actions.

## AI and RAG Module

The system includes a retrieval-augmented generation module for intelligent healthcare support, using OpenAI-based embeddings and chat generation workflows.

## License

This project is licensed under the ISC License.

## Contribution

Contributions are welcome. If you would like to improve the system, please open an issue or submit a pull request with a clear description of the changes.
