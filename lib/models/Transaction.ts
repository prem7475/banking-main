import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  bankId: {
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
  channel: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  senderBankId: {
    type: String,
    required: true,
  },
  receiverBankId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  paymentChannel: {
    type: String,
    enum: ['online', 'atm', 'in store', 'other'],
    default: 'online',
  },
  pending: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
