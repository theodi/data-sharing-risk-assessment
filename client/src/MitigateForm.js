import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import SaveAndContinue from './SaveAndContinue';
import SaveAndContinueDisabled from './SaveAndContinueDisabled';

import { updateCheckpointAnswers } from './checkpointsSlice';

export default function MitigateForm(props) {
  const dispatch = useDispatch();
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);
  const { fields } = props;

  const form_data = {};

  fields.forEach((field, i) => {
    const field_name = field.name;
    let val = '';
    if (typeof activeCheckpointAnswer.form_data !== 'undefined' && typeof activeCheckpointAnswer.form_data[field_name] !== 'undefined') {
      val = activeCheckpointAnswer.form_data[field_name];
    }
    form_data[field_name] = val;
  });

  const [formData, setFormData] = useState(form_data);

  // Function to dispatch the updateCheckpointAnswers action
  const debouncedDispatch = useCallback(
    debounce((answer) => {
      dispatch(updateCheckpointAnswers(answer));
    }, 1000), // Adjust the debounce delay as needed (1000ms = 1 second)
    []
  );

  const handleChange = (name, value) => {
    const new_form_data = { ...formData };
    new_form_data[name] = value;

    const answer = { ...activeCheckpointAnswer };
    answer.form_data = new_form_data;

    // Update local state immediately
    setFormData(new_form_data);

    // Dispatch the debounced action
    debouncedDispatch(answer);
  };

  useEffect(() => {
    // Cleanup function to cancel any pending debounced actions when the component unmounts
    return () => {
      debouncedDispatch.cancel();
    };
  }, [debouncedDispatch]);

  return (
    <div>
      {fields.map((field, i) => (
        <div key={i} className="form-element">
          <label>{field.label}</label>
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          ></textarea>
        </div>
      ))}
      {(!activeCheckpointAnswer.option.explain_risk ||
        (typeof activeCheckpointAnswer.form_data !== 'undefined' &&
          activeCheckpointAnswer.form_data.mitigating_actions.length)) ? (
        <SaveAndContinue />
      ) : (
        <SaveAndContinueDisabled />
      )}
    </div>
  );
}