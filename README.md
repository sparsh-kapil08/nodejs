# Node.js Task App

This project is a simple login, signup, and task management app.

The app has two parts:

- `app.js`, `controller/`, and `db.js` are the backend.
- `frontend/Nodejs/` is the frontend shown in the browser.

## What the app does

- New users can sign up.
- Existing users can log in.
- Each user has a role: `user` or `admin`.
- Users can create, update, delete, and view tasks.
- Admins can manage all tasks.
- Regular users can manage only their own tasks.

## Setup

### 1. Install dependencies

Run this in the root folder:

```bash
npm install
```

Then go to the frontend folder and install its packages too:

```bash
cd frontend/Nodejs
npm install
```

### 2. Create the backend `.env` file

Create a `.env` file in the root folder with these values:

```env
DB_USER
DB_HOST
DB_PORT
DB_DATABASE
DB_PASSWORD

### POSTGRESQL DATABASE .env

PORT=3000
FRONTEND_URL="http://localhost:5173"
SECRET=1111
```

### 3. Create the frontend `.env` file

Create a `.env` file inside `frontend/Nodejs/`:

```env
VITE_URL="http://localhost:3000"
```

## Database tables

The app uses two tables.

### `users`

This table stores login information.

- `id` - unique number for each user
- `name` - user name
- `email` - user email
- `password` - hashed password
- `role` - `user` or `admin`



### `tasks`

This table stores tasks.

- `id` - unique number for each task
- `task` - task text
- `name` - owner of the task


## How to run

### Start backend

From the root folder:

```bash
node app.js
```

### Start frontend

From `frontend/Nodejs/`:

```bash
npm run dev
```

## Notes

- Keep the backend running on port `3000`.
- Keep the frontend running on Vite's default port `5173`.
- The frontend talks to the backend using `VITE_URL`.
- The backend uses PostgreSQL for storing users and tasks.