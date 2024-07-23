import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
    updateAssessmentData
} from "./checkpointsSlice";

export default function DataCapture() {
  const { activeAssessment } = useSelector((state) => state.checkpoints);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const form_data = {
    dataset_name: {
      value: "",
      required: true
    },
    dataset_description: {
      value: "",
      required: false
    },
    sharing_reason: {
      value: "",
      required: true
    },
    sharing_reason_details: {
      value: "",
      required: false
    }
  };

  const saved_form_data = activeAssessment.data_capture || {};

  for (const key in form_data) {
    if (typeof(saved_form_data[key]) !== "undefined") {
      form_data[key].value = saved_form_data[key].value;
    }
  }

  const [formData, setFormData] = useState(form_data);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let new_form_data = { ...formData };
    new_form_data[name].value = value;

    if (name === "sharing_reason" && value === "8") { // "Other" option is selected
      new_form_data["sharing_reason_details"].required = true;
    } else if (name === "sharing_reason") {
      new_form_data["sharing_reason_details"].required = false;
    }

    setFormData(new_form_data);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = {};
    for (const key in form_data) {
      if (formData[key] && formData[key].value.length < 1 && formData[key].required){
        errors[key] = true;
      }
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      dispatch(updateAssessmentData(formData));
      navigate(`/assessment/${id}/checkpoint/1`);
    }
  };

  return (
    <div className="template template-data-capture">
      <div className="container">
        <div className="form-title">About the Data</div>
        <form className="form" onSubmit={handleSubmit}>
          <fieldset className="form-column">
            <div className={("form-element form-element-text ") + (formErrors["dataset_name"] ? "error" : " ")}>
              <label>Name/Identifier of the dataset</label>
              <input type="text" name="dataset_name" value={formData["dataset_name"].value} onChange={handleChange} required/>
              <div className="error">{formErrors["dataset_name"] ? "This field is required" : " "}</div>
            </div>
            <div className={("form-element form-element-text ") + (formErrors["dataset_description"] ? "error" : " ")}>
              <label>What is the data about?</label>
              <textarea name="dataset_description" value={formData["dataset_description"].value} onChange={handleChange}></textarea>
              <div className="error">{formErrors["dataset_description"] ? "This field is required" : " "}</div>
            </div>
          </fieldset>
          <fieldset className="form-column">
            <legend>Why are you sharing the data</legend>
            <div className={("radios ") + (formErrors["sharing_reason"] ? "error" : " ")}>
              <div className="form-element form-element-checkbox">
                <input id="opt1" type="radio" name="sharing_reason" value="1" checked={formData["sharing_reason"].value === "1"} onChange={handleChange}/>
                <label htmlFor="opt1">Encourage Innovation</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt2" type="radio" name="sharing_reason" value="2" checked={formData["sharing_reason"].value === "2"} onChange={handleChange}/>
                <label htmlFor="opt2">Optimise supply chains</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt3" type="radio" name="sharing_reason" value="3" checked={formData["sharing_reason"].value === "3"} onChange={handleChange}/>
                <label htmlFor="opt3">Address common challenges across a sector</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt4" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"} onChange={handleChange}/>
                <label htmlFor="opt4">Improve market reach</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt5" type="radio" name="sharing_reason" value="5" checked={formData["sharing_reason"].value === "5"} onChange={handleChange}/>
                <label htmlFor="opt5">Benchmarking and insights</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt6" type="radio" name="sharing_reason" value="6" checked={formData["sharing_reason"].value === "6"} onChange={handleChange}/>
                <label htmlFor="opt6">To comply with regulation or legislation (e.g. freedom of information)</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt7" type="radio" name="sharing_reason" value="7" checked={formData["sharing_reason"].value === "7"} onChange={handleChange}/>
                <label htmlFor="opt7">Demonstrate trustworthiness</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt8" type="radio" name="sharing_reason" value="8" checked={formData["sharing_reason"].value === "8"} onChange={handleChange}/>
                <label htmlFor="opt8">Other</label>
              </div>
              <div className="error">{formErrors["sharing_reason"] ? "This field is required" : " "}</div>
            </div>
            <div className={("form-element form-element-text ") + (formErrors["sharing_reason_details"] ? "error" : " ")}>
              <label>Please provide more detail</label>
              <textarea name="sharing_reason_details" value={formData["sharing_reason_details"].value} onChange={handleChange}></textarea>
              <div className="error">{formErrors["sharing_reason_details"] ? "This field is required" : " "}</div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="button button-white"
          >
            Next
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}