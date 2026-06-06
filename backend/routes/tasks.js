const express = require('express');
const { body } = require('express-validator');
const {
  getTasks, getTask, createTask, updateTask, toggleTask, deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status').optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true })
    .isISO8601().withMessage('Invalid date format'),
];

router.route('/').get(getTasks).post(taskValidation, createTask);
router.route('/:id').get(getTask).put(taskValidation, updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;