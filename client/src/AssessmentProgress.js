import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { updateActiveCheckpointIndex } from './checkpointsSlice';
import AssessmentProgressItem from './AssessmentProgressItem';

export default function AssessmentProgress() {
  const checkpoints = useSelector((state) => state.checkpoints.checkpoints);
  const activeCheckpointIndex = useSelector((state) => state.checkpoints.activeCheckpointIndex);
  const checkpointAnswers = useSelector((state) => state.checkpoints.checkpointAnswers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const handleMetadataClick = () => {
    dispatch(updateActiveCheckpointIndex(0)); // Set metadata as active checkpoint (index 0)
    navigate(`/assessment/${id}/metadata`); // Navigate to the metadata capture form with id
  };

  const handleCheckpointClick = (checkpointId) => {
    dispatch(updateActiveCheckpointIndex(checkpointId)); // Set the clicked checkpoint as active
    navigate(`/assessment/${id}/checkpoint/${checkpointId}`);
  };

  const isActive = (index) => {
    if (location.pathname.endsWith('/metadata') && index === 0) {
      return true;
    }
    return activeCheckpointIndex === index;
  };

  return (
    <div className="checkpoint-progress">
      <div className="checkpoint-progress-title">Risk Assessment</div>
      <div className="checkpoint-progress-item-wrapper">
        <div
          className="checkpoint-progress-item"
          onClick={handleMetadataClick}
        >
          <div className={`checkpoint metadata ${isActive(0) ? 'active' : ''}`}>
            Metadata
          </div>
        </div>
      </div>
      {checkpoints.map((checkpoint, i) => {
        return (
          <div
            className={`checkpoint-progress-item-wrapper ${isActive(checkpoint.id) ? 'active' : ''}`}
            key={i}
            onClick={() => handleCheckpointClick(checkpoint.id)}
          >
            <AssessmentProgressItem
              active={isActive(checkpoint.id)}
              index={i}
              id={checkpoint.id}
              category={checkpoint.category}
              includeCategory={i !== 0 && checkpoints[i - 1].category === checkpoint.category}
              answer={checkpointAnswers.find(answer => answer.id === checkpoint.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
