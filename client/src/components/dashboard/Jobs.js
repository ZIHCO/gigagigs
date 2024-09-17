import React, { Component } from 'react';
import RecommendationCard from '../card/RecommendationCard.js';
import './Jobs.scss';


export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedJobs: JSON.parse(sessionStorage.getItem('recommendedJobs')),
    };
  }

  render() {
    const { recommendedJobs } = this.state;
    return (
      <div className="jobs">
        <h2>Jobs recommendation</h2>
        {recommendedJobs.map((item, index) => (
          <div className="slide" key={index}>
            <RecommendationCard item={item} />
          </div>
        ))}
      </div>
    );
  }
}