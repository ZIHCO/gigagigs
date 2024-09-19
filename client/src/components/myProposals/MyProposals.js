import React, { Component } from 'react';
import PendingProposalsCard from '../card/PendingProposalsCard.js';
//import ApprovedProposalsCard from '../card/ApprovedProposalsCard.js';
import './MyProposals.scss';

export default class MyProposals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //approvedProposals: JSON.parse(sessionStorage.getItem('myProposals')).approvedProposals || [],
      pendingProposals: JSON.parse(sessionStorage.getItem('myProposals')).pendingProposals || [],
    };
  }

  render() {
    const { pendingProposals } = this.state;
    return (
      <div className="myProposals">
        {/*<div className='approvedProposals'>
          <h2>My approved proposals</h2>
          {approvedProposals.map((item, index) => (
            <div className="slide" key={index}>
              <ApprovedProposalsCard item={item} />
            </div>
          ))}
        </div>*/}
        <div className='pendingProposals'>
          <h2>My pending proposals</h2>
          {pendingProposals.map((item, index) => (
            <div className="slide" key={index}>
              <PendingProposalsCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}