# Reviewly — Company Review & Rating Platform

A premium, production-ready full-stack MERN application for discovering, reviewing, and rating companies.

Built exactly to the provided design system (purple accent, modern typography, responsive centered layout, glassmorphism-inspired cards, smooth interactions).

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS + existing premium design system (CSS variables)
- React Router v6
- TanStack React Query
- React Hook Form + Zod
- Axios
- Framer Motion (modals & animations)
- Lucide React (icons)
- React Hot Toast
- Date-fns (via formatters)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- MVC architecture
- Proper error handling, async handlers, validation
- Aggregation for dynamic rating calculations

## Features Implemented

- ✅ Responsive company listing grid with cards
- ✅ Powerful search (debounced), city filter, multiple sort options
- ✅ Pagination
- ✅ Add new company (full validation)
- ✅ Company detail page with overview + reviews
- ✅ Add review modal with interactive 5-star rating
- ✅ Real-time UI updates (average rating + new reviews appear instantly)
- ✅ Like reviews + Share (Web Share API + clipboard fallback)
- ✅ Skeleton loaders, empty states, loading & error handling
- ✅ Beautiful premium UI matching the Figma design language
- ✅ Form validation everywhere (Zod)
- ✅ Production folder structure (scalable & modular)
- ✅ Environment variables properly configured

## Project Structure

```
client/                 # Vite + React frontend
  src/
    api/                # Axios instance
    services/           # API service functions
    components/         # Reusable UI (cards, forms, modal, StarRating)
    pages/              # Route pages
    hooks/              # Custom hooks (useDebounce)
    utils/ constants/
    layouts/
    App.jsx routes via React Router

server/                 # Express backend
  models/
  controllers/
  routes/
  middleware/ (error + notFound)
  config/
  utils/
  index.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Environment Setup

**Backend** (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/reviewly
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Copy from `.env.example`

**Frontend** (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the App

**Terminal 1 - Backend**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd client
npm run dev
```

Open http://localhost:5173

## API Endpoints

### Companies
- `GET /api/companies` — list with search, city, sort, pagination
- `POST /api/companies` — create
- `GET /api/companies/:id`

### Reviews
- `GET /api/reviews/:companyId` — with sort
- `POST /api/reviews/:companyId`
- `PATCH /api/reviews/like/:reviewId`

## Deployment

**Frontend (Vercel/Netlify)**
- Set `VITE_API_URL` to your deployed backend URL

**Backend (Railway/Render/Heroku)**
- Set environment variables
- Use MongoDB Atlas for production DB
- Add proper CORS origin

## Bonus Features (Partially / Easily Extendable)

- Dark mode (design system already supports `prefers-color-scheme`)
- Framer Motion animations on modals & cards
- Web Share API
- Optimistic UI updates
- Rating distribution chart (future)

## Notes

- The UI strictly follows the design tokens and layout constraints from the provided Figma starter (1126px container, purple #aa3bff accent, specific typography/shadows).
- No JWT auth included in core (can be added easily as bonus).
- Image upload not implemented (logo accepts URL, placeholder avatars used).

## Author

Built as a high-quality assessment project demonstrating full-stack best practices, clean architecture, and pixel-perfect premium UI/UX.

Enjoy reviewing companies! 🚀
