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
    };
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  handleEditProfile() {
    const { updateProfile } = this.state;
    this.setState({ updateProfile: !updateProfile });
    updateProfile ? this.props.closeUpdateProfile() : this.props.updateProfile();
  }

  render() {
    const { currentUser } = this.state;

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
          <div className="editButton">
            <button onClick={this.handleEditProfile}>
              <img src="../images/textEdit.png" alt="Edit profile" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);