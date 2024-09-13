import React, { Component } from 'react';
import './Introduction.scss';

export default class Introduction extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="introduction">
        <div className="header">
          <h1>Tech & Programming Gigs</h1>
          <span>...find Gigabrains for that gig</span>
        </div>
        <div className="searchbox">
          <img src="../images/search.png" alt="search icon" />
          <input
            type="text"
            placeholder="Enter a tech stack"
          />
          <button type="submit">Search</button>
        </div>
      </div>
    );
  }
}