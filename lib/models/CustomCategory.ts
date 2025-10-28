import mongoose from 'mongoose';

const customCategorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'tag',
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const CustomCategory = mongoose.models.CustomCategory || mongoose.model('CustomCategory', customCategorySchema);

export default CustomCategory;
