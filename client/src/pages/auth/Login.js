import React, { Component } from 'react';
import LoginForm from '../../components/forms/LoginForm.js';
import RegisterForm from '../../components/forms/RegisterForm.js';
import './AuthPage.scss';

export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="loginSide">
            <LoginForm />
          </div>
          <div className="registerSide">
            <RegisterForm />
          </div>
        </div>
      </div>
    );
  }
}