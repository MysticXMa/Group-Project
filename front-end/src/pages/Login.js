import React from 'react';
import '../styles/login.css';

function Login() {
  return (
    <div className="login-container">
      <h2 style={{ color: '#8FB83B', textAlign: 'left' }}>Kirjaudu sisään</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Käyttäjätunnus:</label>
          <input className="input-field" type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Salasana:</label>
          <input className="input-field" type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="login-button">Kirjaudu</button>
      </form>
    </div>
  );
}

export default Login;
