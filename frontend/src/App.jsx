import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, prioritize } from './api/tasks';
import TaskCard from './components/TaskCard';
import AddTaskForm from './components/AddTaskForm';
import AiPanel from './components/AiPanel';
import './App.css';

export default function App() {
  const [tasks, setTasks]       = useState([]);
  const [aiData, setAiData]     = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]   = useState('');
  const [filter, setFilter]     = useState('all');

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch {
      console.error('Could not reach backend. Make sure .NET API is running on port 5000.');
    }
  };

  const handleAdd = async (form) => {
    await createTask({ ...form, deadline: new Date(form.deadline).toISOString() });
    loadTasks();
  };

  const handleToggle = async (task) => {
    await updateTask(task.id, { ...task, isCompleted: !task.isCompleted });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleAI = async () => {
    setAiLoading(true);
    setAiError('');
    setAiData(null);
    try {
      const res = await prioritize();
      setAiData(res.data);
    } catch {
      setAiError('Could not reach the AI endpoint. Make sure the backend is running.');
    }
    setAiLoading(false);
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active')    return !t.isCompleted;
    if (filter === 'done')      return t.isCompleted;
    if (filter === 'high')      return t.priority === 'high' && !t.isCompleted;
    return true;
  });

  const counts = {
    total:  tasks.length,
    active: tasks.filter(t => !t.isCompleted).length,
    done:   tasks.filter(t => t.isCompleted).length,
    high:   tasks.filter(t => t.priority === 'high' && !t.isCompleted).length,
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <span>TaskAI</span>
        </div>

        <nav className="filters">
          {[
            { key: 'all',    label: 'All tasks',   count: counts.total  },
            { key: 'active', label: 'Active',       count: counts.active },
            { key: 'high',   label: 'High priority',count: counts.high   },
            { key: 'done',   label: 'Completed',    count: counts.done   },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              <span>{f.label}</span>
              <span className="count">{f.count}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="primary ai-btn" onClick={handleAI} disabled={aiLoading}>
            {aiLoading ? 'Thinking...' : '✦ AI Prioritize'}
          </button>
          <p className="ai-note">Uses Mistral-7B to rank your pending tasks by urgency + importance</p>
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <h1>
            {filter === 'all'    && 'All tasks'}
            {filter === 'active' && 'Active tasks'}
            {filter === 'high'   && 'High priority'}
            {filter === 'done'   && 'Completed'}
          </h1>
        </header>

        <AddTaskForm onAdd={handleAdd} />

        <div className="task-list">
          {filtered.length === 0 && (
            <p className="empty">No tasks here yet.</p>
          )}
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {(aiData || aiError) && (
          <AiPanel data={aiData} error={aiError} tasks={tasks} onClose={() => { setAiData(null); setAiError(''); }} />
        )}
      </main>
    </div>
  );
}
