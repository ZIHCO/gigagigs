import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps }from '../../redux/actions.js';
import Pfp from '../../components/dashboard/Pfp.js';
import Profile from '../../components/dashboard/Profile.js';
import './MakeProposal.scss';


/**
 * make proposal
 */
class MakeProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobId: JSON.parse(sessionStorage.getItem('jobApplication'))._id,
      jobTitle: JSON.parse(sessionStorage.getItem('jobApplication')).title,
      coverLetter: '',
      price: 10,
      error: '',
      success: false,
      loading: false,
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
      price, coverLetter, jobId, jobTitle
    } = this.state;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/proposals/make-proposal`,
        {
          method: 'POST',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: jobTitle,
            coverLetter,
            price,
            jobId,
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
      sessionStorage.setItem('myProposals', JSON.stringify(result));

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
      jobTitle, price, loading,
      success, error, coverLetter
    } = this.state;

    if (success) {
      window.location.href = '/dashboard';
      return ;
    }
    
    return (
      <div className='makeProposal'>
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
          <h2>Apply for this job</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="formGroup title">
              <label htmlFor="title">Job title</label>
              <span>{jobTitle}</span>
            </div>
            <div className="formGroup">
              <label htmlFor="coverLetter">Cover letter</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                value={coverLetter}          
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='price'>
              <div className="numberGroup">
                <label htmlFor="price">Price $</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}          
                  onChange={this.handleChange}
                  min={10}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting this apply...' : 'Summit apply'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeProposal);