# Learnly

Learnly is an AI-powered learning platform built with Next.js App Router.
Users sign in with Google (Firebase Auth), generate structured courses with Google Gemini, and track chapter progress in Firestore.

## What Learnly does

- Generates complete courses from a topic using AI.
- Creates chapter-wise learning materials (notes, flashcards, quiz, Q&A).
- Tracks progress and XP per chapter.
- Provides an in-context “Ask Doubt” assistant for each chapter.
- Includes an explore search endpoint (Wikipedia-backed) to discover topics.

## Tech stack

- Framework: Next.js 16 (App Router), React 19
- Styling/UI: Tailwind CSS, Radix-based UI primitives, Framer Motion
- Auth: Firebase Authentication (Google provider)
- Database: Firestore via Firebase Admin SDK on server routes
- AI: Google Gemini API (`gemini-3-flash-preview`)
- Tooling: TypeScript (mixed JS/TS codebase), ESLint, Prettier

## Architecture overview

Learnly follows a simple client/server split:

- Client pages/components in `app/` and `components/` render UI and call internal API routes.
- Server routes in `app/api/**` run on the server and talk to Firestore/Gemini securely.
- Firebase client SDK handles browser auth state.
- Firebase Admin SDK handles privileged database reads/writes in API routes.

### Request flow (high level)

```text
Browser UI (dashboard/create pages)
    -> /api/* (Next.js Route Handlers)
        -> Firebase Admin (Firestore)
        -> Gemini API (course + tutoring content)
    -> JSON response
Browser re-renders with updated course/progress state
```

### Auth flow

1. User signs in on `/sign-in` or `/sign-up` via Firebase Google popup.
2. `AuthProvider` (`app/context/AuthContext.jsx`) subscribes to auth state.
3. `app/provider.js` fetches Firebase ID token and stores `firebase-auth-token` cookie.
4. `middleware.js` checks this cookie for protected routes and redirects unauthenticated users.
5. `POST /api/create-user` upserts a user record in Firestore on first login.

### Course generation flow

1. User fills the wizard at `/dashboard/create` (topic, type, difficulty, materials).
2. Client sends payload to `POST /api/generate-course`.
3. API builds a strict prompt and requests structured JSON from Gemini.
4. Response is parsed/repaired if needed, then stored in Firestore (`courses` collection).
5. User is redirected to `/dashboard/course/[courseId]` and can open chapter materials.

### Learning/progress flow

- Notes page can mark a chapter complete via `POST /api/courses/[courseId]/progress`.
- Flashcards and quiz pages also mark completion when session ends.
- Progress updates `completedChapters` and increments XP (+50 per chapter completion).
- Dashboard and course detail screens compute progress percentage from stored data.

## Core data model (Firestore)

### `users` collection

Typical fields:

- `name`
- `email`
- `uid`
- `isMember`
- `createdAt`

### `courses` collection

Typical fields:

- `title`
- `summary`
- `topic`
- `courseType` (`exam | interview | practice | knowledge`)
- `difficulty` (`beginner | intermediate | advanced`)
- `materials` (`notes`, `flashcards`, `quiz`, `qa`)
- `createdBy` (Firebase `uid`)
- `status` (`ready`)
- `createdAt`
- `progress`
    - `completedChapters: number[]`
    - `xpEarned: number`
- `chapters[]`
    - `title`, `summary`
    - `notes` (markdown)
    - `flashcards[]`
    - `quiz[]`
    - `qa[]`

## API reference

### `POST /api/generate-course`

Generates and stores a full course via Gemini.

Request body:

```json
{
    "topic": "React",
    "courseType": "practice",
    "difficulty": "beginner",
    "materials": ["notes", "quiz", "flashcards", "qa"],
    "uid": "firebase-user-id"
}
```

Returns:

```json
{ "courseId": "...", "status": "ready" }
```

### `GET /api/courses`

Returns courses owned by a user.

- Required header: `x-user-uid: <firebase uid>`

### `GET /api/courses/[courseId]`

Returns full course document for a given course id.

### `POST /api/courses/[courseId]/progress`

Marks chapter complete and increments XP when applicable.

Request body:

```json
{
    "chapterIndex": 0,
    "uid": "firebase-user-id"
}
```

### `POST /api/create-user`

Creates user document if it does not exist.

### `POST /api/ask-doubt`

Asks Gemini for a concise tutor-style explanation using chapter context.

### `GET /api/explore-search?q=<topic>`

Returns topic suggestions from Wikipedia search API.

## Folder structure (important parts)

```text
app/
    (auth)/sign-in, sign-up          # Firebase Google auth pages
    (landing)/                       # Marketing/landing pages
    dashboard/                       # Main app (create, list, learn)
    api/                             # Route handlers (server)
    context/AuthContext.jsx          # Client auth state
    provider.js                      # Cookie sync + create-user trigger

components/
    dashboard/                       # Dashboard/course UI
    landing/                         # Landing page sections
    theme/, ui/                      # Theme and reusable primitives

configs/
    firebase.js                      # Firebase client SDK init
    firebaseAdmin.js                 # Firebase admin SDK init

middleware.js                      # Route protection via auth cookie
```

## Local development setup

### 1) Prerequisites

- Node.js 20+
- npm 10+
- A Firebase project (Auth + Firestore enabled)
- A Google AI Studio Gemini API key

### 2) Install dependencies

```bash
npm install
```

### 3) Create `.env.local`

Use this template:

```env
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (server)
# JSON string of service account (single line) for local/server use
FIREBASE_SERVICE_ACCOUNT=

# Gemini
NEXT_PUBLIC_GEMINI_API_KEY=
```

Notes:

- `NEXT_PUBLIC_GEMINI_API_KEY` is currently read in server routes in this codebase.
- `FIREBASE_SERVICE_ACCOUNT` should be a JSON string (escaped/newline-free) when provided via env.
- `firebaseAdmin.js` also has a fallback to default credentials with hardcoded project id; explicit service account is recommended for local reliability.

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

### 5) Optional env utilities

Scripts in `package.json`:

- `npm run env:gen` → generate example env file from `.env.local`
- `npm run env:load` → run command with `.env.local` loaded via dotenvx

## Available scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint

## How to use the app

1. Sign in with Google.
2. Go to dashboard and click **Create Course**.
3. Choose topic, course type, difficulty, and materials.
4. Open the generated course and study chapter content.
5. Mark chapters complete from Notes / finish Flashcards / finish Quiz.
6. Track XP and completion progress from dashboard/course page.

## Troubleshooting

### `401` from `/api/courses`

- Ensure `x-user-uid` header is sent by client.
- Ensure user is authenticated and token cookie is present.

### Redirected to `/sign-in` unexpectedly

- `middleware.js` requires `firebase-auth-token` cookie for protected routes.
- Confirm `app/provider.js` runs after auth and sets cookie.

### Course generation fails

- Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set.
- Check Gemini quota/rate limits (route retries `429`/`503` with backoff).

### Firestore/Admin errors locally

- Provide valid `FIREBASE_SERVICE_ACCOUNT` JSON.
- Confirm Firestore is enabled in the Firebase project.

## Notes for contributors

- Keep route handler changes in `app/api/**` small and typed where possible.
- Preserve existing response shapes unless coordinated with frontend changes.
- If adding new env vars, update this README in the same PR.
