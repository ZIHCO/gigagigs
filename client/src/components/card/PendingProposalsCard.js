import React, { Component } from 'react';
//import './PendingProposalsCard.scss';

export default class PendingProposalsCard extends Component {
  render() {
    const { _id, coverLetter, title, price, status } = this.props.item;
    return (
      <div className="pendingJobsCard" id={_id}>
        <div className='title'><span><i>Title: </i>{title}</span></div>
        <div className='details'>
          <p><i>Cover letter : </i>{coverLetter}</p>
          <p><i>Price: </i>${price}</p>
          <p><i>Status: </i>{status}</p>
        </div>
        <div className='apply'>
          <button>Delete this proposal</button>
        </div>
      </div>
    );
  }
}