import React, { Component } from 'react';
import './OpenJobsCard.scss';

export default class OpenJobsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDelete: false,
      deleted: false,
      error: null
    };
    this.handleJobDelete = this.handleJobDelete.bind(this);
  }

  async handleJobDelete() {
    const { _id } = this.props.item;
    this.setState({ loadingDelete: true, deleted: false, error: null});
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs/${_id}/delete`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
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

      this.setState({ loadingDelete: false, deleted: true, });
    } catch (err) {
      this.setState({
        error: err.message, loadingDelete: false,
      });
    }
  }

  render() {
    const { _id, description, title, budget, skills, status } = this.props.item;
    const { loadingDelete, deleted, error } = this.state;

    if (deleted) {
      window.location.href = '/jobs/my-jobs';
      return ;
    }

    return (
      <div className="openJobsCard" id={_id}>
        <div className='title'><span><i>Title: </i>{title}</span></div>
        <div className='details'>
          <p><i>Desc: </i>{description}</p>
          <p><i>Budget: </i>${budget}</p>
          <p><i>Skills: </i>{skills.join(', ')}</p>
          <p><i>Status: </i>{status}</p>
        </div>
        <div className='buttons'>
          <button>View this jobs proposals</button>
          <button onClick={this.handleJobDelete}>delete this jobs</button>
        </div>
      </div>
    );
  }
}