import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps }from '../../redux/actions.js';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import './JobListing.scss';

/**
 * Job Listing
 */
class JobListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      minBudget: null,
      maxBudget: null,
      skills: '',
      error: '',
      success: false,
      loading: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });

    const {
      title, description, minBudget, maxBudget,
    } = this.state;

    const skillString = this.state.skills;
    const skillStringToLowercase = skillString.toLowerCase();
    const skills = skillStringToLowercase.split(', ');
    const budget = `${minBudget} - ${maxBudget}`;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs/create-job`,
        {
          method: 'POST',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            skills,
            description,
            budget
          })
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      //const result = await response.json();
      this.setState({error: 'here now'});

      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));

      this.setState({
        success: true,
        loading: false
      });
    } catch(error) {
      this.setState({
        error: error.message, loading: false
      });
    }
  }

  render() {
    const {
      title, maxBudget, minBudget, description, loading,
      skills, success, error
    } = this.state;

    if (success) {
      window.location.href = '/dashboard';
      return ;
    }
    
    return (
      <div className='jobListing'>
        {error && <span>{error}</span>}
        {success && <span>{success}</span>}
        <div className="containerOne">
          <div className="pfp">
            <Pfp />
          </div>
          <div className="profile">
            <Profile disabledEditButton={true} />
          </div>
        </div>
        <div className='containerTwo'>
          <h2>Create a new job</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="formGroup">
              <label htmlFor="title">Titlee</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={this.handleChange}
                required
              />
            </div>
            <div>
              <i>{'NB: enter the skills needed for this job, separated by \', \''}</i>
              <div className="formGroup">
                <label htmlFor="skills">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={skills}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="formGroup">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={description}          
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='budget'>
              <div className="numberGroup">
                <label htmlFor="minBudget">Min budget $</label>
                <input
                  type="number"
                  id="minBudget"
                  name="minBudget"
                  value={minBudget}          
                  onChange={this.handleChange}
                  min={10}
                  required
                />
              </div>
              <div className="numberGroup">
                <label htmlFor="maxBudget">Max budget $</label>
                <input
                  type="number"
                  id="maxBudget"
                  name="maxBudget"
                  value={maxBudget}          
                  onChange={this.handleChange}
                  min={11}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating this job...' : 'Create job'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobListing);