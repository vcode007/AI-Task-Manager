import './TaskCard.css';

const PRIORITY = {
  high:   { color: '#E24B4A', bg: '#FCEBEB', label: 'High'   },
  medium: { color: '#EF9F27', bg: '#FAEEDA', label: 'Medium' },
  low:    { color: '#639922', bg: '#EAF3DE', label: 'Low'    },
};

export default function TaskCard({ task, onToggle, onDelete }) {
  const p = PRIORITY[task.priority] || PRIORITY.medium;
  const overdue = !task.isCompleted && new Date(task.deadline) < new Date();

  return (
    <div className={`task-card ${task.isCompleted ? 'done' : ''}`}>
      <button
        className={`check ${task.isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        aria-label={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.isCompleted && '✓'}
      </button>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className="pill" style={{ background: p.bg, color: p.color }}>{p.label}</span>
          <span className={`deadline ${overdue ? 'overdue' : ''}`}>
            {overdue ? '⚠ Overdue · ' : ''}
            {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete task">✕</button>
    </div>
  );
}
