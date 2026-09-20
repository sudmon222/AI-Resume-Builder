# AI Resume Builder

A full-stack resume builder with authentication, resume management, live editing, multiple templates, public sharing, print/download support, AI-assisted writing, PDF resume import, and ImageKit profile image uploads.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- AI: OpenAI-compatible API client, currently configured for Gemini free-tier compatible usage
- Media: ImageKit for profile image upload/background removal

## Features

- User registration and login with JWT authentication
- Dashboard for creating, renaming, deleting, and opening resumes
- Resume builder for personal info, summary, experience, education, projects, skills, and certifications
- Multiple resume templates with accent color selection
- Live resume preview
- Public/private resume visibility toggle
- Public share link at `/view/:resumeId`
- Browser print/download workflow
- AI enhancement for professional summaries and job descriptions
- PDF upload flow that extracts resume text and creates a resume draft
- Optional profile image upload through ImageKit

## Project Structure

```text
client/
  src/
    app/                 Redux store and auth slice
    assets/templates/    Resume template components
    components/          Builder forms, preview, selectors, navbar, loader
    components/home/     Landing page sections
    configs/api.js       Axios API client
    pages/               Home, Login, Dashboard, Builder, Preview, Layout
server/
  configs/               MongoDB, AI, ImageKit, Multer config
  controllers/           User, resume, and AI route handlers
  middlewares/           JWT auth middleware
  models/                Mongoose User and Resume schemas
  routes/                Express routers
  server.js              Express entrypoint
AI_PROJECT_SUMMARY.md    Module-level handoff notes for future AI agents
```

## Environment Variables

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

Create `server/.env`:

```env
PORT=3000
JWT_SECRET=replace_with_a_long_random_secret
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?appName=Cluster0
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=your_gemini_or_openai_compatible_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_MODEL=gemini-3.5-flash-lite
```

Notes:

- `server/.env` and `client/.env` are ignored by git and must not be committed.
- The backend appends the `Resume-Builder` database name to `MONGODB_URI`.
- For OpenAI billing instead of Gemini, use `OPENAI_BASE_URL=https://api.openai.com/v1` and an OpenAI model you have access to.

## Local Setup

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Run the backend:

```bash
cd server
npm run start
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

## Useful Commands

```bash
# Frontend production build
cd client
npm run build

# Frontend lint
cd client
npm run lint

# Backend production-style start
cd server
npm run start

# Backend dev start with nodemon
cd server
npm run server
```

## API Overview

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/data`
- `GET /api/users/resumes`
- `POST /api/resumes/create`
- `PUT /api/resumes/update`
- `DELETE /api/resumes/delete/:resumeId`
- `GET /api/resumes/get/:resumeId`
- `GET /api/resumes/public/:resumeId`
- `POST /api/ai/enhance-pro-sum`
- `POST /api/ai/enhance-job-desc`
- `POST /api/ai/upload-resume`

## Deployment Notes

- Deploy `client` as a Vite frontend and set `VITE_BASE_URL` to the backend URL.
- Deploy `server` as a Node/Express service and configure all server environment variables.
- MongoDB Atlas network access must allow the deployed backend.
- Keep API keys only in server-side environment variables.

## Current Verification

- Client production build passes.
- Client lint passes with React hook dependency warnings.
- Backend starts and connects to MongoDB when valid credentials are present.
- AI summary enhancement works with Gemini OpenAI-compatible configuration when a valid key is present.
