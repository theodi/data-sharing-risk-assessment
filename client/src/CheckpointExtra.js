import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    updateExtraInfoState,
      } from "./checkpointsSlice";

export default function CheckpointExtra(props) {
    const dispatch = useDispatch();

    const checkpoint = props.checkpoint;
    const extraInfoState = useSelector((state) => state.checkpoints.extraInfoState);
    return (
      <div className="question-extra">
      <button className={"button button-white  " + (extraInfoState ? "active" : "")} onClick={() => dispatch(updateExtraInfoState(!extraInfoState))}>
        Find out more
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line className="line1" x1="7.8612" y1="0.125" x2="7.8612" y2="15.125" stroke="#2254F4" strokeWidth="2.2849"/>
        <line y1="7.26575" x2="15" y2="7.26575" stroke="#2254F4" strokeWidth="2.2849"/>
        </svg>
      </button>


      <div className={"question-extra-text te " + (extraInfoState ? "active" : "")}><p>{checkpoint.extra_text}</p></div>
      </div>
    )

}
