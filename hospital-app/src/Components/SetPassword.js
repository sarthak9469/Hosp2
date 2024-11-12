import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/set-password', { token, password });
      setSuccess(response.data.message);
      alert(response.data.message);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Set Your Password</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default SetPassword;
