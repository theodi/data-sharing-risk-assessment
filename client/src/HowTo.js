// Privacy.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HowTo = () => {
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    axios.get('../json/how-to-use-tool.json').then(res => {
      setModalData({
        type: 'default',
        content: res.data[0]
      });
    }).catch(err => {
      console.error('Error fetching privacy policy:', err);
    });
  }, []);

  return (
    <div className="template template-singlePage">
      <div className="container">
        <div className="template-inner">
          <h1 className="template-title">How to use this tool</h1>
          <div className="content">
            {modalData ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: modalData.content.text }} />
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
