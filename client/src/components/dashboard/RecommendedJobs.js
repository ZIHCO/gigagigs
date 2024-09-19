import React, { Component } from 'react';
import RecommendationCard from '../card/RecommendationCard.js';
import './RecommendedJobs.scss';
import { connect } from 'react-redux';
import Alternative from '../card/Alternative.js';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';


class RecommendedJobs extends Component {
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
        {(recommendedJobs.length !== 0) && <div className='containerOnes'>
          <h2>Jobs recommendation</h2>
          {recommendedJobs.map((item, index) => (
            <div className="slide" key={index}>
              <RecommendationCard item={item} />
            </div>
          ))}
        </div>}
        {(recommendedJobs.length === 0) && <div className='containerTwo'>
          <Alternative message="You do not have any job recommendation currently" />
        </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendedJobs);