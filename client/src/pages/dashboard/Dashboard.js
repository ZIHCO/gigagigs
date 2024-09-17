import React, { Component } from 'react';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import Jobs from '../../components/dashboard/Jobs.js';
import UpdateProfile from '../../components/dashboard/UpdateProfile.js';
import './Dashboard.scss';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';

/**
 * Dashboard component
 */
class Dashboard extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const {editProfile} = this.props;
    return (
      <div className="dashboard">
        <div className="containerOne">
          <div className="pfp">
            <Pfp />
          </div>
          <div className="profile">
            <Profile />
          </div>
        </div>
        <div className='containerTwo'>
          {editProfile && <div className='editProfile'>
            <UpdateProfile />
          </div>}
          <div className="jobs">
            <Jobs />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);