import React, { Component } from 'react';
import RecommendationCard from '../card/RecommendationCard.js';
import './RecommendedJobs.scss';


export default class RecommendedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedJobs: JSON.parse(sessionStorage.getItem('recommendedJobs')),
    };
  }

  render() {
    const { recommendedJobs } = this.state;
    return (
      <div className="recommendedJobs">
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