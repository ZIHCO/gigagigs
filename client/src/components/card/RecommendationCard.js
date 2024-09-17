import React, { Component } from 'react';
import './RecommendationCard.scss';

export default class RecommendationCard extends Component {
  render() {
    const { id, description, title, budget, skills, status } = this.props.item;
    return (
      <div className="recommendationCard" id={id}>
        <div className='title'><span><i>Title: </i>{title}</span></div>
        <div className='details'>
          <p><i>Desc: </i>{description}</p>
          <p><i>Budget: </i>${budget}</p>
          <p><i>Skills: </i>{skills.join(', ')}</p>
          <p><i>Status: </i>{status}</p>
        </div>
        <div className='apply'>
          <button>Apply for this job</button>
        </div>
      </div>
    );
  }
}