import React, { Component } from 'react';
import './RecommendationCard.scss';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../redux/actions.js';

class RecommendationCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      success: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { _id, title } = this.props.item;
    sessionStorage.setItem('jobApplication', JSON.stringify({ title, _id }));
    this.setState({success: true});
  }
  
  render() {
    const { _id, description, title, budget, skills, status } = this.props.item;
    const { success } = this.state;

    if (success) {
      window.location.href = `/proposals/make-proposal`;
      return ;
    }

    return (
      <div className="recommendationCard" id={_id}>
        <div className='title'><span><i>Title: </i>{title}</span></div>
        <div className='details'>
          <p><i>Desc: </i>{description}</p>
          <p><i>Budget: </i>${budget}</p>
          <p><i>Skills: </i>{skills.join(', ')}</p>
          <p><i>Status: </i>{status}</p>
        </div>
        <div className='apply'>
          <button onClick={this.handleClick}>Apply for this job</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationCard);