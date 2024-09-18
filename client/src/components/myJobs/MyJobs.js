import React, { Component } from 'react';
import OpenJobsCard from '../card/OpenJobsCard.js';
import PendingJobsCard from '../card/PendingJobsCard.js';
import './MyJobs.scss';

export default class MyJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openJobs: JSON.parse(sessionStorage.getItem('myJobs')).openJobs || [],
      pendingJobs: JSON.parse(sessionStorage.getItem('myJobs')).pendingJobs || [],
    };
  }

  render() {
    const { openJobs, pendingJobs } = this.state;
    return (
      <div className="myJobs">
        <div className='openJobs'>
          <h2>My open jobs</h2>
          {openJobs.map((item, index) => (
            <div className="slide" key={index}>
              <OpenJobsCard item={item} />
            </div>
          ))}
        </div>
        <div className='pendingJobs'>
          <h2>My pending jobs</h2>
          {pendingJobs.map((item, index) => (
            <div className="slide" key={index}>
              <PendingJobsCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}