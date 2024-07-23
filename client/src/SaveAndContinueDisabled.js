import React from 'react';
import { useSelector } from 'react-redux'

export default function SaveAndContinueDisabled(props) {
  const activeCheckpointIndex = useSelector((state) => state.checkpoints.activeCheckpointIndex);
  const totalCheckpoints = useSelector((state) => state.checkpoints.totalCheckpoints);


  if (activeCheckpointIndex === totalCheckpoints){
    return (
      <div
        className="button button-white disabled"
      >
        Complete this assessment
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
        </svg>
      </div>
    );
  } else {
    return (
      <div
        className="button button-white disabled"
        >
        Save and Continue
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
        </svg>

      </div>
    );
  }

}
