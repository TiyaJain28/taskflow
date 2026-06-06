import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import './Dashboard.css';

const STATUSES = [
  { value: '', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: '', label: 'Any Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const {
    tasks, stats, pagination, loading,
    fetchTasks, createTask, updateTask, toggleTask, deleteTask, debouncedFetch,
  } = useTasks();

  const [filters, setFilters] = useState({
    search: '', status: '', priority: '', page: 1, limit: 9, sortBy: 'createdAt', order: 'desc',
  });
  const [modal, setModal] = useState({ open: false, task: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadTasks = useCallback((params) => {
    fetchTasks(params);
  }, [fetchTasks]);

  useEffect(() => {
    loadTasks(filters);
  }, [filters.status, filters.priority, filters.page, filters.sortBy, filters.order]);

  useEffect(() => {
    if (filters.search !== undefined) {
      debouncedFetch({ ...filters, page: 1 });
    }
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((p) => ({ ...p, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((p) => ({ ...p, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTask = async (formData) => {
    if (modal.task) {
      const updated = await updateTask(modal.task._id, formData);
      if (updated) { setModal({ open: false, task: null }); loadTasks(filters); }
    } else {
      const created = await createTask(formData);
      if (created) { setModal({ open: false, task: null }); loadTasks({ ...filters, page: 1 }); }
    }
  };

  const handleToggle = async (id) => {
    await toggleTask(id);
    loadTasks(filters);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setDeleteConfirm(null);
    const newPage = tasks.length === 1 && filters.page > 1 ? filters.page - 1 : filters.page;
    setFilters((p) => ({ ...p, page: newPage }));
    loadTasks({ ...filters, page: newPage });
  };

  const totalTasks = (stats.pending || 0) + (stats['in-progress'] || 0) + (stats.completed || 0);
  const completionRate = totalTasks ? Math.round(((stats.completed || 0) / totalTasks) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">TaskFlow</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-dot stat-dot--pending" />
            <span className="stat-label">Pending</span>
            <span className="stat-count">{stats.pending || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-dot stat-dot--progress" />
            <span className="stat-label">In Progress</span>
            <span className="stat-count">{stats['in-progress'] || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-dot stat-dot--done" />
            <span className="stat-label">Completed</span>
            <span className="stat-count">{stats.completed || 0}</span>
          </div>

          <div className="completion-ring-wrap">
            <svg viewBox="0 0 80 80" className="completion-ring">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="var(--accent)" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className="completion-text">
              <span className="completion-pct">{completionRate}%</span>
              <span className="completion-label">done</span>
            </div>
          </div>
        </div>

        <button className="btn-logout" onClick={logout}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">My Tasks</h1>
            <span className="task-count-badge">{pagination.total} total</span>
          </div>
          <button className="btn btn-primary btn-add" onClick={() => setModal({ open: true, task: null })}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
            </svg>
            New Task
          </button>
        </header>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
            />
            {filters.search && (
              <button className="search-clear" onClick={() => handleFilterChange('search', '')}>✕</button>
            )}
          </div>

          <div className="filter-chips">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                className={`filter-chip ${filters.status === s.value ? 'filter-chip--active' : ''}`}
                onClick={() => handleFilterChange('status', s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <select
            className="filter-select"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={`${filters.sortBy}_${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('_');
              setFilters((p) => ({ ...p, sortBy, order, page: 1 }));
            }}
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="dueDate_asc">Due Date ↑</option>
            <option value="dueDate_desc">Due Date ↓</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
          </select>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="tasks-loading">
            {[...Array(6)].map((_, i) => <div key={i} className="task-skeleton" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty animate-fadeIn">
            <div className="empty-icon">◎</div>
            <h3 className="empty-title">
              {filters.search || filters.status || filters.priority
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </h3>
            <p className="empty-desc">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button className="btn btn-primary" onClick={() => setModal({ open: true, task: null })}>
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid animate-fadeIn">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => setModal({ open: true, task })}
                onToggle={() => handleToggle(task._id)}
                onDelete={() => setDeleteConfirm(task._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              ← Prev
            </button>
            <div className="pagination-pages">
              {[...Array(pagination.pages)].map((_, i) => {
                const p = i + 1;
                if (pagination.pages > 7 && Math.abs(p - filters.page) > 2 && p !== 1 && p !== pagination.pages) {
                  if (p === filters.page - 3 || p === filters.page + 3) return <span key={p} className="pagination-ellipsis">…</span>;
                  if (Math.abs(p - filters.page) > 2) return null;
                }
                return (
                  <button
                    key={p}
                    className={`pagination-page ${p === filters.page ? 'pagination-page--active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              className="pagination-btn"
              disabled={filters.page >= pagination.pages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          task={modal.task}
          onSave={handleSaveTask}
          onClose={() => setModal({ open: false, task: null })}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠</div>
            <h3 className="confirm-title">Delete Task?</h3>
            <p className="confirm-desc">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}