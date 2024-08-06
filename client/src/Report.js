import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DownloadReportButton from './DownloadReportButton';
import { updateActiveCheckpointIndex, updateActiveCheckpoint } from './checkpointsSlice';
import metadata from './json/metadata.json';

export default function Report() {
  useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeAssessment, checkpoints } = useSelector((state) => state.checkpoints);
  const form_data = activeAssessment.data_capture || {};
  const sharingReasonOptions = metadata.schema.sharing_reason.options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

  return (
    <>
      <div className="template template-data-capture">
        <div className="container">
          <div className="report">
            <div className="modal-title">Report</div>
            <div className="assessment-data">
              {form_data.dataset_name ? <DataListItem value={form_data.dataset_name.value} label="Name of Data Set" /> : ""}
              {form_data.dataset_description ? <DataListItem value={form_data.dataset_description.value} label="Description" /> : ""}
              {form_data.sharing_reason ? <DataListItem value={sharingReasonOptions[form_data.sharing_reason.value]} label="Reason for Sharing" /> : ""}
              {form_data.sharing_reason_details && form_data.sharing_reason.value === "8" ? <DataListItem value={form_data.sharing_reason_details.value} label="More Details" /> : ""}
            </div>
            {activeAssessment.answers.length ? <AnswersList answers={activeAssessment.answers} /> : ""}
          </div>
        </div>
      </div>
      <DownloadReportButton assessmentId={activeAssessment.id} />
    </>
  );

  function AnswersList(props) {
    const answers = [];
    props.answers.forEach((a) => {
      const checkpoint = checkpoints.find(c => (c.id === a.id));
      const risks = (a.option.explain_risk && a.form_data) ? a.form_data.risks : [];
      answers.push(<AnswerListItem key={a.id} id={a.id} risk_level={a.option.risk_level} explain_risk={a.option.explain_risk} risks={risks} option={a.option.option} title={checkpoint.title} />);
    });
    return (
      <div className="checkpoint-answers">{answers}</div>
    )
  }

  function AnswerListItem(props) {
    const { id, risk_level, risks, option, title } = props;

    const handleNavigation = () => {
      dispatch(updateActiveCheckpointIndex(id));
      dispatch(updateActiveCheckpoint(id));
      navigate(`/assessment/${activeAssessment.id}/checkpoint/${id}`);
    };

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
          {risks.length ?
            <div>
              <div className="checkpoint-answer-mitigate-label">Identified Risks and Mitigations</div>
              <div className="checkpoint-answer-mitigate-value">
                {risks.map((risk, index) => (
                  <div key={index} className="risk-item">
                    <p><strong>Risk:</strong> {risk.risk}</p>
                    <p className="risk-classification">
                      <strong>Likelihood:</strong>
                      <div className={`checkpoint-risk-level button ${risk.likelihood === 'high' ? 'red' : risk.likelihood === 'medium' ? 'amber' : 'green'}`}>
                        {risk.likelihood}
                      </div>
                    </p>
                    <p className="risk-classification">
                      <strong>Impact:</strong>
                      <div className={`checkpoint-risk-level button ${risk.impact === 'high' ? 'red' : risk.impact === 'medium' ? 'amber' : 'green'}`}>
                        {risk.impact}
                      </div>
                    </p>
                    <p className="risk-classification">
                      <strong>Action Type:</strong>
                      <div className="checkpoint-risk-level button button-blue">{risk.actionType}</div>
                    </p>
                    <p><strong>Mitigating Actions:</strong> {risk.mitigatingActions}</p>
                  </div>
                ))}
              </div>
            </div>
            : ""}
        </div>
      </div>
    )
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