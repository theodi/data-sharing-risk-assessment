const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const ensureAuthenticated = require('../middleware/ensureAuthenticated'); // Assuming you move the ensureAuthenticated middleware to a separate file

// Get all assessments
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single assessment by ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new assessment
router.post('/', ensureAuthenticated, async (req, res) => {
  const assessment = new Assessment(req.body);
  try {
    const newAssessment = await assessment.save();
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an assessment by ID
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    Object.assign(assessment, req.body, { date_modified: new Date() });
    const updatedAssessment = await assessment.save();
    res.json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an assessment by ID
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    await assessment.remove();
    res.json({ message: 'Assessment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;