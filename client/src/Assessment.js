import React from 'react'
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import AssessmentProgress from './AssessmentProgress';
import Checkpoint from './Checkpoint';
import DataCapture from './DataCapture';
import AssessmentComplete from './AssessmentComplete';
import CheckpointCTAs from './CheckpointCTAs';

import {
    getCheckpoints,
    getAssessmentsList,
    updateActiveCheckpointIndex,
    updateActiveCheckpoint,
    startAssessment,

      } from "./checkpointsSlice";


export default function Assessment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { checkpoints, activeCheckpoint, loading, activeAssessment, assessmentsList } = useSelector((state) => state.checkpoints)



  useEffect(() => {
    dispatch(getCheckpoints())
  }, [])

  if (activeAssessment.status === ""){
    navigate('/assessments')
  }

  if (loading) return <div className="loading"></div>;

  if (activeAssessment.status === "complete"){
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">
        <AssessmentComplete />
        </div>
      </div>
    )

  } else if (activeAssessment.status === "data") {
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">


        <DataCapture />


        </div>
      </div>
    )
  } else {
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">
        <AssessmentProgress />
        <Checkpoint />
        <CheckpointCTAs />

        </div>
      </div>
    )
  }

}
