const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { Parser } = require('json2csv');

// Get all assessments
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Fetch the user ID from req.user
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
    const userId = req.user._id; // Fetch the user ID from req.user
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

// Utility function to map answers with checkpoints
function mapAnswersWithCheckpoints(assessment, checkpoints) {
  return assessment.answers.map(answer => {
    const checkpoint = checkpoints.find(cp => cp.id === answer.id);
    const mitigatingActions = answer.option.explain_risk && answer.form_data ? answer.form_data.mitigating_actions : "";
    return {
      question: checkpoint.title,
      category: checkpoint.category,
      answer: answer.option.option,
      risk_level: answer.option.risk_level,
      mitigating_actions: mitigatingActions
    };
  });
}


// Route to get report in JSON or CSV format using content negotiation
router.get('/:id/report', ensureAuthenticated, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const checkpoints = require('../data/checkpoints.json');
    const mappedAnswers = mapAnswersWithCheckpoints(assessment, checkpoints);

    const report = {
      dataset_name: assessment.data_capture.dataset_name.value,
      dataset_description: assessment.data_capture.dataset_description.value,
      sharing_reason: assessment.data_capture.sharing_reason.value,
      answers: mappedAnswers
    };

    const accept = req.headers.accept;

    if (accept.includes('text/csv')) {
      const fields = ['question', 'category', 'answer', 'risk_level', 'mitigating_actions'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(mappedAnswers);
      res.header('Content-Type', 'text/csv');
      res.attachment(`assessment_report_${req.params.id}.csv`);
      return res.send(csv);
    } else if (accept.includes('application/json')) {
      res.header('Content-Type', 'application/json');
      return res.json(report);
    } else {
      res.status(406).send('Not Acceptable');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new assessment
router.post('/', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id; // Fetch the user ID from req.user
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
    const userId = req.user._id; // Fetch the user ID from req.user
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
    const userId = req.user._id; // Fetch the user ID from req.user
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

// GET route to retrieve shared users of an assessment
router.get('/:id/sharedUsers', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Fetch the user ID from req.user
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.owner.toString() !== userId && !assessment.sharedWith.some(sharedUser => sharedUser.user === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const sharedUsers = assessment.sharedWith.map(user => user.user);

    res.json({ sharedUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST route to add a new shared user to an assessment
router.post('/:id/sharedUsers', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id; // Fetch the user ID from req.user
  const { email } = req.body; // Assuming the email is sent in the request body

  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.owner.toString() !== userId && !assessment.sharedWith.some(sharedUser => sharedUser.user === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assessment.sharedWith.push({ user: email });

    await assessment.save();

    res.json({ message: "User added to the assessment successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE route to remove a shared user from an assessment
router.delete('/:id/sharedUsers/:email', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id; // Fetch the user ID from req.user
  const email = req.params.email;

  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.owner.toString() !== userId && !assessment.sharedWith.some(sharedUser => sharedUser.user === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const index = assessment.sharedWith.findIndex(user => user.user === email);

    if (index !== -1) {
      assessment.sharedWith.splice(index, 1);
      await assessment.save();
      res.json({ message: "Shared user removed from the assessment successfully" });
    } else {
      res.status(404).json({ message: "Shared user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;