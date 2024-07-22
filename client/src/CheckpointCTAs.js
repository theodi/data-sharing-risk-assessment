import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useModal } from './context/modal-context'
import axios from 'axios';

import Cta from "./components/Cta";

export default function CheckpointCTAs() {
  const activeCheckpoint = useSelector((state) => state.checkpoints.activeCheckpoint);
  const { setModal } = useModal()

  // if ( !activeCheckpoint || activeCheckpoint.length === 0) return <p></p>;

  return (
    <>
    <div className="checkpoint-ctas" >
      <button className="view-report-cta" onClick={() => {
          axios.get('/json/report.json').then(res => {
            const modalData = {
              type: "report",
              content: res.data[0]
            };
            setModal(modalData);
          });
        }}
      >
      <div className="cta-inner">
        <div className="cta-title">View your report</div>
        <div className="cta-content">

          <div className="cta-text">You can review your report at anytime. However, the more checkpoints you tackle, the more useful the report will be.</div>

        </div>

        <div className="button button-white">
          Read the report
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="10.1424" y1="0.431885" x2="10.1425" y2="19.5679" stroke="#2254F4" strokeWidth="2.2849"/>
          <line x1="0.429688" y1="9.85706" x2="19.5657" y2="9.85706" stroke="#2254F4" strokeWidth="2.2849"/>
          </svg>

        </div>
        </div>
      </button>
    </div>


    </>
  );
};
