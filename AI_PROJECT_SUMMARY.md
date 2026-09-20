# AI Project Summary

## Purpose

This is an AI resume builder with a React/Vite frontend and an Express/MongoDB backend. Users can register/login, create resumes, edit resume sections, choose templates/colors, upload an existing PDF resume for AI extraction, improve text with AI, upload a profile image through ImageKit, make a resume public, and print/download it.

## Runtime

- Client: `client`, Vite React app, default dev URL `http://localhost:5173`
- Server: `server`, Express app, default API URL `http://localhost:3000`
- Client API base URL comes from `client/.env` as `VITE_BASE_URL`
- Server config comes from `server/.env`
- MongoDB database name is hardcoded as `Resume-Builder`; `server/configs/db.js` appends it to `MONGODB_URI`

## Required Accounts And Credentials

- MongoDB: required for user accounts and resume persistence via `MONGODB_URI`
- ImageKit: required for profile image uploads/background removal via `IMAGEKIT_PRIVATE_KEY`
- OpenAI-compatible API: required for AI text enhancement and PDF resume extraction via `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL`
- App user accounts are created through `POST /api/users/register` or the UI sign-up form. No seed account exists in the repo.

## Server Modules

- `server/server.js`: creates the Express app, loads env vars, connects to MongoDB, enables JSON/CORS, registers routers, and starts listening.
- `server/configs/db.js`: connects Mongoose to `${MONGODB_URI}/Resume-Builder`; logs errors but does not stop server startup.
- `server/configs/ai.js`: creates the OpenAI SDK client using env vars.
- `server/configs/imageKit.js`: creates the ImageKit SDK client using `IMAGEKIT_PRIVATE_KEY`.
- `server/configs/multer.js`: configures file upload handling for resume image uploads.
- `server/middlewares/authMiddleware.js`: reads JWT from `Authorization` header, verifies with `JWT_SECRET`, and sets `req.userId`.
- `server/models/User.js`: Mongoose user schema with `name`, unique `email`, hashed `password`, timestamps, and `comparePassword`.
- `server/models/Resume.js`: Mongoose resume schema containing ownership, title, public flag, template, accent color, personal info, summary, skills, experience, projects, education, and certifications.
- `server/routes/userRoutes.js`: user auth/data routes.
- `server/routes/resumeRoutes.js`: protected resume CRUD plus public resume fetch.
- `server/routes/aiRoutes.js`: protected AI enhancement and PDF extraction routes.
- `server/controllers/userController.js`: register, login, current-user lookup, and current-user resume listing.
- `server/controllers/resumeController.js`: create/delete/fetch/update resumes; uploads profile image to ImageKit when provided.
- `server/controllers/aiController.js`: enhances professional summaries/job descriptions and converts uploaded PDF text into resume JSON.

## API Surface

- `POST /api/users/register`: body `{ name, email, password }`; creates user and returns JWT.
- `POST /api/users/login`: body `{ email, password }`; returns JWT.
- `GET /api/users/data`: protected; returns current user.
- `GET /api/users/resumes`: protected; returns current user's resumes.
- `POST /api/resumes/create`: protected; body `{ title }`; creates a resume.
- `PUT /api/resumes/update`: protected; multipart or JSON-like form data with `resumeId`, `resumeData`, optional `image`, optional `removeBackground`.
- `DELETE /api/resumes/delete/:resumeId`: protected; deletes current user's resume.
- `GET /api/resumes/get/:resumeId`: protected; fetches current user's resume.
- `GET /api/resumes/public/:resumeId`: public; fetches only resumes where `public: true`.
- `POST /api/ai/enhance-pro-sum`: protected; body `{ userContent }`; returns enhanced summary.
- `POST /api/ai/enhance-job-desc`: protected; body `{ userContent }`; returns enhanced job description.
- `POST /api/ai/upload-resume`: protected; body `{ title, resumeText }`; uses AI to create a new resume from extracted PDF text.

## Client Modules

- `client/src/main.jsx`: React root, `BrowserRouter`, Redux `Provider`.
- `client/src/App.jsx`: route definitions and initial token-based user restore.
- `client/src/configs/api.js`: Axios instance with `VITE_BASE_URL`.
- `client/src/app/store.js`: Redux store setup.
- `client/src/app/features/authSlice.js`: auth state, login/logout/loading reducers.
- `client/src/pages/Home.jsx`: landing page composed from home components.
- `client/src/pages/Layout.jsx`: protected app shell; shows login when unauthenticated.
- `client/src/pages/Login.jsx`: login/register form; persists token to `localStorage`.
- `client/src/pages/Dashboard.jsx`: resume list, create resume, upload existing PDF resume, rename/delete.
- `client/src/pages/ResumeBuilder.jsx`: main editor with section navigation, template/color controls, save, public/private toggle, share, print/download.
- `client/src/pages/Preview.jsx`: public resume preview route.
- `client/src/components/ResumePreview.jsx`: selects and renders the active resume template.
- `client/src/components/*Form.jsx`: controlled editor forms for personal info, summary, experience, education, projects, skills, and certifications.
- `client/src/components/TemplateSelector.jsx`: resume template picker.
- `client/src/components/ColorPicker.jsx`: accent color picker.
- `client/src/components/Navbar.jsx`: app navigation/logout.
- `client/src/components/Loader.jsx`: loading UI.
- `client/src/assets/templates/*.jsx`: resume template implementations.
- `client/src/components/home/*.jsx`: landing-page sections.

## Main User Flows

1. User signs up or logs in through `Login.jsx`.
2. Token is saved in `localStorage`; `App.jsx` reloads user data through `/api/users/data`.
3. `Dashboard.jsx` fetches `/api/users/resumes`.
4. User creates a blank resume through `/api/resumes/create` or uploads a PDF through `/api/ai/upload-resume`.
5. `ResumeBuilder.jsx` loads the resume, edits local state through section forms, then saves via `/api/resumes/update`.
6. Public sharing toggles `public` on the resume; `/view/:resumeId` fetches through the public endpoint.

## Known Notes For Future AI

- The frontend initial `resumeData` uses `skill: []`, but forms/routes/models use `skills`. Treat `skills` as the intended field.
- `Dashboard.jsx` has a typo in `showCreteResume`; it is only a local state name.
- `editTitle` checks `if (confirm)` instead of calling a confirmation dialog. This currently always passes because `window.confirm` exists.
- `aiController.js` PDF extraction prompt contains typos and repeats `experience` where it likely meant `education`.
- The server can start without MongoDB credentials because DB connection errors are caught, but account/resume APIs will not work until MongoDB is configured.
- AI and ImageKit features are optional for basic manual resume editing but required for PDF import, enhancement, and image upload.
