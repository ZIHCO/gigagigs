import React, { Component } from 'react';
import './SearchResultCard.scss';

export default class SearchResultCard extends Component {
  render() {
    const { _id, description, title, budget, skills } = this.props.job;
    return (
      <div className="searchResultCard" id={_id}>
        <span><i>Title: </i>{title}</span>
        <span><i>Description: </i>{description}</span>
        <span><i>Budget: </i>{budget}</span>
        <span><i>Skills: </i>{skills}</span>
      </div>
    );
  }
}
