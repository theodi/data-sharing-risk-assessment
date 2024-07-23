import React from 'react';


export default function DefaultModal(props) {
  const {content} = props.data;

  return (
    <div className="modal-content">
      <div className="modal-title">{content.title}</div>

      <div className="modal-text te" dangerouslySetInnerHTML={{ __html: content.text }}></div>
    </div>
  );
};
