import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateActiveCheckpointIndex, updateActiveCheckpoint } from './checkpointsSlice';

export default function TopRisksSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeAssessment, checkpoints } = useSelector((state) => state.checkpoints);

  // Aggregate all risks from all checkpoints
  const allRisks = [];
  activeAssessment.answers.forEach(answer => {
    if (answer.form_data && answer.form_data.risks) {
      answer.form_data.risks.forEach(risk => {
        allRisks.push({ ...risk, checkpointId: answer.id });
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

  const handleNavigateToCheckpoint = (checkpointId) => {
    const checkpointIndex = checkpoints.findIndex(c => c.id === checkpointId);
    dispatch(updateActiveCheckpointIndex(checkpointIndex));
    dispatch(updateActiveCheckpoint(checkpointIndex));
    navigate(`/assessment/${activeAssessment.id}/checkpoint/${checkpointId}`);
  };

  return (
    <div className="top-risks-sidebar">
      <div className="view-report-cta view-risks-cta">
        <div className="cta-inner">
          <div className="cta-title">Top 5 Risks</div>
          <div className="cta-content">
            {topRisks.length > 0 ? (
              topRisks.map((risk, index) => (
                <div key={index} className="risk-item" onClick={() => handleNavigateToCheckpoint(risk.checkpointId)} style={{ cursor: 'pointer' }}>
                  <p><strong>{risk.risk}</strong></p>
                  <div className="risk-classification">Likelihood:
                    <div className={`checkpoint-risk-level button ${risk.likelihood === 'High' ? 'red' : risk.likelihood === 'Medium' ? 'amber' : 'green'}`}>
                      {risk.likelihood}
                    </div>
                  </div>
                  <div className="risk-classification">Impact:
                    <div className={`checkpoint-risk-level button ${risk.impact === 'High' ? 'red' : risk.impact === 'Medium' ? 'amber' : 'green'}`}>
                      {risk.impact}
                    </div>
                  </div>
                  <p><strong>Checkpoint:</strong> {checkpoints.find(c => c.id === risk.checkpointId).title}</p>
                </div>
              ))
            ) : (
              <p>No risks identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}