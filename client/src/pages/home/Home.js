import React, { Component } from 'react';
import './Home.scss';
import Introduction from '../../components/home/Introduction.js';
import Suggestion from '../../components/home/Suggestion.js';

/**
 * Home component
 */
export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <Introduction />
        <Suggestion />
      </div>
    );
  }
}
