import React, { Component } from 'react';
import './Profile.scss';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';

class Profile extends Component {
  constructor(props){
    super(props);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.state = {
      currentUser: currentUser,
      updateProfile: false,
      loadingMyJobs: false,
      myJobs: false,
      loadingMyProposals: false,
      myProposals: false,
      error: null
    };
    this.fetchMyJobs = this.fetchMyJobs.bind(this);
    this.fetchMyProposals = this.fetchMyProposals.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  async fetchMyJobs() {
    this.setState({
      loadingMyJobs: true, error: null, myJobs: false
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs/my-jobs`,
        {
          method: 'GET',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
            'Content-Type': 'application/json',

          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      const result = await response.json();
      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));
      sessionStorage.setItem('myJobs', JSON.stringify(result));

      this.setState({
        myJobs: true, loadingMyJobs: false,
      });
    } catch (err) {
      this.setState({
        error: err.message, loadingMyJobs: false,
      });
    }
  }

  async fetchMyProposals() {
    this.setState({
      loading: true, error: null, success: false
    });

    const { username, password } = this.state;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      const result = await response.json();
      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));
      sessionStorage.setItem('currentUser', JSON.stringify(result.currentUser));
      sessionStorage.setItem('recommendedJobs', JSON.stringify(result.recommendedJobs));

      this.setState({
        success: true, loading: false,
        username: '', password: '',
      });
    } catch (err) {
      this.setState({
        error: err.message, loading: false,
        username: '', password: '',
      });
    }
  }

  handleEditProfile() {
    const { updateProfile } = this.state;
    this.setState({ updateProfile: !updateProfile });
    updateProfile ? this.props.closeUpdateProfile() : this.props.updateProfile();
  }

  render() {
    const { currentUser, loadingMyJobs, myJobs } = this.state;
    const { disabledEditButton } = this.props;

    if (myJobs) {
      window.location.href = '/jobs/my-jobs';
      return ;
    }

    const createdAt = new Date(currentUser.createdAt).toLocaleDateString(
      'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
    const topSkills = !currentUser.profile.skills ? [] : (currentUser.profile.skills
      .slice(0, 3)
      .join(', '));

    return (
      <div className="profile">
        <div className='infoContainer'>
          <div className="info">
            <span><i className="name">{currentUser.profile.name}</i></span>
            <span><i className="headline">{currentUser.profile.headline}</i></span>
            <span><i>Joined on: </i>{createdAt}</span>
            <span><i>Top skills: </i>{!topSkills ? 'Add your top skills' : topSkills}</span>
          </div>
          {!disabledEditButton && <div className="editButton">
            <button onClick={this.handleEditProfile}>
              <img src="../images/textEdit.png" alt="Edit profile" />
            </button>
          </div>}
          <div className='navButtons'>
            <button onClick={this.fetchMyJobs}>
              {loadingMyJobs ? <span>Loading my jobs...</span> : <span>My jobs</span>}
            </button>
            <button onClick={this.fetchMyProposals}>
              <span>My proposals</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);