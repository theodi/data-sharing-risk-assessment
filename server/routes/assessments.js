const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const ensureAuthenticated = require('../middleware/ensureAuthenticated'); // Assuming you move the ensureAuthenticated middleware to a separate file

// Get all assessments
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const user = await User.findById(userId);

    const assessments = await Assessment.find({
      $or: [
        { owner: userId },
        { 'sharedWith.user': user.email }
      ]
    });

    const assessmentsWithOwnerEmail = await Promise.all(assessments.map(async assessment => {
      const owner = await User.findById(assessment.owner);
      const ownerEmail = owner.email;
      const assessmentObj = assessment.toObject();
      assessmentObj.ownerEmail = ownerEmail;

      if (assessment.owner.toString() !== userId) {
        delete assessmentObj.sharedWith;
      }

      return assessmentObj;
    }));

    res.json(assessmentsWithOwnerEmail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single assessment by ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const user = await User.findById(userId);
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const owner = await User.findById(assessment.owner);
    const ownerEmail = owner.email;
    const assessmentObj = assessment.toObject();
    assessmentObj.ownerEmail = ownerEmail;

    if (assessment.owner.toString() !== userId && !assessment.sharedWith.some(sharedUser => sharedUser.user === user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (assessment.owner.toString() !== userId) {
      delete assessmentObj.sharedWith;
    }

    res.json(assessmentObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new assessment
router.post('/', ensureAuthenticated, async (req, res) => {
  const userId = req.session.passport.user.id;
  const assessment = new Assessment({
    ...req.body,
    owner: userId
  });

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
    const userId = req.session.passport.user.id;
    const user = await User.findById(userId);
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    if (assessment.owner.toString() !== userId && !assessment.sharedWith.some(sharedUser => sharedUser.user === user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }

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
    const userId = req.session.passport.user.id;
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    if (assessment.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only the owner can delete this assessment' });
    }

    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assessment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;