import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function Report() {
  useParams();
  const { activeAssessment, checkpoints } = useSelector((state) => state.checkpoints);
  const form_data = activeAssessment.data_capture || {};

  // Mapping for sharing_reason options
  const sharingReasonOptions = {
    1: "Encourage Innovation",
    2: "Optimise supply chains",
    3: "Address common challenges across a sector",
    4: "Improve market reach",
    5: "Benchmarking and insights",
    6: "To comply with regulation or legislation (e.g. freedom of information)",
    7: "Demonstrate trustworthiness",
    8: "Other"
  };

  return (
    <div className="template template-data-capture">
      <div className="container">
        <div className="report">
          <div className="modal-title">Report</div>
          <div className="assessment-data">
            {(typeof form_data.dataset_name !== "undefined") ? <DataListItem value={form_data.dataset_name.value} label="Name of Data Set" /> : ""}
            {(typeof form_data.dataset_description !== "undefined") ? <DataListItem value={form_data.dataset_description.value} label="Description" /> : ""}
            {(typeof form_data.sharing_reason !== "undefined") ? <DataListItem value={sharingReasonOptions[form_data.sharing_reason.value]} label="Reason for Sharing" /> : ""}
            {(typeof form_data.sharing_reason_details !== "undefined" && form_data.sharing_reason.value === "8") ? <DataListItem value={form_data.sharing_reason_details.value} label="More Details" /> : ""}
          </div>
          {activeAssessment.answers.length ? <AnswersList answers={activeAssessment.answers} /> : ""}
        </div>
      </div>
    </div>
  );

  function AnswersList(props) {
    const answers = [];
    props.answers.forEach((a) => {
      const checkpoint = checkpoints.find(c => (c.id === a.id));
      const mitigating_actions = (a.option.explain_risk && typeof (a.form_data) !== "undefined") ? a.form_data.mitigating_actions : "";
      answers.push(<AnswerListItem key={a.id} id={a.id} risk_level={a.option.risk_level} explain_risk={a.option.explain_risk} mitigating_actions={mitigating_actions} option={a.option.option} title={checkpoint.title} />);
    });
    return (
      <div className="checkpoint-answers">{answers}</div>
    )
  }

  function AnswerListItem(props) {
    const { id, risk_level, mitigating_actions, option, title } = props;
    return (
      <div className="checkpoint-answer">
        <div className="checkpoint-answer-inner">
          <div className="checkpoint-answer-id">Checkpoint {id}</div>
          <div className="checkpoint-answer-title">{title}</div>
          <div className="checkpoint-answer-option">
            <div className="checkpoint-answer-option-label">Your Answer</div>
            <div className={"checkpoint-answer-option-value button button-white " + (risk_level)}>{option}</div>
          </div>
          {mitigating_actions.length ?
            <div>
              <div className="checkpoint-answer-mitigate-label">How you are mitigating this risk?</div>
              <div className="checkpoint-answer-mitigate-value te"><p>{mitigating_actions}</p></div>
            </div>
            : ""
          }
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