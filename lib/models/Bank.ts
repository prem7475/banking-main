import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  bankId: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  fundingSourceUrl: {
    type: String,
    required: true,
  },
  shareableId: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    enum: ['rupay', 'visa', 'mastercard', 'amex'],
    default: 'rupay',
  },
  upiPin: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Bank = mongoose.models.Bank || mongoose.model('Bank', bankSchema);

export default Bank;
