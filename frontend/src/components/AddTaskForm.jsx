import { useState } from 'react';
import './AddTaskForm.css';

const empty = { title: '', description: '', priority: 'medium', deadline: '' };

export default function AddTaskForm({ onAdd }) {
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;
    await onAdd(form);
    setForm(empty);
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="add-trigger" onClick={() => setOpen(true)}>
        + Add task
      </button>
    );
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        name="title" placeholder="Task title" required autoFocus
        value={form.title} onChange={handle}
      />
      <input
        name="description" placeholder="Description (optional)"
        value={form.description} onChange={handle}
      />
      <div className="form-row">
        <select name="priority" value={form.priority} onChange={handle}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          type="date" name="deadline" required
          value={form.deadline} onChange={handle}
          style={{ flex: 1 }}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary">Add task</button>
        <button type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
