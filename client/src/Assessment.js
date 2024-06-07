import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import AssessmentProgress from './AssessmentProgress';
import Checkpoint from './Checkpoint';
import DataCapture from './DataCapture';
import AssessmentComplete from './AssessmentComplete';
import CheckpointCTAs from './CheckpointCTAs';

import {
  getCheckpoints,
  getAssessmentsList,
  resumeAssessmentThunk,
} from "./checkpointsSlice";

export default function Assessment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { checkpoints, activeCheckpoint, loading, activeAssessment, assessmentsList, assessments_loading } = useSelector((state) => state.checkpoints);
  const [assessmentLoaded, setAssessmentLoaded] = useState(false);

  useEffect(() => {
    dispatch(getCheckpoints());
    dispatch(getAssessmentsList());
  }, [dispatch]);

  useEffect(() => {
    if (id && assessmentsList.length > 0 && (!activeAssessment.id || activeAssessment.id !== id)) {
      dispatch(resumeAssessmentThunk(id)).unwrap().then(() => {
        setAssessmentLoaded(true);
      }).catch((error) => {
        console.error('Failed to load assessment:', error);
        navigate('/error', { state: { message: 'Assessment not found' } });
      });
    }
  }, [id, activeAssessment.id, assessmentsList, dispatch, navigate]);


  if (loading || assessments_loading || !assessmentLoaded) {
    return <div className="loading"></div>;
  }

  if (activeAssessment.status === "") {
    navigate('/assessments');
  }

  if (activeAssessment.status === "complete") {
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">
          <AssessmentComplete />
        </div>
      </div>
    );
  } else if (activeAssessment.status === "data") {
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">
          <DataCapture />
        </div>
      </div>
    );
  } else {
    return (
      <div className="template template-healthcheck">
        <div className="template-inner">
          <AssessmentProgress />
          <Checkpoint />
          <CheckpointCTAs />
        </div>
      </div>
    );
  }
}
