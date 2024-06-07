import React, { useState } from 'react';
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import {
    updateAssessmentStatus,
    updateAssessmentData,
} from "./checkpointsSlice";


export default function DataCapture() {
  const { activeAssessment } = useSelector((state) => state.checkpoints)
  const dispatch = useDispatch();

  const form_state = 1;

  const form_data = {
    dataset_name: {
      value: "",
      required: true
    },
    dataset_id: {
      value: "",
      required: true
    },
    purpose: {
      value: "",
      required: true
    },
    data_location: {
      value: "",
      required: true
    },
    sharing_reason: {
      value: "",
      required: true
    },
    sharing_reason_details: {
      value: "",
      required: true
    },
    person_role: {
      value: "",
      required: false
    },
    person_name: {
      value: "",
      required: false
    },
    date: {
      value: "",
      required: false
    }
  }

  const form_errors = {};
  const saved_form_data = activeAssessment.data_capture;


  for (const key in form_data) {
    if (typeof(saved_form_data[key]) !== "undefined") {
      form_data[key].value = saved_form_data[key].value;
    }
  }


  const [formData, setFormData] = useState(form_data);
  const [formErrors, setFormErrors] = useState(form_errors);
  const [formState, setFormState] = useState(1);


  const handleChange= (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.value : target.value;
    const name = target.name;

    let new_form_data = {...formData};
    let form_el = form_data[name];

    form_el.value = value;
    new_form_data[name] = form_el


    dispatch(updateAssessmentData(new_form_data));

    setFormData(new_form_data);
  }


  const handleSubmit = e => {
    e.preventDefault();
    const errors = {};
    for (const key in form_data) {

      if (formData[key] && formData[key].value.length < 1 && formData[key].required){
        errors[key] = true;
      }
    }
    setFormErrors(errors);

    if (errors && Object.keys(errors).length === 0 && Object.getPrototypeOf(errors) === Object.prototype){
      setFormState(2)
    }

  };

  if (formState == 1){
    return (
      <div className="template template-data-capture">
      <div className="container">
      <button
        className="back-button"
        onClick={() => dispatch(updateAssessmentStatus("started"))}
      >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6953 18L3.00558 9.72422L11.2814 1.03449" stroke="white" strokeWidth="3"/>
      </svg>
      Back to checkpoints
      </button>
      <div class="form-title">About the Data (required)</div>
        <form className="form">
          <fieldset className="form-column">
            <div className={("form-element form-element-text ") + (formErrors["dataset_name"] ? "error" : " ")}>
              <label>Name of the dataset</label>
              <input type="text" name="dataset_name" value={formData["dataset_name"].value} onChange={(e) => handleChange(e)} required/>
              <div className="error">{formErrors["dataset_name"] ? "This field is required" : " "}</div>
            </div>
            <div className={("form-element form-element-text ") + (formErrors["dataset_name"] ? "error" : " ")}>
              <label>Unique data ID</label>
              <input type="text" name="dataset_id" value={formData["dataset_id"].value} onChange={(e) => handleChange(e)} required/>
              <div className="error">{formErrors["dataset_id"] ? "This field is required" : " "}</div>

            </div>
            <div className={("form-element form-element-text ") + (formErrors["purpose"] ? "error" : " ")}>
              <label>Original purpose for the collection of data</label>
              <input type="text" name="purpose" value={formData["purpose"].value}  onChange={(e) => handleChange(e)} required/>
              <div className="error">{formErrors["purpose"] ? "This field is required" : " "}</div>

            </div>
            <div className={("form-element form-element-text ") + (formErrors["data_location"] ? "error" : " ")}>
              <label>Location of dataset</label>
              <input type="text" name="data_location" value={formData["data_location"].value} onChange={(e) => handleChange(e)} required/>
              <div className="error">{formErrors["data_location"] ? "This field is required" : " "}</div>

            </div>
          </fieldset>
          <fieldset className="form-column">
            <legend>Why are you sharing the data</legend>
            <div className={("radios ") + (formErrors["sharing_reason"] ? "error" : " ")}>
              <div className="form-element form-element-checkbox">
                <input id="opt1" type="radio" name="sharing_reason" value="1" checked={formData["sharing_reason"].value === "1"} onChange={(e) => handleChange(e)}/>
                <label for="opt1">Encourage Innovation</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt2" type="radio" name="sharing_reason" value="2" checked={formData["sharing_reason"].value === "2"}  onChange={(e) => handleChange(e)}/>
                <label for="opt2">Optimise supply chains</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt3" type="radio" name="sharing_reason" value="3" checked={formData["sharing_reason"].value === "3"}  onChange={(e) => handleChange(e)}/>
                <label for="opt3">Address common challenges across a sector</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt4" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"}  onChange={(e) => handleChange(e)}/>
                <label for="opt4">Improve market reach</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt5" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"}  onChange={(e) => handleChange(e)}/>
                <label for="opt5">Benchmarking and insights</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt6" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"}  onChange={(e) => handleChange(e)}/>
                <label for="opt6">To comply with regulation or legislation (e.g. freedom of information)</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt7" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"}  onChange={(e) => handleChange(e)}/>
                <label for="opt7">Demonstrate trustworthiness</label>
              </div>
              <div className="form-element form-element-checkbox">
                <input id="opt8" type="radio" name="sharing_reason" value="4" checked={formData["sharing_reason"].value === "4"}  onChange={(e) => handleChange(e)}/>
                <label for="opt8">Other</label>
              </div>
              <div className="error">{formErrors["sharing_reason"] ? "This field is required" : " "}</div>

            </div>
            <div className={("form-element form-element-text ") + (formErrors["sharing_reason_details"] ? "error" : " ")}>
              <label>Please provide more detail</label>
              <textarea name="sharing_reason_details" value={formData["sharing_reason_details"].value}  onChange={(e) => handleChange(e)}></textarea>
              <div className="error">{formErrors["sharing_reason_details"] ? "This field is required" : " "}</div>

            </div>
          </fieldset>




        <button
          type="submit"
          className="button button-white"
          onClick={(e) => handleSubmit(e)}
        >Next
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
        </svg>

        </button>
        </form>

      </div>




      </div>
    )
  } else {
    return (
      <div className="template template-data-capture">
      <div className="container">
      <div class="form-title">About the person completing the assessment (optional)</div>

      <button
        className="back-button"
        onClick={() => setFormState(1)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6953 18L3.00558 9.72422L11.2814 1.03449" stroke="white" strokeWidth="3"/>
        </svg>
        Previous
      </button>

      <fieldset className="form-column">
        <div className="form-element form-element-text">
          <label>Role</label>
          <input type="text" name="person_role" value={formData["person_role"].value}  onChange={(e) => handleChange(e)}/>
        </div>
        <div className="form-element form-element-text">
          <label>Name</label>
          <input type="text" name="person_name" value={formData["person_name"].value}  onChange={(e) => handleChange(e)}/>
        </div>
        <div className="form-element form-element-text">
          <label>Date</label>
          <input type="text" name="date" value={formData["date"].value}  onChange={(e) => handleChange(e)}/>
        </div>
      </fieldset>

      <button
        className="button button-white"
        onClick={() =>
          dispatch(updateAssessmentStatus("complete")
        )}
      >Complete your data sharing risk assessment
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.30469 1.51733L16.9944 9.79311L8.71865 18.4828" stroke="#2254F4" strokeWidth="3"/>
      </svg>

      </button>
      </div>
      </div>
    );
  }


}
