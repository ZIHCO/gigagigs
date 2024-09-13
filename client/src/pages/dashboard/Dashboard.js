import React, { Component } from 'react';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import './Dashboard.scss';

/**
 * Dashboard component
 */
export default class Dashboard extends Component{
  render() {
    return (
      <div className="dashboard">
        <div className="profileContainer">
          <div className="pfp">
            <Pfp />
          </div>
          <div className="profile">
            <Profile />
          </div>
        </div>
        {/*<div className="recommendation">
          <Recommendation />
        </div>*/}
      </div>
    );
  }
}