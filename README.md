# Anvyr

An AI-powered chat application built with **Next.js, MongoDB, Clerk, and the Google Gemini API**. The project includes persistent conversations, message editing and regeneration, Markdown/code-aware rendering, and a responsive chat interface.

**Live demo:** [anvyr.vercel.app](https://anvyr.vercel.app)

## Features

- Secure authentication with Clerk
- Create, rename, and delete chats
- Persistent conversation history stored per user
- Send messages and receive AI-generated responses
- Edit a previously sent message and regenerate the reply from that point
- Regenerate the last AI response
- Markdown rendering with syntax-highlighted code blocks
- Toast notifications for errors and actions
- Responsive, collapsible sidebar layout

## Integrations

- **MongoDB** — Database for chats and messages
- **Clerk** — Authentication and user management
- **Google Gemini API** — AI response generation

## Tech Stack

### Frontend

- React
- Next.js (App Router)
- Tailwind CSS
- React Markdown
- Prism.js
- React Hot Toast

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- Clerk
- Google GenAI SDK (`@google/genai`)

## Environment Variables

Create a `.env.local` file in the project root and add your own credentials.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
SIGNING_SECRET=
GEMINI_API_KEY=
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/devNiranjan7/anvyr.git
cd anvyr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required `.env.local` file and add your MongoDB, Clerk, and Gemini credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

- The application uses Clerk Authentication for secure user management.
- Protected API routes require an authenticated user.
- Each user can only access, edit, or delete their own chats.

## Chats

The chat system supports:

- Creating new conversations
- Fetching a single chat or all chats for a user
- Sending a message and receiving an AI-generated reply
- Editing a past message and regenerating the conversation from that point
- Regenerating the most recent AI response
- Renaming and deleting chats

## Security Notes

- Keep all secrets inside `.env.local` files.
- Never commit `.env.local` files to GitHub.
- Never expose backend secrets (e.g. `GEMINI_API_KEY`) through `NEXT_PUBLIC_*` variables.
- Use environment-specific credentials for development and production.
- Use Clerk authentication for all protected API routes.

## Project Purpose

This project was built to practice and demonstrate full-stack web development, including:

- Next.js App Router development
- REST API design with Next.js API routes
- Clerk authentication
- MongoDB database integration with Mongoose
- Integrating third-party AI APIs (Google Gemini)
- Chat/conversation state management
- Markdown and code rendering
- Responsive UI development

## Author

**Dev Niranjan**

> Built with Next.js, MongoDB, Clerk, Google Gemini, and a lot of debugging.