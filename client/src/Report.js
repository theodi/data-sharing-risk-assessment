import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DownloadReportButton from './DownloadReportButton';
import TopRisksSidebar from './TopRisksSidebar';
import RiskClassificationChart from './RiskClassificationChart';
import { updateActiveCheckpointIndex, updateActiveCheckpoint } from './checkpointsSlice';

export default function Report() {
  useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeAssessment, checkpoints } = useSelector((state) => state.checkpoints);
  const form_data = activeAssessment.data_capture || {};

  if (!activeAssessment || !checkpoints.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="report checkpoint-question">
        <div className="modal-title">Report</div>
        <div className="assessment-data">
          {form_data.dataset_name ? <DataListItem value={form_data.dataset_name.value} label="Name of Data Set" /> : ""}
          {form_data.dataset_description ? <DataListItem value={form_data.dataset_description.value} label="Description" /> : ""}
          {form_data.sharing_reason ? (
            <>
              <DataListItem
                value={
                  form_data.sharing_reason.value === "Other"
                    ? form_data.sharing_reason_details.value
                    : form_data.sharing_reason.value
                }
                label="Reason for Sharing"
              />
              {form_data.sharing_reason.value !== "Other" && form_data.sharing_reason_details && (
                <DataListItem value={form_data.sharing_reason_details.value} label="More Details" />
              )}
            </>
          ) : (
            ""
          )}
        </div>
        {activeAssessment.answers.length ? <AnswersList answers={activeAssessment.answers} /> : ""}
      </div>
      <div className="checkpoint-ctas">
        <RiskClassificationChart />
        <TopRisksSidebar />
        <DownloadReportButton assessmentId={activeAssessment.id} />
      </div>
    </>
  );

  function AnswersList(props) {
    const answers = [];
    props.answers.forEach((a) => {
      const checkpoint = checkpoints.find(c => (c.id === a.id));
      if (!checkpoint) {
        console.error(`Checkpoint with id ${a.id} not found`);
        return;
      }
      const risks = (a.option.explain_risk && a.form_data) ? a.form_data.risks : [];
      const considerations = a.considerations || []; // Get considerations from the answer
      answers.push(
        <AnswerListItem
          key={a.id}
          id={a.id}
          risk_level={a.option.risk_level}
          explain_risk={a.option.explain_risk}
          risks={risks}
          option={a.option.option}
          title={checkpoint.title}
          considerations={considerations} // Pass considerations as a prop
        />
      );
    });
    return (
      <div className="checkpoint-answers">{answers}</div>
    )
  }

  function AnswerListItem(props) {
    const { id, risk_level, risks, option, title, considerations } = props;

    const handleNavigation = () => {
      dispatch(updateActiveCheckpointIndex(id));
      dispatch(updateActiveCheckpoint(id));
      navigate(`/assessment/${activeAssessment.id}/checkpoint/${id}`);
    };

    const checkpoint = checkpoints.find(c => c.id === id);

    return (
      <div className="checkpoint-answer">
        <div className="checkpoint-answer-inner">
          <div className="checkpoint-answer-id" onClick={handleNavigation} style={{ cursor: 'pointer' }}>
            Checkpoint {id}
          </div>
          <div className="checkpoint-answer-title">{title}</div>
          <div className="checkpoint-answer-option">
            <div className="checkpoint-answer-option-label">Your Answer</div>
            <div className={`checkpoint-answer-option-value button button-white ${risk_level}`}>{option}</div>
          </div>

          {/* Render considerations for the report */}
          {checkpoint.considerations && considerations.length > 0 && (
            <div className="checkpoint-considerations">
              <div className="considerations-title">Considerations checklist</div>
              <ul className="considerations-list">
                {considerations.map((consideration, index) => (
                  <li key={index} className="consideration-item">
                    <input
                      type="checkbox"
                      disabled
                      checked={consideration.answer} // Check the stored answer state (true/false)
                    />
                    <span className="checkmark"></span>
                    <label>{consideration.text}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {risks.length ? (
            <div>
              <div className="checkpoint-answer-mitigate-label">Identified Risks and Mitigations</div>
              <div className="checkpoint-answer-mitigate-value">
                {risks.map((risk, index) => (
                  <div key={index} className="risk-item">
                    <p><strong>Risk:</strong> {risk.risk}</p>
                    <div className="risk-classification">
                      <strong>Likelihood:</strong>
                      <div className={`checkpoint-risk-level button ${risk.likelihood === 'High' ? 'red' : risk.likelihood === 'Medium' ? 'amber' : 'green'}`}>
                        {risk.likelihood}
                      </div>
                    </div>
                    <div className="risk-classification">
                      <strong>Impact:</strong>
                      <div className={`checkpoint-risk-level button ${risk.impact === 'High' ? 'red' : risk.impact === 'Medium' ? 'amber' : 'green'}`}>
                        {risk.impact}
                      </div>
                    </div>
                    <div className="risk-classification">
                      <strong>Action Type:</strong>
                      <div className="checkpoint-risk-level button button-blue">{risk.actionType}</div>
                    </div>
                    <p><strong>Mitigating Actions:</strong> {risk.mitigatingActions}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : ""}
        </div>
      </div>
    );
  }


  function DataListItem(props) {
    const { label, value } = props;
    return (
      <div className="assessments-data-item">
        <span className="assessments-data-item-label">{label}</span>
        <span className="assessments-data-item-value">{value}</span>
      </div>
    )
  }
}