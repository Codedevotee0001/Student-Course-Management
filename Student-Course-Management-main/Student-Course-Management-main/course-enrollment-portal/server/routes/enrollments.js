const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// @route   GET /api/enrollments/my
// @desc    Get user's enrolled courses with details (Read - CRUD)
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ message: 'Error retrieving user enrollments.' });
  }
});

// @route   POST /api/enrollments
// @desc    Enroll user in a course (Create - CRUD)
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // Check capacity
    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: 'Course has reached maximum student capacity.' });
    }

    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
      status: 'Active',
      progress: 0,
      grade: 'In Progress'
    });

    await enrollment.save();

    // Increment enrolled count on course
    course.enrolledCount += 1;
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('course');

    res.status(201).json({
      enrollment: populatedEnrollment,
      message: `Enrolled successfully in ${course.title}!`
    });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ message: 'Error enrolling in course.' });
  }
});

// @route   PUT /api/enrollments/:id/progress
// @desc    Update progress percentage and lessons (Update - CRUD)
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress, completedLessons, grade, status } = req.body;
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    if (progress !== undefined) {
      const p = Math.min(100, Math.max(0, Number(progress)));
      enrollment.progress = p;

      if (p === 100) {
        enrollment.status = 'Completed';
        enrollment.grade = grade || 'A';
      } else {
        enrollment.status = 'Active';
      }
    }

    if (completedLessons) {
      enrollment.completedLessons = completedLessons;
    }

    if (status) {
      enrollment.status = status;
    }

    await enrollment.save();
    const updated = await Enrollment.findById(enrollment._id).populate('course');

    res.json({ enrollment: updated, message: 'Progress updated successfully!' });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ message: 'Error updating course progress.' });
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Unenroll / drop course (Delete - CRUD)
router.delete('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    // Decrement course enrolled count
    const course = await Course.findById(enrollment.course);
    if (course && course.enrolledCount > 0) {
      course.enrolledCount -= 1;
      await course.save();
    }

    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Successfully dropped course.' });
  } catch (err) {
    console.error('Error dropping course:', err);
    res.status(500).json({ message: 'Error dropping course.' });
  }
});

module.exports = router;
