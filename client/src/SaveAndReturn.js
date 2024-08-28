import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useModal } from './context/modal-context'

import {
    updateActiveCheckpointIndex,
    updateAssessmentStatus
} from "./checkpointsSlice";
export default function SaveAndReturn(props) {
  const activeCheckpointIndex = useSelector((state) => state.checkpoints.activeCheckpointIndex);
  const totalCheckpoints = useSelector((state) => state.checkpoints.totalCheckpoints);
  const dispatch = useDispatch()
  const { setModal } = useModal()

  if (activeCheckpointIndex === totalCheckpoints){
    return (
      <button
        className="button button-white"
        onClick={() => dispatch(updateAssessmentStatus("data"))}
      >
        Complete this assessment
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
        </svg>
      </button>
    );
  } else {
    return (
      <button
        className="button button-white"
        onClick={() => {
          setModal();
          dispatch(updateActiveCheckpointIndex(activeCheckpointIndex))
        }}
        >
        Save
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
        </svg>

      </button>
    );
  }

}
