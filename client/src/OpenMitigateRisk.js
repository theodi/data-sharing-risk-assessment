import React from 'react';
import { useSelector } from 'react-redux'
import { useModal } from './context/modal-context'

export default function OpenMitigateRisk({title = "Identify risks and plan mitigations"}) {
  const { setModal } = useModal()
  const {activeCheckpointAnswer, activeCheckpoint, totalCheckpoints, activeCheckpointIndex} = useSelector((state) => state.checkpoints);

  if (activeCheckpointAnswer.option.risk_level === "amber" || activeCheckpointAnswer.option.risk_level === "red" ){
    return (
      <button
        className="button button-explain"
        onClick={() => {

        const modalData = {
          type: "explain",
          content: activeCheckpoint.explain[0],
          checkpoint: activeCheckpoint,
          checkpointAnswer: activeCheckpointAnswer,
          totalCheckpoints: totalCheckpoints,
          activeCheckpointIndex: activeCheckpointIndex
        };
        setModal(modalData);
        }}
      >
        {title}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="10.1424" y1="0.431885" x2="10.1425" y2="19.5679" stroke="white" strokeWidth="2.2849"/>
          <line x1="0.429688" y1="9.85706" x2="19.5657" y2="9.85706" stroke="white" strokeWidth="2.2849"/>
        </svg>

      </button>
    );
  } else {
    return "";
  }

}
