import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  monthlyLimit: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    default: 0,
  },
  month: {
    type: String, // YYYY-MM format
    required: true,
  },
  alertThreshold: {
    type: Number, // percentage (e.g., 90 for 90%)
    default: 90,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget;
