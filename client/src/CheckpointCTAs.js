import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenMitigateRisk from './OpenMitigateRisk';

export default function CheckpointCTAs() {
  const navigate = useNavigate();
  const assessmentId = useSelector((state) => state.checkpoints.activeAssessment.id); // Get assessmentId from Redux state
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);
  const risks = activeCheckpointAnswer ? activeCheckpointAnswer.form_data?.risks || [] : [];

  const handleViewReport = () => {
    navigate(`/assessment/${assessmentId}/report`);
  };

  return (
    <div className="checkpoint-ctas">
      <div className="view-report-cta view-risks-cta">
        <div className="cta-inner">
          <div className="cta-title">Identified Risks</div>
          <div className="cta-content">
            {risks.length > 0 ? (
              risks.map((risk, index) => (
                <div key={index} className="risk-item">
                  <p><strong>{risk.risk}</strong></p>
                  <p className="risk-classification">Likelihood:
                    <div className={`checkpoint-risk-level button ${risk.likelihood === 'High' ? 'red' : risk.likelihood === 'Medium' ? 'amber' : 'green'}`}>
                      {risk.likelihood}
                    </div>
                  </p>
                  <p className="risk-classification">Impact:
                    <div className={`checkpoint-risk-level button ${risk.impact === 'High' ? 'red' : risk.impact === 'Medium' ? 'amber' : 'green'}`}>
                      {risk.impact}
                    </div>
                  </p>
                </div>
              ))
            ) : (
              <p>No risks identified.</p>
            )}
             {activeCheckpointAnswer && <OpenMitigateRisk title="Add Risks" />}
          </div>
        </div>
      </div>
      <div className="viewReport">
        <button className="view-report-cta" onClick={handleViewReport}>
          <div className="cta-inner">
            <div className="cta-title">View your report</div>
            <div className="cta-content">
              <div className="cta-image"></div>
              <div className="cta-text">
                <div className="text">View your report in many formats so you can easily reuse it.</div>
                <div className="buttons-container">
                  <button className="button button-white">View Report</button>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}