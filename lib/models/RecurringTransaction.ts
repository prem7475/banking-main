import mongoose from 'mongoose';

const recurringTransactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null, // null means indefinite
  },
  nextDueDate: {
    type: Date,
    required: true,
  },
  accountId: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const RecurringTransaction = mongoose.models.RecurringTransaction || mongoose.model('RecurringTransaction', recurringTransactionSchema);

export default RecurringTransaction;
