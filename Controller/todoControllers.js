const Todo = require('../models/todomodels');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getAllTodos = async (req, res) => {
  try {
    console.log('📥 GET Request: Fetching all todos...');
    
    const todos = await Todo.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${todos.length} todos`);
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('❌ Error fetching todos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
const getTodoById = async (req, res) => {
  try {
    console.log(`📥 GET Request: Fetching todo with ID: ${req.params.id}`);
    
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      console.log(`❌ Todo not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: `Todo not found with id: ${req.params.id}`
      });
    }
    
    console.log(`✅ Todo found:`, todo.title);
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `Invalid todo ID: ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res) => {
  try {
    console.log('📥 POST Request: Creating new todo...');
    console.log('📦 Request Body:', req.body);
    
    const { title, description, priority, dueDate, tags, category } = req.body;
    
    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      tags,
      category
    });
    
    console.log(`✅ Todo created successfully with ID: ${todo._id}`);
    console.log(`📝 Title: ${todo.title}`);
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    console.error('❌ Error creating todo:', error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error('❌ Validation Errors:', messages);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res) => {
  try {
    console.log(`📥 PUT Request: Updating todo with ID: ${req.params.id}`);
    console.log('📦 Update Data:', req.body);
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!todo) {
      console.log(`❌ Todo not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: `Todo not found with id: ${req.params.id}`
      });
    }
    
    console.log(`✅ Todo updated successfully: ${todo.title}`);
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    console.error('❌ Error updating todo:', error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `Invalid todo ID: ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res) => {
  try {
    console.log(`📥 DELETE Request: Deleting todo with ID: ${req.params.id}`);
    
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      console.log(`❌ Todo not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: `Todo not found with id: ${req.params.id}`
      });
    }
    
    console.log(`✅ Todo deleted successfully: ${todo.title}`);
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting todo:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `Invalid todo ID: ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Public
const toggleTodoComplete = async (req, res) => {
  try {
    console.log(`📥 PATCH Request: Toggling completion for todo ID: ${req.params.id}`);
    
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      console.log(`❌ Todo not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: `Todo not found with id: ${req.params.id}`
      });
    }
    
    // Toggle the completion status
    todo.completed = !todo.completed;
    await todo.save();
    
    console.log(`✅ Todo completion toggled: ${todo.title} - Completed: ${todo.completed}`);
    
    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
      data: todo
    });
  } catch (error) {
    console.error('❌ Error toggling todo:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `Invalid todo ID: ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get todos by completion status
// @route   GET /api/todos/filter/:status
// @access  Public
const getTodosByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    console.log(`📥 GET Request: Fetching ${status} todos...`);
    
    const completed = status === 'completed';
    const todos = await Todo.find({ completed }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${todos.length} ${status} todos`);
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  getTodosByStatus
};