# 🚀 StudyWire - Hackathon Edition 🏆

**StudyWire** is an AI-powered adaptive study assistant built specifically for Indian CS university students. It translates dry English textbook concepts into relatable "desi" analogies (Hinglish supported!), generates interactive quizzes, analyzes past year exam patterns (PYQs), and creates actionable 3-day study plans. 

Built in 48 hours for the **Anakin AI Hackathon**.

![StudyWire UI Preview](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=StudyWire+Dashboard)

## 🌟 The Problem
Indian CS students (studying OS, DBMS, Compiler Design, etc.) read from dry textbooks but think in Hinglish. They need concepts explained with relatable analogies, not Oxford dictionary definitions. 

## 💡 The Solution
StudyWire takes a single student query and orchestrates **5 separate AI Agents** in parallel using a powerful backend architecture, aggregating their outputs into a beautiful NASA Mission Control-styled dashboard.

### 🧠 The 5 Parallel Agents
1. **Concept Agent:** Explains the strict technical concept simply and clearly.
2. **Analogy Agent:** Generates a brilliant Indian real-life analogy (e.g., explaining OS Paging using a Big Fat Indian Wedding).
3. **PYQ Agent:** Analyzes past year exam patterns from Indian Universities and gives pro-tips for scoring marks.
4. **Quiz Agent:** Outputs strict JSON to power an interactive, client-side multiple-choice quiz.
5. **Study Plan Agent:** Outputs strict JSON to power a 3-day revision plan.

---

## 🏗 Architecture Diagram

```mermaid
graph TD
    A["Student Input (e.g., 'Deadlock in OS')"] --> B(StudyWire Frontend React)
    B -->|POST /api/study| C{StudyWire Node.js Backend}
    
    C -->|Promise.allSettled() Parallel Execution| D(Anakin.io API & Dynamic Engine)
    
    D --> E[Concept Engine]
    D --> F[Analogy Engine]
    D --> G[Quiz Engine]
    D --> H[PYQ Engine]
    D --> I[Study Plan Engine]
    
    E --> J[Aggregate Responses]
    F --> J
    G --> J
    H --> J
    I --> J
    
    J -->|JSON Response| B
    B --> K((Mission Control Dashboard))
    
    style B fill:#1e293b,stroke:#3b82f6,stroke-width:2px
    style C fill:#0f172a,stroke:#8b5cf6,stroke-width:2px
    style D fill:#312e81,stroke:#6366f1,stroke-width:3px
```

## 🛠 Tech Stack
- **Frontend:** React + Vite, TailwindCSS, Framer Motion, Lucide React, html2canvas, jsPDF
- **Backend:** Node.js, Express, Axios
- **AI/Data Integration:** Anakin.io Search API & Custom Dynamic Mock Engine (for flawless offline/fallback presentations)

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/studywire.git
cd studywire
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*(Backend runs on http://localhost:5001)*

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*(Frontend runs on http://localhost:5173)*

## ✨ Hackathon Super-Features
- **Parallel Execution:** Hits 5 LLMs simultaneously instead of waiting sequentially.
- **Dynamic Presentation Engine:** Ensures 100% beautiful, crash-free output during live hackathon demos even if 3rd-party APIs return dirty text.
- **Glassmorphism UI:** Stunning dark mode aesthetic with micro-animations.
- **PDF Export:** Click "PDF Plan" to instantly download a screenshot of your 3-day study plan.
- **Clipboard Sharing:** Click "Share" to copy a screenshot of your entire dashboard to your clipboard for easy WhatsApp/Discord sharing.

---
*Built with ❤️ for Indian Students. Happy Hackathon!*
