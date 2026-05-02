# 🚀 Vanguard AERO — Squadron Operations Command Center

**Live Operational Command**: [https://teamaero.vercel.app/](https://teamaero.vercel.app/)

Vanguard AERO is a high-fidelity, interactive management platform engineered to orchestrate team-based activities within a decentralized squadron environment. It transitions unstructured community communication into a high-density, automated workflow: **Discuss → Vote → Schedule → Play → Track**.

---

## 🎨 Design & API Blueprints
The architecture of AERO is built upon precision and technical excellence. Access our core blueprints below:

*   **📐 Figma Design (High-Fidelity UI/UX)**: [Vanguard AERO Design System](https://www.figma.com/design/J3WIPiDdIrCrlH6Emvh9Wu/Untitled?node-id=200-967&t=IL7XWAPEIOEd8dGf-1)
*   **📡 API Documentation (Postman)**: [Vanguard RESTful API Specification](https://documenter.getpostman.com/view/50840753/2sBXqKoKuJ)

---

## 🎯 Mission Objective

### The Problem
In large-scale batch environments, coordination via traditional messaging apps leads to **Entropy** (lost decisions), **Opacity** (no performance record), and **Inertia** (manual scheduling errors).

### The AERO Solution
AERO provides a centralized, **Identity-First** portal that serves as the "Single Source of Truth" for the squadron. It leverages real-time synchronization, immersive 3D aesthetics, and persistent session management to ensure every operation is executed with surgical precision.

---

## ✨ Core Feature Ecosystem

### 🛡️ Identity Sync & Centralized Mapping
*   **Official Squadron Profiles**: Integrated high-resolution profile photos for authorized personnel (e.g., Squadron Commander).
*   **Identity Vault**: A global selection system for custom avatar styles and seeds, synchronized in real-time via Socket.IO.
*   **Global Persistence**: User identities are cached and broadcast across all dashboards, rosters, and chat forums.

### 🌐 MemberNet Roster
*   **High-Density Personnel Grid**: A specialized view displaying all 30 authorized squadron personnel with dynamic status indicators.
*   **Neural Profiles**: Detailed technical bios and performance metrics for every student, accessible via deep-linking.

### 🗳️ Decision & Performance Hub
*   **Real-Time Polls**: Democratic decision-making with live result broadcasting and instant notification triggers.
*   **Participation Tracker**: Weighted ranking system based on Participation, Performance, and Operational Achievements.

### 🎨 Atmospheric Immersion (AeroSky Engine)
*   **Kinetic UI**: A 3D atmospheric simulation built with Three.js that reacts to navigation state.
*   **Glassmorphic Design**: Custom-built UI components featuring deep blur, metallic borders, and vibrant HSL color palettes.

### ⚡ Production Persistence & Sync
*   **Session Rehydration**: Advanced state management that prevents unwanted logouts on page refresh.
*   **Shared Message Buffer**: A global backend message history (last 100 entries) that automatically hydrates the chat for all users upon connection.

---

## 🛡️ Access & Authentication Protocol

The AERO portal is secured via a dual-layer identity verification system.

1.  **Identity Entry**: Enter your authorized **GR Number** (108601 - 108630) on the cinematic login portal.
2.  **Verification**: Input your secure password assigned during squadron enlistment.
3.  **Authentication**: The system validates your credentials against the database and redirects you to your personalized **Squadron Dashboard**.

---

## 🧠 Technical Architecture

### Tech Stack
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | High-performance UI rendering |
| **State** | Redux Toolkit | Centralized state management & persistence |
| **3D Engine** | Three.js / R3F | Immersive "AeroSky" atmospheric background |
| **Real-time** | Socket.IO | Bi-directional event synchronization |
| **Styling** | Vanilla CSS + Tailwind | Utility-first, high-density design system |
| **Animations** | Framer Motion | Cinematic transitions and micro-interactions |
| **Backend** | Node.js (Express) | RESTful API & Signaling server |
| **Database** | MongoDB | Persistent storage for users and operations |

---

## 🚀 Installation & Neural Link

### 1. Repository Initialization
```bash
git clone https://github.com/Dhvanitkanabar/teamaero.git
cd teamaero
```

### 2. Environment Configuration
**Frontend (`/frontend/.env`):**
```env
VITE_API_URL=https://teamaero.onrender.com/api
VITE_SOCKET_URL=https://teamaero.onrender.com
```

### 3. Launch Command
```bash
# In separate terminals:
cd frontend && npm install && npm run dev
cd backend && npm install && npm start
```

---

## 🛠️ Development Standards
*   **Formatting**: Standardized via Prettier for codebase consistency.
*   **Quality**: ESLint integrated for real-time error detection.
*   **Deployment**: Optimized for Vercel (Frontend) and Render (Backend).

---

**👨‍💻 Developed By**: Dhvanit Kanabar & Vanguard Development Team
**📍 Project Scope**: Squadron Coordination & Activity Management Platform