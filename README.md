# 🗳️ Pollify - Real-time Online Poll System

A modern, feature-rich Progressive Web Application for creating and participating in online polls with real-time results and beautiful data visualizations.

![Pollify Demo](https://img.shields.io/badge/Pollify-PWA_Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-orange)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple)

![Pollify Screenshot](https://via.placeholder.com/800x400/2563eb/ffffff?text=Pollify+-+Real-time+Polling+PWA)

## ✨ Features

### 🎯 Core Functionality
- **📊 Real-time Poll Voting** - Instant vote casting with live updates
- **📈 Interactive Results** - Beautiful charts and real-time result tracking
- **🆕 Poll Creation** - Intuitive form for creating custom polls
- **🔐 User Authentication** - Secure login/register system
- **🔍 Advanced Filtering** - Search and filter polls by various criteria
- **📱 Responsive Design** - Perfect experience on all devices

### 🚀 PWA Capabilities
- **📴 Offline Support** - Works without internet connection
- **📲 Installable** - Add to home screen like a native app
- **⚡ Fast Loading** - Optimized performance with service workers
- **🔔 Push Notifications** - Ready for real-time updates
- **🔄 Auto Updates** - Seamless background updates

### 🎨 User Experience
- **🌙 Dark/Light Theme** - Toggle between themes with persistence
- **💫 Skeleton Loaders** - Beautiful loading states
- **🎉 Confetti Animations** - Celebrate voting actions
- **💬 Toast Notifications** - User-friendly feedback system
- **✨ Smooth Animations** - CSS transitions and micro-interactions

## 🏗️ Architecture
```pollify-pwa/
├── public/
│ ├── index.html
│ ├── manifest.json
│ └── icons/
├── src/
│ ├── components/ # React Components
│ │ ├── PollList.tsx # Main poll listing
│ │ ├── PollVote.tsx # Voting interface
│ │ ├── PollResults.tsx # Results with charts
│ │ ├── CreatePoll.tsx # Poll creation form
│ │ ├── Layout.tsx # App layout with theme
│ │ ├── Header.tsx # Navigation header
│ │ └── ... # Other components
│ ├── hooks/ # Custom React Hooks
│ │ ├── useAuth.ts # Authentication logic
│ │ ├── useTheme.ts # Theme management
│ │ ├── useNotifications.ts # Toast system
│ │ └── usePolls.ts # Poll data management
│ ├── services/ # API Services
│ │ └── api.ts # Axios configuration
│ ├── store/ # State Management
│ │ ├── index.ts # Redux store
│ │ └── slices/ # Redux slices
│ ├── types/ # TypeScript Definitions
│ │ └── poll.ts # Poll-related types
│ ├── App.tsx # Root component
│ ├── main.tsx # Entry point
│ └── index.css # Global styles
├── package.json
├── vite.config.ts # Vite configuration
└── tsconfig.json # TypeScript config
```

## 🛠️ Tech Stack

**Frontend Framework**
- ⚛️ React 18 with TypeScript
- 🚀 Vite (Build Tool)
- 🎨 CSS3 with CSS Variables

**State Management & Routing**
- 📦 Redux Toolkit
- 🧭 React Router DOM

**UI & Visualization**
- 📊 Recharts (Data Visualization)
- 💅 Custom CSS with Theme Support
- 📱 Fully Responsive Design

**PWA Features**
- 🔧 Vite PWA Plugin
- ⚙️ Workbox (Service Workers)
- 📄 Web App Manifest

**API & Data**
- 🔄 Axios (HTTP Client)
- 🗃️ RESTful API Integration
- 🔐 JWT Authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn
- Modern web browser with PWA support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pollify-pwa.git
cd pollify-pwa
# Install dependencies
npm install
# Create .env file
cp .env.example .env
# Edit with your backend API URL
VITE_API_URL=https://your-backend-api.com
# start development server
npm run dev
- visit http://localhost:3000 to see the app running.
#create production build
npm run build
# Preview production build
npm run preview
```
## 📖 Usage Guide
### For Voters
1. Browse Polls - View all available polls on the home page

2. Search & Filter - Use the search bar and filters to find specific polls

3. Cast Vote - Click on any poll to view details and cast your vote

4. View Results - See real-time results with interactive charts

### For Poll Creators
1. Register/Login - Create an account or login to access creation features

2. Create Poll - Click "Create Poll" button to start a new poll

3. Configure Options - Add multiple choice options with descriptions

4. Set Expiry - Optional expiry date for time-sensitive polls

5. Share & Manage - Share your poll link and monitor results

### For Administrators
1. Admin Access - Use the admin panel link for backend management

2. Poll Management - Moderate, edit, or remove polls as needed

3. User Management - Manage user accounts and permissions

## 🔌 API Integration
Pollify is designed to work with a RESTful backend API.