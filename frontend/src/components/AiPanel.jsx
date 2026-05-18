import './AiPanel.css';

export default function AiPanel({ data, error, tasks, onClose }) {
  let ranked = [];

  if (data?.result) {
    try {
      const clean = data.result.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      ranked = parsed.map(item => ({
        ...item,
        task: tasks.find(t => t.id === item.taskId),
      })).filter(r => r.task).sort((a, b) => a.rank - b.rank);
    } catch {
      // If JSON parse fails, show raw text
    }
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div>
          <span className="ai-badge">{data?.mode === 'demo' ? 'Demo mode' : '✦ AI result'}</span>
          <h2>Prioritization</h2>
        </div>
        <button onClick={onClose} className="close-btn" aria-label="Close">✕</button>
      </div>

      {error && <p className="ai-error">{error}</p>}

      {data?.mode === 'demo' && (
        <p className="demo-note">
          Running in demo mode — add your Hugging Face API key in <code>appsettings.json</code> to enable real AI ranking.
        </p>
      )}

      {ranked.length > 0 ? (
        <ol className="ranked-list">
          {ranked.map((r, i) => (
            <li key={r.taskId} className="ranked-item">
              <span className="rank-num">{i + 1}</span>
              <div>
                <p className="rank-title">{r.task.title}</p>
                <p className="rank-reason">{r.reason}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : data?.result ? (
        <pre className="raw-result">{data.result}</pre>
      ) : null}
    </div>
  );
}
