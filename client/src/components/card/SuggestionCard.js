import React, { Component } from 'react';
import './SuggestionCard.scss';

export default class SuggestionCard extends Component {
  render() {
    const { id, desc, title, img } = this.props.item;
    return (
      <div className="suggestionCard" id={id}>
        <img src={img} alt={desc} />
        <span>{title}</span>
      </div>
    );
  }
}
