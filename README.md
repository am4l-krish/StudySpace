# StudySpace 📚

A full-stack study planner web app designed for students to manage their academic life in one place.

## Features

- 🔐 **Authentication** — Google login via Firebase Auth
- 📊 **Dashboard** — Overview of your academic progress
- ✅ **Tasks** — Create and manage assignments and to-dos
- 📈 **Grades** — Track your grades and GPA
- 📅 **Schedule** — Plan your weekly timetable
- ⏱️ **Pomodoro Timer** — Stay focused with timed study sessions
- 📁 **Materials** — Store and organize study resources
- 🤖 **AI Assistant** — Get help with your studies using AI

## Tech Stack

- **Frontend** — React + Vite
- **Auth & Database** — Firebase (Authentication + Firestore)
- **Styling** — CSS
- **AI** — Claude API

## Getting Started

### Prerequisites
- Node.js
- Firebase project

### Installation

1. Clone the repo
```bash
   git clone https://github.com/am4l-krish/StudySpace.git
   cd StudySpace
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root directory
```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
```

4. Start the dev server
```bash
   npm run dev
```

## Environment Variables

Never commit your `.env` file. All Firebase credentials must be stored as environment variables prefixed with `VITE_`.

