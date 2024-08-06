import React from 'react';
import { useSelector } from 'react-redux'
import SaveAndContinue from './SaveAndContinue';

import OpenMitigateRisk from './OpenMitigateRisk';

export default function CheckpointActions() {
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);

  if ( !activeCheckpointAnswer || activeCheckpointAnswer.length === 0) return <div className="loading"></div>;;
  // const checkpointAnswers = useSelector((state) => state.checkpoints.checkpointAnswers);

  return (
    <div className="checkpoint-actions">
      <OpenMitigateRisk />
      <SaveAndContinue />
    </div>
  );
};