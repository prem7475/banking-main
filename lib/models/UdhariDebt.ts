import mongoose from 'mongoose';

const udhariDebtSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  whoPaid: {
    type: String, // friend name or 'me'
    required: true,
  },
  splitWith: [{
    friendId: {
      type: String, // friend _id or 'me'
      required: true,
    },
    friendName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    settled: {
      type: Boolean,
      default: false,
    },
    settledDate: {
      type: Date,
      default: null,
    },
  }],
  category: {
    type: String,
    default: 'General',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'settled'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const UdhariDebt = mongoose.models.UdhariDebt || mongoose.model('UdhariDebt', udhariDebtSchema);

export default UdhariDebt;
