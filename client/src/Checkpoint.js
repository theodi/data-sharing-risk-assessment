import React from 'react';
import { useSelector } from 'react-redux'
import CheckpointOptions from './CheckpointOptions';
import CheckpointConsiderations from './CheckpointConsiderations';
import CheckpointActions from './CheckpointActions';
import CheckpointExtra from './CheckpointExtra';
import CheckpointInfo from './CheckpointInfo';

export default function Checkpoint() {
  const {activeCheckpoint, activeCheckpointIndex, totalCheckpoints} = useSelector((state) => state.checkpoints);

  if ( !activeCheckpoint || activeCheckpoint.length === 0) return <div className="loading"></div>;
  return (

    <div className="checkpoint-question" >
      <div className="checkpoint-top">
        <div className="checkpoint-category">{activeCheckpoint.category}</div>
        <div className="checkpoint-number"><span><label className="label">Checkpoint&nbsp;</label>{activeCheckpointIndex }</span> <span> of {totalCheckpoints}</span></div>
      </div>
      <div className="question">
        <h1 className="question-title">{activeCheckpoint.title}</h1>

        {activeCheckpoint.extra_text.length ? <CheckpointExtra checkpoint={activeCheckpoint}/> : ""}


        <div className="options-label">Select One Answer</div>
      </div>

      <CheckpointOptions  />

      <CheckpointConsiderations />

      <CheckpointInfo  />

      <CheckpointActions />

    </div>
  );
};
