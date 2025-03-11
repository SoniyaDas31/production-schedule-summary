import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  machine: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isNonChangeable: {
    type: Boolean,
    default: false
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  extraShift: {
    type: Boolean,
    default: false
  },
  outsourced: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;