

const express = require('express');
const Schedule = require('../models/Schedule');
const Machine = require('../models/MachineHandle');
const analyzeMachineCapacity=require('../controller/analyzeCapacity')
const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    // Fetch all schedules from the database (or you can pass a filter to fetch specific schedules)
    const schedules = await Schedule.find().populate('machine'); 

    // Run the analysis
    const machineAnalysis = analyzeMachineCapacity(schedules);

    // Return the results
    res.status(200).json({ machineAnalysis });
  } catch (error) {
    console.error("Error analyzing machine capacity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
