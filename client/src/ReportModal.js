import React from 'react';
import { useEffect } from "react";
import { useSelector } from 'react-redux'


export default function ReportModal(props) {
  const {data} = props;
  const { activeAssessment, checkpoints } = useSelector((state) => state.checkpoints);
  let form_data = activeAssessment.data_capture || {};

  return (
    <div className="modal-content report">
      <div className="modal-title">{data.content.title}</div>
      <div className="modal-text te" dangerouslySetInnerHTML={{ __html: data.content.text }}></div>

      <div className="assessment-data">
      {(typeof(form_data.dataset_name) !== "undefined") ?  <DataListItem value={form_data.dataset_name.value} label="Name of Data Set" /> : ""}
      {(typeof(form_data.dataset_id) !== "undefined") ?  <DataListItem value={form_data.dataset_name.value} label="Unique Data ID" /> : ""}
      {(typeof(form_data.purpose) !== "undefined") ?  <DataListItem value={form_data.purpose.value} label="Original Purpose" /> : ""}
      {(typeof(form_data.dataset_location) !== "undefined") ?  <DataListItem value={form_data.dataset_location.value} label="Location of Data" /> : ""}
      {(typeof(form_data.person_name) !== "undefined") ?  <DataListItem value={form_data.person_name.value} label="Completed by" /> : ""}
      {(typeof(form_data.person_role) !== "undefined") ?  <DataListItem value={form_data.person_role.value} label="Role" /> : ""}
      {(typeof(form_data.date) !== "undefined") ?  <DataListItem value={form_data.date.value} label="Date" /> : ""}

      </div>

      {
        (activeAssessment.answers.length ? <AnswersList answers={activeAssessment.answers}/> : "")
      }

    </div>
  );


  function AnswersList(props){
    const answers = [];
    props.answers.forEach((a)=>{
      const checkpoint = checkpoints.find(c => (c.id === a.id));
      const mitigating_actions = (a.option.explain_risk && typeof(a.form_data) !== "undefined") ? a.form_data.mitigating_actions : "";
      answers.push(<AnswerListItem id={a.id} risk_level={a.option.risk_level} explain_risk={a.option.explain_risk} mitigating_actions={mitigating_actions} option={a.option.option} title={checkpoint.title} />);
    })
    return (
      <div className="checkpoint-answers">{answers}</div>
    )
  }


  function AnswerListItem(props){
    const {id, risk_level, explain_risk, mitigating_actions, option, title} = props;
    return (
      <div className="chekpoint-answer">
        <div className="checkpoint-answer-inner">
          <div className="checkpoint-answer-id">Checkpoint {id}</div>

          <div className="checkpoint-answer-title">{title}</div>
          <div className="checkpoint-answer-option">
            <div className="checkpoint-answer-option-label">Your Answer</div>
            <div className={"checkpoint-answer-option-value button button-white " + (risk_level)}>{option}</div>
          </div>
          {
            (mitigating_actions.length) ?
          <div>
          <div className="checkpoint-answer-mitigate-label">How you are mitigating this risk?</div>
          <div className="checkpoint-answer-mitigate-value te"><p>{mitigating_actions}</p></div>
          </div>
          :
          ""
        }
        </div>
      </div>
    )
  }



  function DataListItem(props){
    const {label, value} = props;
    return (
      <div className="assessments-data-item">
        <span className="assessments-data-item-label">{label}</span>
        <span className="assessments-data-item-value">{value}</span>
      </div>
    )
  }
};
