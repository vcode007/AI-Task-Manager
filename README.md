# AI Task Manager

Full-stack task management app with AI-powered prioritization.

## Tech stack
- **Frontend:** React (Vite), Axios
- **Backend:** .NET 8 Web API, Entity Framework Core
- **Database:** SQLite
- **AI:** Hugging Face Inference API (Mistral-7B)

## Features
- Create, complete, and delete tasks with deadlines and priority levels
- REST API with full CRUD via .NET 8 Web API
- AI prioritization: sends all pending tasks to an LLM which ranks them
  by urgency + importance and explains its reasoning

## Run locally
```bash
# Backend
cd backend && dotnet run

# Frontend
cd frontend && npm install && npm run dev
```

## What I learned
- Building and consuming REST APIs with .NET controllers and EF Core
- Connecting a React frontend to a .NET backend with CORS
- Prompt engineering for structured JSON output from an LLM
- End-to-end full-stack project architecture
