import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Route, Routes } from 'react-router-dom';

import AssessmentProgress from './AssessmentProgress';
import Checkpoint from './Checkpoint';
import DataCapture from './DataCapture';
import Report from './Report';
import AssessmentComplete from './AssessmentComplete';
import CheckpointCTAs from './CheckpointCTAs';

import {
  getCheckpoints,
  getAssessmentsList,
  resumeAssessmentThunk,
  updateActiveCheckpointIndex,
} from "./checkpointsSlice";

export default function Assessment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, checkpointId } = useParams();

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
        if (checkpointId) {
          dispatch(updateActiveCheckpointIndex(parseInt(checkpointId)));
        } else {
          dispatch(updateActiveCheckpointIndex(0));
        }
      }).catch((error) => {
        console.error('Failed to load assessment:', error);
        navigate('/error', { state: { message: 'Assessment not found' } });
      });
    }
  }, [id, checkpointId, activeAssessment.id, assessmentsList, dispatch, navigate]);

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
  }

  return (
    <div className="template template-healthcheck">
      <div className="template-inner">
        <Routes>
          <Route path="metadata" element={
            <>
              <AssessmentProgress />
              <DataCapture />
            </>
          } />
          <Route path="report" element={
            <>
              <AssessmentProgress />
              <Report />
            </>
          } />
          <Route path="checkpoint/:checkpointId" element={
            <>
              <AssessmentProgress />
              <Checkpoint />
              <CheckpointCTAs />
            </>
          } />
          <Route path="*" element={
            <>
              <AssessmentProgress />
              <Checkpoint />
              <CheckpointCTAs />
            </>
          } />
        </Routes>
      </div>
    </div>
  );
}
