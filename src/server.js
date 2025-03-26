const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB=require( './config/db.js');
const Schedule=require('./models/Schedule.js');
const  Machine= require('./models/MachineHandle.js');
const router = express.Router();
const scheduleRouter= require('./routers/schedule.js')
const analyzeRouter=require('./routers/machineCapacity.js')
const machineRouter=require('./routers/machineRoutes.js')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:
   true }));
app.use('/', scheduleRouter);
app.use('/capacity', analyzeRouter);
app.use('/machine', machineRouter);
// Connect to MongoDB
connectDB();

// Get all schedules
// app.get('/api/schedules', async (req, res) => {
//   try {
//     const schedules = await Schedule.find({});
//     res.json(schedules);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create a new schedule
// app.post('/api/schedules', async (req, res) => {
//   try {
//     const schedule = new Schedule(req.body);
//     const savedSchedule = await schedule.save();
//     res.status(201).json(savedSchedule);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update a schedule
// app.put('/api/schedules/:id', async (req, res) => {
//   try {
//     const schedule = await Schedule.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!schedule) {
//       return res.status(404).json({ message: 'Schedule not found' });
//     }
//     res.json(schedule);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete a schedule
// app.delete('/api/schedules/:id', async (req, res) => {
//   try {
//     const schedule = await Schedule.findByIdAndDelete(req.params.id);
//     if (!schedule) {
//       return res.status(404).json({ message: 'Schedule not found' });
//     }
//     res.json({ message: 'Schedule deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});