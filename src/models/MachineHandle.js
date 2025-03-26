const mongoose=require('mongoose');
// import dotenv from 'dotenv';

// Load environment variables from .env file
require('dotenv').config();

// Define machine schema
const machineSchema = new mongoose.Schema({
  machineId: { type: String, required: true },
  machineName: { type: String, required: true },
  machineType: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  description: { type: String, default: '' },
  schedule:[ { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  createdAt: { type: Date, default: Date.now }

});

// Create machine model
const Machine = mongoose.model('Machine', machineSchema);



module.exports=Machine;
