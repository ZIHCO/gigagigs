import React, { Component } from 'react';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import MyJobs from '../../components/myJobs/MyJobs.js';
import './Jobs.scss';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';

/**
 * Jobs page
 */
class Jobs extends Component{
  constructor(props) {
    super(props);
    this.state = {
      currentUsersJobs: JSON.parse(sessionStorage.getItem("myJobs"))
    }
  }

  render() {
    const {currentUsersJobs} = this.state;

    return (
      <div className="jobs">
        <div className="containerOne">
          <div className="pfp">
            <Pfp />
          </div>
          <div className="profile">
            <Profile disabledEditButton={true}/>
          </div>
          <div className='jobStats'>
            <span>Total open jobs: {currentUsersJobs.openJobs.length}</span>
            <span>Total pending jobs: {currentUsersJobs.pendingJobs.length}</span>
          </div>
        </div>
        <div className='containerTwo'>
          <div className="myJobs">
            <MyJobs />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);