import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Schedule from './models/Schedule.js';  // Add this import

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes for schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    console.log('Fetched schedules:', schedules); // Add debug logging
    res.json(schedules);
  } catch (error) {
    console.error('Error details:', error); // Add debug logging
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;  // Changed to 5001 as fallback
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Please try a different port.`);
  } else {
    console.error('Server error:', err);
  }
});