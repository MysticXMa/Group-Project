import React from 'react';
import '../App.css';
import '../styles/forms.css'

function UserCreation() {
  return (
    <div className="login-container">
      <h2 style={{ color: '#8FB83B', textAlign: 'left' }}>Luo käyttäjä</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Käyttäjätunnus:</label>
          <input class="input-field" type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Salasana:</label>
          <input class="input-field" type="password" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Rooli:</label>
          <input class="input-field" type="role" id="role" name="role" required />
        </div>
        <button type="submit" className="login-button">Luo Käyttäjä</button>
      </form>
    </div>
  );
}

export default UserCreation;