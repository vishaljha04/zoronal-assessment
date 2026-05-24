# Zoronal Assessment — Review & Rate (MERN)

A full-stack MERN application built for the **Zoronal Full-Stack Developer Assessment**.

Users can browse companies and reviews publicly, and must **sign up / log in** to add companies or post reviews.

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- TanStack React Query
- React Hook Form + Zod
- Axios
- Framer Motion
- Lucide React
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (httpOnly cookie) + protected routes
- MVC structure + centralized error handling

## Key Features

- Public pages: company listing, company details, reviews
- Auth pages: signup/login/logout + `/api/auth/me`
- Protected actions (login required): add company, add review
- Search (navbar), filter by city, sort, pagination
- Responsive UI based on the provided Figma screens
- Safe image fallback for broken logo URLs

## Project Structure

```
client/
  src/
    api/
    components/
    context/
    hooks/
    layouts/
    pages/
    services/
    utils/

server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  index.js
```

## Setup (Local)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Install

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

**Backend**: `server/.env`

```env
MONGODB_URI=mongodb://localhost:27017/reviewly
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

**Frontend**: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Run

**Terminal 1 (backend)**
```bash
cd server
npm run dev
```

**Terminal 2 (frontend)**
```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## API

### Auth
- `POST /api/auth/register` (sets JWT cookie)
- `POST /api/auth/login` (sets JWT cookie)
- `POST /api/auth/logout` (clears cookie)
- `GET /api/auth/me` (auth required)

### Companies
- `GET /api/companies` (search/filter/sort/pagination)
- `GET /api/companies/:id`
- `POST /api/companies` (auth required)

### Reviews
- `GET /api/reviews/:companyId`
- `POST /api/reviews/:companyId` (auth required)
- `PATCH /api/reviews/like/:reviewId`

## Notes

- Logos are URL-based (no file upload). Broken URLs fall back to avatar placeholders.
- If you created users before JWT was added, remove old user documents (they may not have `passwordHash`).

