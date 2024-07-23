import React from 'react';
import { useDispatch } from 'react-redux'

import {
    updateActiveCheckpointIndex,
} from "./checkpointsSlice";

export default function AssessmentProgressItem(props) {
  const categoryClass = props.category.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
  const categoryLabel = props.includeCategory ? "" : <div className={"progress-label " + (categoryClass)}>{props.category}</div>;
  const hasAnswer = typeof(props.answer) != "undefined" ;
  const riskLevel = hasAnswer ? props.answer.option.risk_level : "";
  const dispatch = useDispatch()
  return (

    <div className="checkpoint-progress-item" key={props.id}>
      {categoryLabel}
      <div
        className={riskLevel + " " + (props.active ? "checkpoint active" : "checkpoint")}
        onClick={() => {
          // if (hasAnswer){
            dispatch(updateActiveCheckpointIndex(props.id))}

        }
      >
        {props.index+1}
      </div>
    </div>
  );
};
