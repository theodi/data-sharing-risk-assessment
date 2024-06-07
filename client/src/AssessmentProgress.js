import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import AssessmentProgressItem from './AssessmentProgressItem';

export default function AssessmentProgress() {
  const checkpoints = useSelector((state) => state.checkpoints.checkpoints);
  const activeCheckpointIndex = useSelector((state) => state.checkpoints.activeCheckpointIndex);
  const checkpointAnswers = useSelector((state) => state.checkpoints.checkpointAnswers);

  return (

    <div className="checkpoint-progress">

    <div className="checkpoint-progress-title">Risk Checkpoint</div>


      {checkpoints.map((checkpoint, i) => {

        return (
          <div className="checkpoint-progress-item-wrapper" key={i}>
            <AssessmentProgressItem
              active={activeCheckpointIndex === checkpoint.id}
              index={i}
              id={checkpoint.id}
              category={checkpoint.category}
              includeCategory={i != 0 && checkpoints[i - 1].category === checkpoint.category}
              answer={checkpointAnswers.find(answer => answer.id === checkpoint.id)}

            />
          </div>
        );
      })}
    </div>
  );
};
