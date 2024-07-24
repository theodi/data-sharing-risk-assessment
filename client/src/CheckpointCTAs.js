import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CheckpointCTAs() {
  const navigate = useNavigate();
  const assessmentId = useSelector((state) => state.checkpoints.activeAssessment.id); // Get assessmentId from Redux state

  const handleViewReport = () => {
    navigate(`/assessment/${assessmentId}/report`);
  };

  return (
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
  );
}