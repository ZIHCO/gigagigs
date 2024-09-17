import React, { Component } from 'react';
import './AuthForm.scss';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      success: false,
      error: null,
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true, error: null, success: false
    });

    const { username, password } = this.state;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      const result = await response.json();
      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));
      sessionStorage.setItem('currentUser', JSON.stringify(result.currentUser));
      sessionStorage.setItem('recommendedJobs', JSON.stringify(result.recommendedJobs));

      this.setState({
        success: true, loading: false,
        username: '', password: '',
      });
    } catch (err) {
      this.setState({
        error: err.message, loading: false,
        username: '', password: '',
      });
    }
  }

  render() {
    const {
      username, password, loading, success, error
    } = this.state;

    if (success) {
      window.location.href = '/dashboard';
    }
    return (
      <div className="authForm">
        {error && <div className="flash failed"><span>{error}</span></div>}
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              minLength={6}             
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }
}