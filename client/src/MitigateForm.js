import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import SaveAndReturn from './SaveAndReturn';
import { updateCheckpointAnswers } from './checkpointsSlice';

export default function MitigateForm(props) {
  const dispatch = useDispatch();
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);
  const { fields } = props;

  const initialFormData = activeCheckpointAnswer.form_data?.risks || [{}];

  const [formData, setFormData] = useState(initialFormData);

  const debouncedDispatch = useCallback(
    debounce((answer) => {
      dispatch(updateCheckpointAnswers(answer));
    }, 1000),
    []
  );

  const handleChange = (index, name, value) => {
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);

    const answer = { ...activeCheckpointAnswer, form_data: { ...activeCheckpointAnswer.form_data, risks: newFormData } };
    debouncedDispatch(answer);
  };

  const handleAddRisk = () => {
    setFormData([...formData, {}]);
  };

  const handleRemoveRisk = (index) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);

    const answer = { ...activeCheckpointAnswer, form_data: { ...activeCheckpointAnswer.form_data, risks: newFormData } };
    debouncedDispatch(answer);
  };

  useEffect(() => {
    return () => {
      debouncedDispatch.cancel();
    };
  }, [debouncedDispatch]);

  return (
    <div>
      <h1>Risks</h1>
      {formData.map((risk, index) => (
        <div key={index} className="risk-form">
          {fields.map((field, i) => {
            if (field.type === 'text') {
              return (
                <div key={i} className="form-element">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={risk[field.name] || ''}
                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                  />
                </div>
              );
            } else if (field.type === 'select') {
              return (
                <div key={i} className="form-element inline">
                  <label>{field.label}</label>
                  <select
                    name={field.name}
                    value={risk[field.name] || ''}
                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    {field.options.map((option, j) => (
                      <option key={j} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              );
            } else if (field.type === 'textarea') {
              return (
                <div key={i} className="form-element">
                  <label>{field.label}</label>
                  <textarea
                    name={field.name}
                    value={risk[field.name] || ''}
                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                  ></textarea>
                </div>
              );
            }
            return null;
          })}
          <button type="button" className="button button-white button-risk-remove" onClick={() => handleRemoveRisk(index)}>
            Remove Risk
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0.429688" y1="9.85706" x2="19.5657" y2="9.85706" stroke="#2254F4" strokeWidth="2.2849"/>
            </svg>
          </button>
        </div>
      ))}
      <button type="button" className="button button-white button-risk-add" onClick={handleAddRisk}>
        Add Risk
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="10.1424" y1="0.431885" x2="10.1425" y2="19.5679" stroke="#2254F4" strokeWidth="2.2849"/>
          <line x1="0.429688" y1="9.85706" x2="19.5657" y2="9.85706" stroke="#2254F4" strokeWidth="2.2849"/>
        </svg>
      </button>
      <div className="save-actions">
        <SaveAndReturn />
      </div>
    </div>
  );
}