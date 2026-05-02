# 🚀 Vanguard AERO — Squadron Operations Command Center

Vanguard AERO is a high-fidelity, interactive management platform engineered to orchestrate team-based activities within a decentralized squadron environment. It transitions unstructured community communication into a high-density, automated workflow: **Discuss → Vote → Schedule → Play → Track**.

---

## 🎯 Project Overview

### The Problem
In large-scale batch environments (e.g., 120+ students divided into squads), coordination via traditional messaging apps leads to:
- **Entropy**: Important decisions are lost in chat history.
- **Opacity**: No clear record of past performance or MVP status.
- **Inertia**: Scheduling weekly operations manually is time-consuming and prone to error.

### The AERO Solution
AERO provides a centralized, **Identity-First** portal that serves as the "source of truth" for the squadron. It leverages real-time synchronization, 3D atmospheric immersion, and role-based permissions to ensure every operation is executed with precision.

---

## 🧠 Technical Architecture

### Tech Stack
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | High-performance UI rendering |
| **State** | Redux Toolkit | Centralized state management & persistence |
| **3D Engine** | Three.js / R3F | Immersive "AeroSky" atmospheric background |
| **Real-time** | Socket.IO | Bi-directional event synchronization |
| **Styling** | Tailwind CSS 4.0 | Utility-first, high-density design system |
| **Animations** | Framer Motion | Cinematic transitions and micro-interactions |
| **Backend** | Node.js (Express) | RESTful API & Signaling server |
| **Database** | MongoDB | Persistent storage for users, polls, and results |

---

## 📂 Granular Folder Architecture

### 🖥️ Client Architecture (`/frontend`)
```bash
src/
├── assets/          # Brand identity, icons, and 3D models
├── components/      # Atomic UI components
│   ├── AeroUI.jsx   # Design System (GlassPanel, AeroButton, etc.)
│   ├── Layout.jsx   # Protected layout wrapper with Sidebar/Navbar
│   └── SEO.jsx      # Dynamic meta-tag management for search/social
├── hooks/           # Business logic abstractions
│   ├── useAuth.js   # Identity & Role management
│   ├── useStorage.js# Type-safe Local/Session storage handlers
│   └── useSocket.js # WebSocket lifecycle management
├── pages/           # High-level views and route components
│   ├── Dashboard.jsx# Operational overview and metrics
│   ├── Polls.jsx    # Democratic decision-making hub
│   └── Calendar.jsx # Squadron milestone scheduling
├── redux/           # Global state slices and store config
├── services/        # API clients and WebSocket definitions
└── utils/           # Helper functions, constants, and mock data
```

### ⚙️ Server Architecture (`/backend`)
```bash
src/
├── config/          # DB connection & Environment validation
├── controllers/     # Orchestration logic for API endpoints
├── middleware/      # JWT verification, logging, and error handling
├── models/          # Data schemas (Users, Polls, GameHistory)
├── routes/          # Express route definitions
└── index.js         # Entry point & Socket.IO server initialization
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **Package Manager**: npm v9.x+ (preferred)
- **Environment**: Access to a MongoDB instance (Local or Atlas)

### 1. Repository Initialization
```bash
git clone https://github.com/Dhvanitkanabar/teamaero.git
cd teamaero
```

### 2. Frontend Configuration
```bash
cd frontend
npm install
# Ensure .env contains:
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
npm run dev
```

### 3. Backend Configuration
```bash
cd ../backend
npm install
# Create a .env file:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secure_random_string
npm start
```

---

## ✨ Featured Systems

### 🛡️ Smart Storage Utility
AERO uses a custom-built, fallback-aware storage engine located in `src/utils/storage.js`. 
- **Persistent**: `localStorage` stores theme preferences and non-sensitive operator metadata.
- **Ephemeral**: `sessionStorage` manages multi-step form progress and temporary search filters.
- **Security**: Sensitive data (passwords) are strictly excluded from storage; tokens are cleared instantly on session termination.

### 🗳️ Squadron Operations Hub
- **Dynamic Polls**: Real-time voting with instant result broadcasting.
- **Automated Scheduling**: The system automatically flags "Wednesday" as a combat day but allows Admin overrides.
- **Leaderboard**: Weighted ranking system based on Participation (40%), Performance (40%), and Achievements (20%).

### 🎨 High-Density UI/UX
- **AeroSky**: A 3D atmospheric simulation that reacts to user navigation.
- **Glassmorphism**: Deep blur effects with metallic borders for a "technical aviation" aesthetic.
- **Smooth Navigation**: Integration of `Lenis` for momentum-based scrolling.

---

## 🛠️ Development & Quality Standards

To maintain the project's high code quality, utilize the following built-in tools:

- **Linting**: Run `npm run lint` to check for style violations.
- **Auto-Fix**: Run `npm run lint:fix` to automatically resolve lint errors.
- **Formatting**: Run `npm run format` to standardize the codebase using Prettier.

---

## 🎯 Roadmap
- [x] High-fidelity Identity Portal (Login)
- [x] Storage & Code Quality Infrastructure
- [ ] Real-time Chat Workspace Integration
- [ ] Automated MVP calculation engine
- [ ] Mobile PWA optimization

---

**👨‍💻 Developed By**: Vanguard Development Team
**📍 Project Scope**: Squadron Coordination & Activity Management Platform