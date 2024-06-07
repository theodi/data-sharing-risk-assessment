import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import SaveAndContinue from './SaveAndContinue';
import SaveAndContinueDisabled from './SaveAndContinueDisabled';


import {
    updateCheckpointAnswers,
} from "./checkpointsSlice";


export default function MitigateForm(props) {
  const dispatch = useDispatch();
  const activeCheckpointAnswer = useSelector((state) => state.checkpoints.activeCheckpointAnswer);

  const { fields } = props;

  const form_data = {};

  fields.forEach((field, i) => {
    const field_name = field.name;
    let val = "";
    if (typeof(activeCheckpointAnswer.form_data) !== "undefined" && typeof(activeCheckpointAnswer.form_data[field_name]) !== "undefined") {
      val = activeCheckpointAnswer.form_data[field_name];
    }

    form_data[field_name] = val;
  });

  const [formData, setformData] = useState(form_data);




  const handleChange = (name, value) => {

    const new_form_data = {...formData};

    new_form_data[name] = value;

    const answer = {...activeCheckpointAnswer};
    answer.form_data = new_form_data;
    dispatch(updateCheckpointAnswers(answer))
    setformData(new_form_data)

  }

  return (

    <div>

      {fields.map((field, i) => {
        return (
            <div
              key={i}
              className="form-element"
            >
              <label>{field.label}</label>
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              ></textarea>
            </div>

        );
      })}

      {
        (
          !activeCheckpointAnswer.option.explain_risk
          ||
          typeof(activeCheckpointAnswer.form_data) !== "undefined"  && activeCheckpointAnswer.form_data.mitigating_actions.length
        ) ? <SaveAndContinue /> : <SaveAndContinueDisabled />
      }

    </div>
  );




}
