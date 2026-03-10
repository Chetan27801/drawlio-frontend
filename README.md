# Drawlio Frontend

The frontend client for **Drawlio** — a real-time multiplayer drawing and guessing game. Built with React, Socket.IO, and Tailwind CSS, it provides the drawing canvas, chat, lobby management, and live game UI that connects to the [Drawlio Backend](https://github.com/Chetan27801/drawlio-backend).

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **State Management:** Zustand
- **Routing:** React Router 7
- **Real-time:** Socket.IO Client
- **Icons:** Lucide React

## Project Structure

```
src/
├── components/
│   ├── game/       # Game UI — canvas, chat, toolbar, scoreboard, word selector
│   └── ui/         # Shared primitives (shadcn/ui — button, card, dialog, etc.)
├── constants/      # Event names, game rules, error messages
├── hooks/          # useSocketEvents (listeners + navigation), useCanvas (drawing logic)
├── lib/            # Socket.IO client setup, utility functions
├── pages/          # Route-level pages — Home, Lobby, Game
├── stores/         # Zustand stores — gameStore, canvasStore
├── types/          # TypeScript type definitions
├── App.tsx         # Router and app shell
└── main.tsx        # Entry point
```

## Pages & Routes

| Route              | Page  | Description                                   |
| ------------------ | ----- | --------------------------------------------- |
| `/`                | Home  | Create or join a game room                    |
| `/lobby/:roomCode` | Lobby | Waiting room before the game starts           |
| `/game/:roomCode`  | Game  | Drawing canvas, chat, scoreboard, and toolbar |

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- The [Drawlio Backend](https://github.com/Chetan27801/drawlio-backend) running (default `http://localhost:3000`)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd drawlio-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment (optional)

Create a `.env` file in the project root to override the backend URL:

```env
VITE_SERVER_URL=http://localhost:3000
```

> If omitted, the app defaults to `http://localhost:3000`.

### 4. Start the dev server

```bash
npm run dev
```

The app starts at `http://localhost:5173` with hot module replacement.

### 5. Make sure the backend is running

In a separate terminal, start the backend (see [backend README](../drawlio-backend/README.md)):

```bash
cd ../drawlio-backend
npm run docker:up   # start Redis
npm run dev          # start backend server
```

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

## Key Dependencies

| Package                                                | Purpose                                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `socket.io-client`                                     | Real-time WebSocket communication with the backend     |
| `zustand`                                              | Lightweight state management for game and canvas state |
| `react-router-dom`                                     | Client-side routing                                    |
| `tailwindcss` + `@tailwindcss/vite`                    | Utility-first CSS                                      |
| `radix-ui` + `shadcn`                                  | Accessible, composable UI components                   |
| `class-variance-authority` + `clsx` + `tailwind-merge` | Conditional class utilities                            |
| `lucide-react`                                         | Icon library                                           |
