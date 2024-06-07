import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    updateCheckpointAnswers,
} from "./checkpointsSlice";

export default function CheckpointOptions() {

  const activeCheckpoint = useSelector((state) => state.checkpoints.activeCheckpoint);
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);
  const totalCheckpoints = useSelector((state) => state.checkpoints.totalCheckpoints);
  const dispatch = useDispatch()
  const checkpointID = activeCheckpoint.id;
  let isActive = false;

  if ( !activeCheckpoint || activeCheckpoint.length === 0) return <div className="loading"></div>;

  const handleOptionClick = (option) => {
    try {
      const answer = {
        id: checkpointID,
        option
      };
      dispatch(updateCheckpointAnswers(answer));
    } catch (error) {
      console.error('Error updating checkpoint answers:', error);
    }
  };
  return (
    <div className="options">
      {activeCheckpoint.options.map((option, i) => {

        if (typeof(activeCheckpointAnswer) !== "undefined" && typeof(activeCheckpointAnswer.option) !== "undefined"){

          if (activeCheckpointAnswer.option.option === option.option) {
            isActive = true;
          } else {
            isActive = false;
          }
        }
        return (
          <div
            key={i}
            className={"button button-white option " + option.risk_level + " " + (isActive ? "active" : "")}
            onClick={() => handleOptionClick(option)}
          >
            {option.option}
          </div>
        );
      })}
    </div>
  );
};
