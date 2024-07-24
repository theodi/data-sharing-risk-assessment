import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSharedUser, removeSharedUser } from './checkpointsSlice';

export default function ShareOverlay({ assessmentId, onClose }) {
  const dispatch = useDispatch();
  const { assessmentsList, loading, error } = useSelector((state) => state.checkpoints);
  const [email, setEmail] = useState('');

  const activeAssessment = assessmentsList.find(assessment => assessment._id === assessmentId);
  const sharedUsers = activeAssessment ? activeAssessment.sharedWith : [];

  const handleAddShare = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(addSharedUser({ assessmentId, email }));
      setEmail('');
    }
  };

  const handleRemoveShare = (userEmail) => {
    dispatch(removeSharedUser({ assessmentId, email: userEmail }));
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <span className="close-btn" onClick={onClose}>&times;</span>

        {loading && <div className="error loading-message">Please wait...</div>}
        {error && <div className="error error-message">{error}</div>}

        <div className="share-section">
          <h2>New share</h2>
          <form className="form-element-text" onSubmit={handleAddShare}>
            <label htmlFor="email">Please enter the email you wish to share this assessment with</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input inputText"
              required
            />
            <button className="button button-white" type="submit">Share</button>
          </form>
        </div>
        <div className="share-section">
          <h2>Current shares</h2>
          <table className="display" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sharedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.user}</td>
                  <td>
                    <button onClick={() => handleRemoveShare(user.user)} className="deleteBtn">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}