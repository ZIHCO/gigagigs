import React, { Component } from 'react';
import LoginForm from '../../components/forms/LoginForm.js';
import RegisterForm from '../../components/forms/RegisterForm.js';
import './AuthPage.scss';

export default class Register extends Component {
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="registerSide">
            <RegisterForm />
          </div>
          <div className="loginSide">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }
}