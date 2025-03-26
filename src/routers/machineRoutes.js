const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Machine=require('../models/MachineHandle');
// const Schedule = require('../models/Schedule');
router.use(express.json());


router.get('/list',async(req,res)=>{
    try {
        const machines = await Machine.find({});
        res.json(machines);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }


});

module.exports=router;

