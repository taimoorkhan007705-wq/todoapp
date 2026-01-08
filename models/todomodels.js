const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a todo title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['personal', 'work', 'shopping', 'health', 'other'],
    default: 'personal'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Add a method to toggle completion status
TodoSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  return this.save();
};

// Add a virtual property for overdue status
TodoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Ensure virtuals are included in JSON output
TodoSchema.set('toJSON', { virtuals: true });
TodoSchema.set('toObject', { virtuals: true });

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;