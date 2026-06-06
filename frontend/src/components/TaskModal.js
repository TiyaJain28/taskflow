import React, { useState, useEffect, useRef } from 'react';
import './TaskModal.css';

const defaultForm = {
  title: '', description: '', status: 'pending', priority: 'medium', dueDate: '',
};

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(defaultForm);
    }
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [task]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    else if (form.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
    if (form.description && form.description.length > 500) errs.description = 'Max 500 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      await onSave({
        ...form,
        dueDate: form.dueDate || null,
      });
    } catch {
      // handled in parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input
              ref={firstInputRef}
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              type="text"
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
            <div className="input-meta">
              {errors.title
                ? <span className="form-hint form-hint--error">{errors.title}</span>
                : <span />
              }
              <span className="char-count">{form.title.length}/100</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
              name="description"
              placeholder="Add details, notes, or context..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
            />
            <div className="input-meta">
              {errors.description
                ? <span className="form-hint form-hint--error">{errors.description}</span>
                : <span />
              }
              <span className="char-count">{form.description.length}/500</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="radio-group">
                {[
                  { value: 'pending', label: 'Pending', color: 'var(--warning)' },
                  { value: 'in-progress', label: 'In Progress', color: 'var(--info)' },
                  { value: 'completed', label: 'Completed', color: 'var(--success)' },
                ].map((s) => (
                  <label
                    key={s.value}
                    className={`radio-option ${form.status === s.value ? 'radio-option--active' : ''}`}
                    style={form.status === s.value ? { borderColor: s.color, '--opt-color': s.color } : {}}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      checked={form.status === s.value}
                      onChange={handleChange}
                      className="visually-hidden"
                    />
                    <span className="radio-dot" style={{ background: s.color }} />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="radio-group">
                {[
                  { value: 'low', label: 'Low', color: 'var(--success)' },
                  { value: 'medium', label: 'Medium', color: 'var(--warning)' },
                  { value: 'high', label: 'High', color: 'var(--danger)' },
                ].map((p) => (
                  <label
                    key={p.value}
                    className={`radio-option ${form.priority === p.value ? 'radio-option--active' : ''}`}
                    style={form.priority === p.value ? { borderColor: p.color, '--opt-color': p.color } : {}}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      checked={form.priority === p.value}
                      onChange={handleChange}
                      className="visually-hidden"
                    />
                    <span className="radio-dot" style={{ background: p.color }} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}