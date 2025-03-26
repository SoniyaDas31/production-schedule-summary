const mongoose=require('mongoose');

// const Counter = require('../models/Counter');


const scheduleSchema = new mongoose.Schema({
  // scheduleId: {
  //   type: Number,
  //   unique:true
  // },
  // machine: {
  //   type: String,
  //   required: true
  // },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
     ref: "Machine",
     required:true 

       // connect MACHINE
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

// Auto-increment order_id before saving
// scheduleSchema.pre("save", async function (next) {
//   if (!this.scheduleId) {  // Only generate scheduleId if it's not already set
//     const counter = await Counter.findOneAndUpdate(
//       { name: "scheduleId" },
//       { $inc: { value: 1 } },
//       { new: true, upsert: true }
//     );
//     this.scheduleId = `ORD-${String(counter.value).padStart(5, "0")}`; // Generate scheduleId in the format ORD-00001
//   }
//   next();
// });

// Pre-save hook to assign auto-increment scheduleId
// scheduleSchema.pre('save', async function (next) {
//   const schedule = this;

//   // Find and update the counter for 'scheduleId'
//   const counter = await Counter.findOneAndUpdate(
//     { _id: 'scheduleId' },  // This can be any unique identifier
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true } // upsert ensures a document is created if not found
//   );

//   // Assign the auto-incremented scheduleId to the current schedule
//   schedule.scheduleId = counter.sequence_value;

//   next();
// });

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports=Schedule;