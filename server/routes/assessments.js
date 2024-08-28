const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { buildDocx } = require('../lib/docxBuilder'); // Import the buildDocx function

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
    const risks = answer.option.explain_risk && answer.form_data ? answer.form_data.risks : "";
    return {
      checkpoint: checkpoint.id,
      question: checkpoint.title,
      category: checkpoint.category,
      answer: answer.option.option,
      considerations: answer.considerations || {},
      risk_level: answer.option.risk_level,
      risks: risks
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
      sharing_reason_details: assessment.data_capture.sharing_reason_details.value || "",
      answers: mappedAnswers
    };

    const accept = req.headers.accept;

    if (accept.includes('text/csv')) {
      // Flatten mappedAnswers to handle the array of risks
      const flattenedAnswers = [];
      mappedAnswers.forEach(answer => {
        if (answer.risks.length > 0) {
          answer.risks.forEach(risk => {
            flattenedAnswers.push({
              question: answer.question,
              category: answer.category,
              answer: answer.answer,
              risk_level: answer.risk_level,
              risk: risk.risk,
              likelihood: risk.likelihood,
              impact: risk.impact,
              actionType: risk.actionType,
              mitigatingActions: risk.mitigatingActions
            });
          });
        } else {
          // If no risks, push a single entry with empty risk fields
          flattenedAnswers.push({
            question: answer.question,
            category: answer.category,
            answer: answer.answer,
            risk_level: answer.risk_level,
            risk: '',
            likelihood: '',
            impact: '',
            actionType: '',
            mitigatingActions: ''
          });
        }
      });

      const fields = ['question', 'category', 'answer', 'risk_level', 'risk', 'likelihood', 'impact', 'actionType', 'mitigatingActions'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(flattenedAnswers);
      res.header('Content-Type', 'text/csv');
      res.attachment(`assessment_report_${req.params.id}.csv`);
      return res.send(csv);
    } else if (accept.includes('application/json')) {
      res.header('Content-Type', 'application/json');
      return res.send(JSON.stringify(report, null, 2));
    } else if (accept.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      const userId = req.user._id; // Fetch the user ID from req.user
      const user = await User.findById(userId);
      const owner = {};
      owner.name = user.name;
      owner.email = user.email;
      let metrics = await getAssessmentMetrics(report);
      const tempFilePath = await buildDocx(report,metrics, owner);
      const fileName = `${report.dataset_name.replace(/\s+/g, '_').trim()}.docx`;
      //const buffer = await docx.Packer.toBuffer(doc);
      res.set('Content-Disposition', `attachment; filename="${fileName}"`);
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.sendFile(path.resolve(tempFilePath), async (err) => {
          if (err) {
              console.error("Error sending file:", err);
          } else {
              // Cleanup temporary file after sending
              try {
                  await fs.promises.unlink(tempFilePath);
              } catch (error) {
                  console.error("Error deleting temporary file:", error);
              }
          }
      });
    } else {
      res.status(406).send('Not Acceptable');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getAssessmentMetrics(report) {
  // Extract all risks from the report
  const allRisks = [];
  report.answers.forEach(answer => {
    if (answer.risks) {
      answer.risks.forEach(risk => {
        allRisks.push({ ...risk, checkpoint: answer.category });
      });
    }
  });

  // Sort risks by likelihood and impact
  const sortedRisks = allRisks.sort((a, b) => {
    const likelihoodOrder = { High: 3, Medium: 2, Low: 1 };
    const impactOrder = { High: 3, Medium: 2, Low: 1 };

    const aScore = likelihoodOrder[a.likelihood] + impactOrder[a.impact];
    const bScore = likelihoodOrder[b.likelihood] + impactOrder[b.impact];

    return bScore - aScore;
  });

  // Get top 5 risks
  const topRisks = sortedRisks.slice(0, 5);

  // Classify risks
  const riskCounts = { high: 0, medium: 0, low: 0 };
  const classifyRisk = (likelihood, impact) => {
    const score = {
      High: 3,
      Medium: 2,
      Low: 1
    }[likelihood] + {
      High: 3,
      Medium: 2,
      Low: 1
    }[impact];

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  allRisks.forEach(risk => {
    const category = classifyRisk(risk.likelihood, risk.impact);
    riskCounts[category]++;
  });

  // Create metrics object
  const metrics = {
    topRisks,
    riskCounts,
    sortedRisks
  };

  return metrics;
}


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