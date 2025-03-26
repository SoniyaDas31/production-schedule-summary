const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const Counter=require('../models/Counter')
const Machine=require('../models/MachineHandle');
const Schedule = require('../models/Schedule');
router.use(express.json());








  // Get all schedules
  router.get('/get/schedules', async (req, res) => {
    try {
      const schedules = await Schedule.find({});
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new schedule
// router.post('/new/schedule', async (req, res) => {
//     try {
    

//       const schedule = new Schedule(req.body);
//       console.log(schedule)
//       const savedSchedule = await schedule.save();
//       res.status(201).json(savedSchedule);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

//   router.post('/new/schedule', async (req, res) => {
//   const { machine, priority, startDate, endDate,isNonChangeable,requiresApproval,extraShift,outsourced } = req.body;
//   try {
//     const schedule = new Schedule({ machine, priority, startDate, endDate,isNonChangeable,requiresApproval,extraShift,outsourced});
//     const savedSchedule =await schedule.save();
//     // Update the Machine to include this new schedule
//     const updatedMachine = await Machine.findByIdAndUpdate(
//         machine,
//         { $push: { schedule: savedSchedule._id } },
//         { new: true, runValidators: true } // Ensures we return the updated document
//       );
  
//       if (!updatedMachine) throw new Error("Machine not found");
  
//       console.log("✅ Schedule created and linked to machine:", updatedMachine);
//     res.status(201).json(savedSchedule);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



router.post('/new/schedule', async (req, res) => {
    const { machine, priority, startDate, endDate, isNonChangeable, requiresApproval, extraShift, outsourced } = req.body;
  
    try {
   
      //  Validate required fields
      if (!machine || !startDate || !endDate) {
        return res.status(400).json({ error: "Machine, startDate, and endDate are required" });
      }
  
      //  Ensure endDate is after startDate
      if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({ error: "endDate must be after startDate" });
      }
  
      //  Check if the machine exists before scheduling
      const existingMachine = await Machine.findById(machine);
      if (!existingMachine) {
        return res.status(404).json({ error: "Machine not found" });
      }
  
      // Create and save the schedule
      const schedule = new Schedule({ machine, priority, startDate, endDate, isNonChangeable, requiresApproval, extraShift, outsourced});
      const savedSchedule = await schedule.save();
  
      //  Update the Machine to include this new schedule
      const updatedMachine = await Machine.findByIdAndUpdate(
        machine,
        { $push: { schedule: savedSchedule._id } },
        { new: true, runValidators: true }
      );
  
      console.log("✅ Schedule created and linked to machine:", updatedMachine);
      res.status(201).json({ message: "Schedule created successfully", schedule: savedSchedule });
      
    } catch (err) {
      console.error("❌ Error creating schedule:", err.message);
      res.status(500).json({ error: err.message });
    }
  });







  // Update a schedule
// router.put('/edit/schedule/:id', async (req, res) => {
//     try {
//       const schedule = await Schedule.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       if (!schedule) {
//         return res.status(404).json({ message: 'Schedule not found' });
//       }
//       res.json(schedule);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });


  router.put('/edit/schedule/:id', async (req, res) => {
    const { id } = req.params; // Schedule ID
    const { machine, priority, startDate, endDate, isNonChangeable, requiresApproval, extraShift, outsourced } = req.body;
  const session=await mongoose.startSession();
session.startTransaction(); //start session

    try {
      // ✅ Check if the schedule exists
      const existingSchedule = await Schedule.findById(id).session(session);
      if (!existingSchedule) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "Schedule not found" });

      }
  if(existingSchedule.isNonChangeable){
    await session.abortTransaction();
    session.endSession();
    return res.status(403).json({ error: "This Schedule is non-changeable,rescheduling not possible" });
  }
      // ✅ Validate dates: Ensure endDate is after startDate
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "endDate must be after startDate" });
      }
  
      // ✅ If machine is changed, update the old and new machine
      if (machine && machine !== existingSchedule.machine.toString()) {
        // Remove schedule from old machine
        const oldMachineUpdate = await Machine.findByIdAndUpdate(existingSchedule.machine, { $pull: { schedule: id } },{session});
  
        // Check if new machine exists
        const newMachine = await Machine.findById(machine).session(session);
        if (!newMachine) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ error: "New machine not found" });
        }
  
        // Add schedule to new machine
        const newMachineUpdate = await Machine.findByIdAndUpdate(machine, { $push: { schedule: id } },{session});
          // Run both updates in parallel
        await Promise.all([oldMachineUpdate, newMachineUpdate]);
      }
  
      //  Update schedule details
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        id,
        { machine, priority, startDate, endDate, isNonChangeable, requiresApproval, extraShift, outsourced },
        { new: true, runValidators: true,session }
      );
         //  Commit transaction
    await session.commitTransaction();
    session.endSession();
  
      console.log("✅ Schedule updated successfully:", updatedSchedule);
      res.status(200).json({ message: "Schedule updated successfully", schedule: updatedSchedule });
  
    } catch (err) {
      //Rollback transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
      console.error("❌ Error updating schedule:", err.message);
      res.status(500).json({ error: err.message });
    }
  });







  // Delete a schedule
router.delete('/delete/schedule/:id', async (req, res) => {
    try {
      const schedule = await Schedule.findByIdAndDelete(req.params.id);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;