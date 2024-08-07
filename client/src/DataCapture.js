import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAssessmentData } from "./checkpointsSlice";
import metadata from './json/metadata.json'; // Import the JSON data directly

export default function DataCapture() {
  const { activeAssessment } = useSelector((state) => state.checkpoints);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Initialize form data state
  const initialFormData = Object.keys(metadata.schema).reduce((acc, key) => {
    acc[key] = { value: '', required: metadata.schema[key].required };
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Set form data from active assessment
  useEffect(() => {
    if (activeAssessment && activeAssessment.data_capture) {
      const updatedFormData = { ...initialFormData };
      for (const key in activeAssessment.data_capture) {
        if (updatedFormData[key]) {
          updatedFormData[key].value = activeAssessment.data_capture[key].value;
        }
      }
      setFormData(updatedFormData);
    }
  }, [activeAssessment]);

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, [name]: { ...prevFormData[name], value } };
      if (name === "sharing_reason" && value === "Other") { // "Other" option is selected
        newFormData["sharing_reason_details"].required = true;
      } else if (name === "sharing_reason") {
        newFormData["sharing_reason_details"].required = false;
      }
      return newFormData;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = {};
    for (const key in formData) {
      if (formData[key] && formData[key].required && !formData[key].value) {
        errors[key] = true;
      }
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      dispatch(updateAssessmentData(formData));
      navigate(`/assessment/${id}/checkpoint/1`);
    }
  };

  const renderField = (key, field) => {
    switch (field.type) {
      case 'text':
        return (
          <div className={`form-element form-element-text ${formErrors[key] ? 'error' : ''}`} key={key}>
            <label>{field.label}</label>
            <input type="text" name={key} value={formData[key].value} onChange={handleChange} required={field.required} />
            <div className="error">{formErrors[key] ? "This field is required" : ""}</div>
          </div>
        );
      case 'textarea':
        return (
          <div className={`form-element form-element-text ${formErrors[key] ? 'error' : ''}`} key={key}>
            <label>{field.label}</label>
            <textarea name={key} value={formData[key].value} onChange={handleChange} required={field.required}></textarea>
            <div className="error">{formErrors[key] ? "This field is required" : ""}</div>
          </div>
        );
      case 'radio':
        return (
          <div className={`radios ${formErrors[key] ? 'error' : ''}`} key={key}>
            <legend>{field.label}</legend>
            {field.options.map(option => (
              <div className="form-element-checkbox" key={option}>
                <input id={`opt${option}`} type="radio" name={key} value={option} checked={formData[key].value === option} onChange={handleChange} />
                <label htmlFor={`opt${option}`}>{option}</label>
              </div>
            ))}
            <div className="error">{formErrors[key] ? "This field is required" : ""}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkpoint-question">
      <div className="form-title">About the Data</div>
      <form className="form" onSubmit={handleSubmit}>
        {metadata.form.map((fieldset, index) => (
          <fieldset key={index} className="form-column">
            {fieldset.items.map(field => renderField(field, metadata.schema[field]))}
          </fieldset>
        ))}
        <button
          type="submit"
          className="button button-white"
        >
          Next
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3" />
          </svg>
        </button>
      </form>
    </div>
  );
}