import React, { Component } from 'react';
import './Alternative.scss';

export default class Alternative extends Component {
  render() {
    const { message } = this.props;
    return (
      <div className='alternative'>
        <div className='container'>
          <span>{message}</span>
        </div>
      </div>
    );
  }
}