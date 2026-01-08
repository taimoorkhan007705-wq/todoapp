const cors = require('cors');
app.use(cors());
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const todoRoutes = require('./todoroutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Todo API',
    endpoints: {
      getAllTodos: 'GET /api/todos',
      getTodoById: 'GET /api/todos/:id',
      createTodo: 'POST /api/todos',
      updateTodo: 'PUT /api/todos/:id',
      deleteTodo: 'DELETE /api/todos/:id',
      toggleComplete: 'PATCH /api/todos/:id/toggle'
    }
  });
});

// API Routes
app.use('/api', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
