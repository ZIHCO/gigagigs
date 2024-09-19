import React, { Component } from 'react';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import MyProposals from '../../components/myProposals/MyProposals.js';
import './Proposals.scss';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';

/**
 * Proposals page
 */
class Proposals extends Component{
  constructor(props) {
    super(props);
    this.state = {
      currentUsersProposals: JSON.parse(sessionStorage.getItem("myProposals"))
    }
  }

  render() {
    const {currentUsersProposals} = this.state;

    return (
      <div className="proposals">
        <div className="containerOne">
          <div className="pfp">
            <Pfp />
          </div>
          <div className="profile">
            <Profile disabledEditButton={true}/>
          </div>
          <div className='proposalStats'>
            <span>Total pending proposals: {currentUsersProposals.pendingProposals.length}</span>
            <span>Total approved jobs: {currentUsersProposals.approvedProposals.length}</span>
          </div>
        </div>
        <div className='containerTwo'>
          <div className="myJobs">
            <MyProposals />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Proposals);