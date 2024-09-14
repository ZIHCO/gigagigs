import React, { Component } from 'react';
import './Profile.scss';

export default class Profile extends Component {
  constructor(props){
    super(props);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.state = {
      error: null,
      success: false,
      loading: false,
      currentUser: currentUser,
      updateProfile: false,
      firstName: currentUser.profile.name ? currentUser.profile.name.split(' ')[1] : '',
      skills: currentUser.profile.skills ? currentUser.profile.skills.join(', ') : '',
      headline: currentUser.profile.headline,
      lastName: currentUser.profile.name ? currentUser.profile.name.split(' ')[0] : '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleEditProfile() {
    const { updateProfile, currentUser } = this.state;
    this.setState({ updateProfile: !updateProfile });
    this.setState({
      firstName: currentUser.profile.name ? currentUser.profile.name.split(' ')[1] : '',
      lastName: currentUser.profile.name ? currentUser.profile.name.split(' ')[0] : '',
      headline: currentUser.profile.headline,
      skills: !currentUser.profile.skills ? '' : currentUser.profile.skills.join(', '),
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });

    const {
      firstName, lastName, headline, currentUser 
    } = this.state;

    const skillString = this.state.skills;
    const skills = skillString.split(', ');

    try {
      const response = await fetch(
        `http://192.168.169.6:5000/user/${currentUser.username}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: firstName + ' ' + lastName,
            skills,
            headline,
          })
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      const result = await response.json();
      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));
      sessionStorage.setItem('currentUser', JSON.stringify(result));

      this.setState({
        success: true,
        updateProfile: false,
        loading: false
      });
    } catch(error) {
      this.setState({
        error: error.message, updateProfile: false, loading: false
      });
    }
  }

  render() {
    const {
      currentUser, updateProfile, firstName, lastName,
      loading, skills, headline, success
    } = this.state;

    if (success) {
      window.location.href = '/dashboard';
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
          <div className="editButton">
            <button onClick={this.handleEditProfile}>
              <img src="../images/textEdit.png" alt="Edit profile" />
            </button>
          </div>
        </div>
        {updateProfile && <div className='updateInfo'>
          <h3>Update your bio</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="formGroup">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={this.handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}          
                onChange={this.handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="skills">Skills<i>{'(enter your skills, separated by \', \')'}</i></label>
              <textarea
                id="skills"
                name="skills"
                rows={6}
                value={skills}          
                onChange={this.handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="headline">Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={headline}          
                onChange={this.handleChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating bio...' : 'Update bio'}
            </button>
          </form>
        </div>}
      </div>
    );
  }
}