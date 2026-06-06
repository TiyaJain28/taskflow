import { useState, useCallback, useRef } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, 'in-progress': 0, completed: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskAPI.getAll(params);
      setTasks(data.tasks);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await taskAPI.create(taskData);
      toast.success('Task created!');
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const { data } = await taskAPI.update(id, taskData);
      toast.success('Task updated!');
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(async (id) => {
    try {
      const { data } = await taskAPI.toggle(id);
      return data.task;
    } catch (err) {
      toast.error('Failed to update status');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const debouncedFetch = useCallback((params, delay = 400) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTasks(params), delay);
  }, [fetchTasks]);

  return {
    tasks, stats, pagination, loading, error,
    fetchTasks, createTask, updateTask, toggleTask, deleteTask, debouncedFetch,
  };
};