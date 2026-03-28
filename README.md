# Orchestra — Programmable ATM Card Orchestration Platform

Orchestra is a financial orchestration platform that allows users to manage multiple bank cards from a single interface, intelligently route transactions across cards, create virtual cards for subscriptions, monitor spending patterns, and receive AI-powered financial insights.

The system was built during the **Interswitch × Enyata Buildathon**.

---

# Live Demo

Frontend: https://orchestra-drab.vercel.app
API: https://orchestra-y8vf.onrender.com/api-docs   

---

# Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Recharts
- Framer Motion
- React Hot Toast

### Backend
- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth Authentication
- Axios
- OpenAI API

---

# Project Architecture
orchestra/
├── frontend/
│ ├── app/
│ ├── components/
│ ├── utils/
│
├── backend/
│ ├── lib/
│ │ ├── db/
│ │ ├── services/
│ ├── app/api/
│
└── README.md


The frontend communicates with the backend through REST API routes that handle authentication, card management, transaction simulation, insights generation, and reporting.

---

# Core Features

### Card Management
Users can link and manage multiple bank cards in a single dashboard.

### Smart Transaction Routing
Orchestra intelligently determines which card should handle a transaction based on available balance and routing preferences.

### Virtual Cards
Users can create subscription-specific virtual cards with limits and controls.

### Business Expense Cards
Organizations can issue cards to employees with budgets and approval workflows.

### AI Financial Insights
The system analyzes spending patterns and generates recommendations.

### Spending Analytics
Users can visualize spending trends and export transaction reports.

---

# Team Contributions

## Nnaoma Benedict Chigozie — Backend Developer

Responsible for designing and implementing the entire backend architecture and API layer.

Key responsibilities included:

### Backend Architecture
- Designed the backend structure using **Next.js API routes and MongoDB**
- Implemented database connection management using a MongoDB singleton pattern
- Defined all database models including:
  - Users
  - Cards
  - Transactions
  - Virtual Cards
  - Business Cards
  - Routing Rules
  - Approval Requests
  - AI Insights :contentReference[oaicite:0]{index=0}

### Authentication System
- Implemented user authentication using **NextAuth**
- Built API routes for user registration and secure session management :contentReference[oaicite:1]{index=1}

### Card Management APIs
Developed APIs for:
- Listing cards and balances
- Adding new cards
- Blocking and unblocking cards
- Retrieving card information from Card360 or local mock services :contentReference[oaicite:2]{index=2}

### Transaction Routing Engine
Built the routing system that determines how payments are allocated across cards and supports transaction simulation. :contentReference[oaicite:3]{index=3}

### Virtual Card Management
Implemented APIs for:
- Creating virtual subscription cards
- Pausing or deleting cards
- Managing card limits :contentReference[oaicite:4]{index=4}

### Business Expense System
Built endpoints supporting:
- Business card creation
- Expense approval workflows
- Budget tracking for teams :contentReference[oaicite:5]{index=5}

### AI Insights and Analytics
Implemented APIs that:
- Generate financial insights using AI
- Analyze spending patterns
- Provide savings projections and recommendations :contentReference[oaicite:6]{index=6}

### Reporting and Data Export
Developed the **report generation API** which exports spending data and transaction summaries for download. :contentReference[oaicite:7]{index=7}

### Demo Data & Seeding
Seeded the database with:
- Test users
- Sample bank cards
- Realistic Nigerian transaction data
- Virtual and business cards for demo purposes :contentReference[oaicite:8]{index=8}

---

## Nnabugwu Solomon Chukwuebuka — Frontend Developer

Responsible for building the full user interface and user experience of the platform.

Key responsibilities included:

### Application UI
- Built the full interface using **Next.js App Router**
- Implemented responsive UI using **Tailwind CSS and shadcn/ui** :contentReference[oaicite:9]{index=9}

### Authentication Pages
Developed:
- Login page
- Registration page
- Form validation and user flow handling :contentReference[oaicite:10]{index=10}

### Dashboard Experience
Implemented the main application dashboard including:
- Sidebar navigation
- Balance overview
- Spending charts
- Quick financial summaries :contentReference[oaicite:11]{index=11}

### Card Interface
Built interactive card components that display:
- Physical card visuals
- Card balances
- Block/unblock controls :contentReference[oaicite:12]{index=12}

### Routing Simulator
Implemented the transaction simulation interface that visually shows how payments are distributed across cards. :contentReference[oaicite:13]{index=13}

### Virtual Card Management UI
Built interfaces for:
- Creating virtual cards
- Viewing card limits
- Managing subscription cards :contentReference[oaicite:14]{index=14}

### Business Expense Interface
Created pages for:
- Managing company expense cards
- Viewing approval queues
- Handling expense approvals :contentReference[oaicite:15]{index=15}

### AI Insights Dashboard
Implemented data visualizations and financial insights including:
- Spending charts
- Savings projections
- AI recommendation panels :contentReference[oaicite:16]{index=16}

### UX Enhancements
Added:
- Toast notifications
- Skeleton loading states
- Mobile responsive layouts
- CSV report download functionality :contentReference[oaicite:17]{index=17}

---


