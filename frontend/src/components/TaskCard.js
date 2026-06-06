import React from 'react';
import './TaskCard.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'var(--danger)',   bg: 'var(--danger-dim)' },
  medium: { label: 'Medium', color: 'var(--warning)',  bg: 'var(--warning-dim)' },
  low:    { label: 'Low',    color: 'var(--success)',  bg: 'var(--success-dim)' },
};

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'var(--warning)',  bg: 'var(--warning-dim)' },
  'in-progress': { label: 'In Progress', color: 'var(--info)',    bg: 'var(--info-dim)' },
  completed:   { label: 'Completed',   color: 'var(--success)', bg: 'var(--success-dim)' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { formatted, overdue: diff < 0, soon: diff >= 0 && diff <= 2 };
}

export default function TaskCard({ task, onEdit, onToggle, onDelete }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const due = formatDate(task.dueDate);
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'task-card--completed' : ''} animate-fadeIn`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span
            className="task-badge"
            style={{ color: priority.color, background: priority.bg }}
          >
            {priority.label}
          </span>
          <span
            className="task-badge"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
        </div>
        <div className="task-actions">
          <button className="task-action-btn" onClick={onEdit} title="Edit">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="task-action-btn task-action-btn--danger" onClick={onDelete} title="Delete">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className={`task-title ${isCompleted ? 'task-title--done' : ''}`}>{task.title}</h3>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-footer">
        {due && (
          <span
            className="task-due"
            style={{
              color: due.overdue ? 'var(--danger)' : due.soon ? 'var(--warning)' : 'var(--text-muted)',
            }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
            </svg>
            {due.overdue ? `Overdue · ${due.formatted}` : due.formatted}
          </span>
        )}
        <button
          className={`toggle-btn ${isCompleted ? 'toggle-btn--done' : ''}`}
          onClick={onToggle}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isCompleted ? 'Undo' : 'Done'}
        </button>
      </div>
    </div>
  );
}