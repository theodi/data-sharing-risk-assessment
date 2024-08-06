import React from 'react';
import MitigateForm from './MitigateForm';
import riskForm from './json/riskForm.json';


export default function ExplainModal(props) {
  const {data} = props;
  const {content, checkpoint, checkpointAnswer, totalCheckpoints, activeCheckpointIndex} = data;
  return (
    <div className="modal-content explain">
    <div className="modal-question">
      <div className="modal-question-inner">
      <div className="checkpoint-question" >
      <div className="checkpoint-top">
        <div className="checkpoint-number"><span>Checkpoint {activeCheckpointIndex }</span> <span> of {totalCheckpoints}</span></div>
      </div>
        <div className="question">
          <h1 className="question-title">{checkpoint.title}</h1>
          <div className="options-label">Your answer</div>
          <div className={"button button-white option " + (checkpointAnswer.option.risk_level) + " active" }>{checkpointAnswer.option.option}</div>
        </div>


      </div>
      </div>

    </div>
    <div className="modal-risks">


      <div className="">
        <div className="modal-subtitle">{content.exampleRisks.title}</div>
        <div className="te" dangerouslySetInnerHTML={{__html: content.exampleRisks.text}} />
      </div>

    </div>

    <div className="modal-actions">


      <div className="">
        <div className="modal-subtitle">{content.exampleActions.title}</div>
        <div className="te" dangerouslySetInnerHTML={{__html: content.exampleActions.text}} />
      </div>

    </div>

    <div className="modal-riskRegister">
      <MitigateForm fields={riskForm.form}/>
    </div>



    </div>
  );
};
