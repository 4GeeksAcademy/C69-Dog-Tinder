import React, { useState } from 'react';
import "../../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); 
    setError(null);  // Reset error on new login attempt   

    // Use the environment variable for the backend API URL
    const backendUrl = 'https://upgraded-dollop-g4pvpv79v7vcv64g-3001.app.github.dev'; // Default to port 3001 if no env var

    fetch(`${backendUrl}/login`, { // Corrected template literal
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);  // Stop loading once response is received
      if (data.success) {
        // Handle successful login, for example by redirecting or saving token
        console.log("Login successful");
      } else {
        setError(data.message || 'Login failed');  // Display error from response if available
      }
    })
    .catch(error => {
      setLoading(false);
      setError('An error occurred. Please try again.');  // Display error
      console.error('Error:', error);
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
            disabled={loading}  // Disable input while loading
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
            disabled={loading}  // Disable input while loading
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}  {/* Display error if exists */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
