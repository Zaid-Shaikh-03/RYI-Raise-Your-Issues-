# RYI (Raise Your Issues)

RYI is a full-stack platform that allows users to report civic issues and
track their status. It provides REST APIs built with Node.js and Express.js,
with MongoDB used for persistent application data.

## Features

- User registration, login, logout, and protected routes
- Create posts and report civic issues with text and image uploads
- Browse all posts, followed-user posts, user posts, and reported issues
- Like posts and add comments
- Follow and unfollow users
- User profiles with editable profile and cover images
- Notifications for follows and likes
- Responsive React interface with loading and empty states

## Tech Stack

### Frontend

- React
- React Router
- TanStack React Query
- Vite
- Tailwind CSS and DaisyUI

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens and cookies for authentication
- Cloudinary for image uploads

### Deployment

- Docker
- GitHub Actions
- Docker Hub
- Render

## Project Structure

```text
.
├── backend/
│   ├── controllers/       # Request handlers
│   ├── db/                # MongoDB connection
│   ├── lib/               # Shared backend utilities
│   ├── middleware/        # Authentication middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # REST API routes
│   └── server.js          # Express application entry point
├── frontend/
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Shared UI components
│       ├── hooks/         # React hooks
│       ├── pages/         # Application pages
│       └── App.jsx        # Frontend routes and application shell
├── Docker/prod/           # Production Dockerfile
├── .github/workflows/     # CI/CD workflows
├── package.json           # Backend and root scripts
└── README.md
```

## Prerequisites

- Node.js 22 or later
- npm
- MongoDB database
- Cloudinary account for image uploads

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Zaid-Shaikh-03/RYI-Raise-Your-Issues-.git
cd "RYI (Raise Your Issue)"
npm ci
npm ci --prefix frontend
```

## Environment Setup

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not commit `.env` or any credentials to source control.

## Running the Application

Start the backend from the project root:

```bash
npx cross-env NODE_ENV=development nodemon backend/server.js
```

In a second terminal, start the frontend:

```bash
npm run dev --prefix frontend
```

The frontend is available at `http://localhost:3000` and the backend runs on
the port configured by `PORT` (5000 by default). The Vite development server
proxies `/api` requests to the backend.

## Production Build

Build the frontend and install the production application dependencies:

```bash
npm run build
npm start
```

The production server serves the frontend and API from the port configured by
`PORT`.

To build the production Docker image:

```bash
docker build -f Docker/prod/Dockerfile -t ryi .
docker run --env-file .env -p 5000:5000 ryi
```
