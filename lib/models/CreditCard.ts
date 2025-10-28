import mongoose from 'mongoose';

const creditCardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  cardNetwork: {
    type: String,
    enum: ['rupay', 'visa', 'mastercard', 'amex'],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const CreditCard = mongoose.models.CreditCard || mongoose.model('CreditCard', creditCardSchema);

export default CreditCard;
