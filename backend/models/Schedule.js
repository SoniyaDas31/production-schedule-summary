import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  machine: { type: String, required: true },
  priority: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nonChangeable: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Schedule', scheduleSchema);