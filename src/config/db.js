const mongoose= require('mongoose');
require('dotenv').config();
const  Machine= require('../models/MachineHandle')
const Counter = require('../models/Counter'); 

const machineData = [
  { machineName: 'KFT/MACH/LTXM-1', machineType: 'COMPOUND MIXING' },
  { machineName: 'KFT/MACH/LTXM-2', machineType: 'COMPOUND MIXING' },
  { machineName: 'KFT/MACH/TFG-1', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-2', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-3', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-4', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-5', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-6', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-7', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/TFG-8', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/CT-1', machineType: 'TUFTING' },
  { machineName: 'KFT/MACH/CT-2', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/CT-3', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/CT-4', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/CT-5', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/CT-6', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/CT-7', machineType: 'CUTTING' },
  { machineName: 'KFT/MACH/PKG-1', machineType: 'LABELLING & PACKING' },
  { machineName: 'KFT/MACH/PKG-2', machineType: 'LABELLING & PACKING' },
  { machineName: 'KFT/MACH/PKG-3', machineType: 'LABELLING & PACKING' },
];

// Assign `machineId` dynamically
const machinesWithId = machineData.map((machine) => ({
  ...machine,
  machineId: machine.machineName, // Using `machineName` as `machineId`
}));

// async function initializeCounter() {
//   // Create an initial counter value for 'order_id' with a starting value of 0
//   await Counter.create({ name: "scheduleId", value: 0 });
//   console.log("Counter initialized!");  // Log success message to confirm initialization
// }




const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    // initializeCounter();
    // Check if machines already exist
    const existingMachines = await Machine.find();
    if (existingMachines.length === 0) {
      await Machine.insertMany(machinesWithId);
      console.log('✅ Machines inserted successfully');
    } else {
      console.log('⚠️ Machines already exist. Skipping insertion.');
    }
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
  }
};

module.exports=connectDB;
