// src/DownloadReportButton.js

import React from 'react';
import axiosInstance from './axiosInstance';

export default function DownloadReportButton({ assessmentId }) {
  const handleDownloadReport = async (format) => {
    try {
      const contentType = format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : format === 'csv'
          ? 'text/csv'
          : 'application/json';

      if (format === 'docx') {
        setTimeout(() => {
          alert("DOCX will download soon after you close this message.\n\nOnce the document has downloaded, you will need to update the table of contents to correct page numbering and titles.");
        }, 100); // Small delay to ensure the request is initiated before showing the alert
      }

      const response = await axiosInstance.get(`/assessments/${assessmentId}/report`, {
        headers: {
          Accept: contentType
        },
        responseType: 'blob' // Important for downloading files
      });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assessment_report_${assessmentId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error downloading the ${format} report:`, error);
    }
  };

  return (
      <button className="view-report-cta">
        <div className="cta-inner">
          <div className="cta-title">Download your report</div>
          <div className="cta-content">
            <div className="cta-image"></div>
            <div className="cta-text">
              <div className="text">Download your report in many formats so you can easily reuse it.</div>
              <div className="buttons-container">
                <div className="button button-white" onClick={() => handleDownloadReport('json')}>Download JSON</div>
                <div className="button button-white" onClick={() => handleDownloadReport('csv')}>Download CSV</div>
                <div className="button button-white" onClick={() => handleDownloadReport('docx')}>Download DOCX</div>
              </div>
            </div>
          </div>
        </div>
      </button>
  );
}