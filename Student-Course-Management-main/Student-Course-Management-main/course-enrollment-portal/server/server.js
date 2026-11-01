const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_enrollment_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Course Enrollment API is running smoothly',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// Connect to MongoDB & Start Server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('====================================================');
    console.log(` MongoDB Connected Successfully to: ${MONGODB_URI}`);
    console.log(' Open MongoDB Compass and connect to mongodb://localhost:27017');
    console.log(' Target Database: course_enrollment_db');
    console.log('====================================================');

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err);
    process.exit(1);
  });
