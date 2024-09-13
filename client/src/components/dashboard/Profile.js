import React, { Component } from 'react';
import './Profile.scss';

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: JSON.parse(sessionStorage.getItem('currentUser'))
    };
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
    const topSkills = currentUser.profile.skills
      .slice(0, 3)
      .join(', ');

    return (
      <div className="profile">
        <div className="info">
          <span><i className="name">{currentUser.profile.name}</i></span>
          <span><i className="headline">{currentUser.profile.headline}</i></span>
          <span><i>Joined on: </i>{createdAt}</span>
          <span><i>Top skills: </i>{!topSkills ? 'Add your top skills' : topSkills}</span>
        </div>
        <div className="editButton">
          <button>
            <img src="../images/textEdit.png" alt="Edit profile" />
          </button>
        </div>
      </div>
    );
  }
}