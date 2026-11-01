const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    default: 'Dr. Alex Rivera'
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Data Science & AI', 'Web Development', 'UI/UX Design', 'Cloud & DevOps', 'Cybersecurity', 'Business & Tech'],
    default: 'Computer Science'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: String,
    default: '8 Weeks'
  },
  credits: {
    type: Number,
    default: 3
  },
  capacity: {
    type: Number,
    default: 50
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.8
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  schedule: {
    type: String,
    default: 'Mon & Wed, 10:00 AM - 11:30 AM'
  },
  syllabus: [{
    week: Number,
    title: String,
    topics: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
