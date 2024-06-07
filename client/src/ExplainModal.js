import React from 'react';
import MitigateForm from './MitigateForm';


export default function ExplainModal(props) {
  const {data} = props;
  const {content, checkpoint, checkpointAnswer, totalCheckpoints, activeCheckpointIndex} = data;
  return (
    <div className="modal-content explain">
    <div className="modal-top">
      <div className="modal-top-inner">
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
    <div className="modal-left">


      <div className="">
        <div className="modal-subtitle">{content.title}</div>
        <div className="te" dangerouslySetInnerHTML={{__html: content.text}} />
      </div>

    </div>

    <div className="modal-right">
      <MitigateForm fields={content.form}/>
    </div>



    </div>
  );
};
