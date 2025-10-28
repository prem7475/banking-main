import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Friend = mongoose.models.Friend || mongoose.model('Friend', friendSchema);

export default Friend;
