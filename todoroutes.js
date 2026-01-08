const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  getTodosByStatus
} = require('./Controller/todoControllers');

// Main routes
router.route('/todos')
  .get(getAllTodos)
  .post(createTodo);

// Filter by status (completed/incomplete)
router.get('/todos/filter/:status', getTodosByStatus);

// Toggle completion
router.patch('/todos/:id/toggle', toggleTodoComplete);

// Individual todo routes
router.route('/todos/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;