import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCheckpointAnswers } from './checkpointsSlice';
import { debounce } from 'lodash';

export default function CheckpointConsiderations() {
  const activeCheckpoint = useSelector((state) => state.checkpoints.activeCheckpoint);
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);
  const dispatch = useDispatch();

  // Initialize local state based on activeCheckpoint considerations or fallback to empty
  const initialConsiderations = activeCheckpoint?.considerations?.items.map((item) => ({
    text: item,
    answer: false,
  })) || [];

  const [localConsiderations, setLocalConsiderations] = useState(activeCheckpointAnswer?.considerations || initialConsiderations);

  const debouncedDispatch = useCallback(
    debounce((updatedConsiderations) => {
      const answer = {
        ...activeCheckpointAnswer,
        considerations: updatedConsiderations,
      };
      dispatch(updateCheckpointAnswers(answer));
    }, 1000),
    [dispatch, activeCheckpointAnswer]
  );

  // Remove the effect that updates the local state when the activeCheckpointAnswer changes
  // This ensures that the UI updates immediately without waiting for state sync
  // If you still need to reset localConsiderations when a new checkpoint is loaded, consider a different approach to avoid the delay

  if (!activeCheckpoint || !activeCheckpoint.considerations) return null;
  if (!activeCheckpointAnswer || !activeCheckpointAnswer.option) return null;

  const handleCheckboxChange = (index) => {
    // Update local state immediately for UI update
    const updatedConsiderations = localConsiderations.map((consideration, i) => (
      i === index ? { ...consideration, answer: !consideration.answer } : consideration
    ));

    setLocalConsiderations(updatedConsiderations);

    // Dispatch the updated answer with debounced function
    debouncedDispatch(updatedConsiderations);
  };

  return (
    <div className="considerations">
      <div className="title">{activeCheckpoint.considerations.title}</div>
      <ul>
        {localConsiderations.map((consideration, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={consideration.answer}
                onChange={() => handleCheckboxChange(index)}
              />
              <span className="checkmark"></span>
              {consideration.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}