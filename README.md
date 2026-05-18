# AI Task Manager

A full-stack task management application with AI-powered prioritization built using React, .NET 8, SQLite, and Hugging Face's Mistral-7B.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), Axios |
| Backend | .NET 8 Web API, Entity Framework Core |
| Database | SQLite |
| AI | Hugging Face Inference API (Mistral-7B-Instruct) |

## Features

- **Add, complete, and delete tasks** with title, description, priority, and deadline
- **Filter tasks** by status (active, completed, high priority)
- **Overdue detection** — tasks past their deadline are flagged automatically
- **AI prioritization** — click one button to send all pending tasks to Mistral-7B, which ranks them by urgency and importance and explains its reasoning in plain English
- **Demo mode** — works without an API key using rule-based ranking, so you can run it instantly

## Project Structure

```
ai-task-manager/
├── backend/
│   └── TaskManagerAPI/
│       ├── Controllers/
│       │   ├── TasksController.cs   ← CRUD endpoints
│       │   └── AiController.cs      ← AI prioritization endpoint
│       ├── Data/
│       │   └── AppDbContext.cs       ← EF Core database context
│       ├── Models/
│       │   └── TaskItem.cs          ← Task entity model
│       └── Program.cs               ← App startup & DI wiring
└── frontend/
    └── src/
        ├── api/tasks.js             ← Axios API calls
        ├── components/
        │   ├── TaskCard.jsx         ← Individual task display
        │   ├── AddTaskForm.jsx      ← Task creation form
        │   └── AiPanel.jsx          ← AI results panel
        └── App.jsx                  ← Root component & state
```

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- (Optional) [Hugging Face account](https://huggingface.co/) for real AI ranking

### 1. Start the backend

```bash
cd backend/TaskManagerAPI
dotnet restore
dotnet run
```

The API starts at `http://localhost:5000`. SQLite database (`tasks.db`) is created automatically on first run.

### 2. Add your Hugging Face API key (optional)

In `backend/TaskManagerAPI/appsettings.json`, replace `YOUR_HF_API_KEY_HERE` with your key from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

Without a key, the app runs in **demo mode** with rule-based ranking.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| GET | `/api/ai/prioritize` | AI-rank pending tasks |

## What I Learned

- Building REST APIs with .NET 8 Web API and controller-based routing
- Using Entity Framework Core with SQLite for data persistence
- Connecting a React frontend to a .NET backend with CORS configuration
- Prompt engineering for structured JSON output from an LLM
- Full-stack architecture: separating concerns across frontend, backend, and AI service layers
