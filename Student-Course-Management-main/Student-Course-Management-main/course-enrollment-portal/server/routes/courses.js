const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses with optional search and filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Error retrieving courses.' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving course details' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Create - CRUD)
router.post('/', auth, async (req, res) => {
  try {
    const { title, code, description, instructor, category, level, duration, credits, capacity, thumbnail, schedule, syllabus } = req.body;

    if (!title || !code || !description) {
      return res.status(400).json({ message: 'Title, course code, and description are required.' });
    }

    const uppercaseCode = code.toUpperCase().trim();
    const existingCode = await Course.findOne({ code: uppercaseCode });
    if (existingCode) {
      return res.status(400).json({ message: `Course code '${uppercaseCode}' is already taken.` });
    }

    const newCourse = new Course({
      title,
      code: uppercaseCode,
      description,
      instructor: instructor || 'Dr. Alex Rivera',
      category: category || 'Computer Science',
      level: level || 'Beginner',
      duration: duration || '8 Weeks',
      credits: Number(credits) || 3,
      capacity: Number(capacity) || 50,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      schedule: schedule || 'Mon & Wed, 10:00 AM - 11:30 AM',
      syllabus: syllabus || [
        { week: 1, title: 'Introduction & Foundations', topics: 'Overview, core concepts, setup' },
        { week: 2, title: 'Core Principles & Architecture', topics: 'Deep dive into fundamental design patterns' }
      ]
    });

    await newCourse.save();
    res.status(201).json({ course: newCourse, message: 'Course created successfully!' });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Failed to create course.' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course details (Update - CRUD)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { title, description, instructor, category, level, duration, credits, capacity, thumbnail, schedule, syllabus } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (instructor) course.instructor = instructor;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration) course.duration = duration;
    if (credits) course.credits = Number(credits);
    if (capacity) course.capacity = Number(capacity);
    if (thumbnail) course.thumbnail = thumbnail;
    if (schedule) course.schedule = schedule;
    if (syllabus) course.syllabus = syllabus;

    await course.save();
    res.json({ course, message: 'Course updated successfully!' });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Failed to update course.' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course (Delete - CRUD)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Clean up associated enrollments
    await Enrollment.deleteMany({ course: req.params.id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: `Course '${course.title}' deleted successfully.` });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Failed to delete course.' });
  }
});

module.exports = router;
