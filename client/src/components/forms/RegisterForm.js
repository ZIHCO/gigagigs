import React, { Component } from 'react';
import './AuthForm.scss';

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      message: null,
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
      loading: true, error: null, success: false, message: null
    });

    const { username, email, password } = this.state;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email
          }),
        }
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      const result = await response.json();
      this.setState({
        message: result.message, success: true, loading: false,
        username: '', password: '', email: ''
      });
    } catch (err) {
      this.setState({
        error: err.message, loading: false,
        username: '', password: '', email: ''
      });
    }
  }

  render() {
    const {
      username, password, email, loading, success, message, error
    } = this.state;

    return (
      <div className="authForm">
        {success && <div className="flash success"><span>{message}</span></div>}
        {error && <div className="flash failed"><span>{error}</span></div>}
        <h2>Register</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    );
  }
}