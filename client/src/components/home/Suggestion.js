import React, { Component } from 'react';
import { cards } from '../../data.js';
import SuggestionCard from '../card/SuggestionCard.js';
import './Suggestion.scss';

export default class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: [],
      limit: window.innerWidth < 1024 ? 1 : 2,
      currentIndex: 0,
    };
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrev = this.gotoPrev.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.updateDisplay();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const newLimit = window.innerWidth < 1024 ? 1 : 2;
    if (newLimit !== this.state.limit) {
      this.setState({ limit: newLimit }, this.updateDisplay);
    }
  }

  updateDisplay() {
    const { currentIndex, limit } = this.state;
    this.setState({
      display: cards.slice(currentIndex, currentIndex + limit),
    });
  }

  gotoNext() {
    const { currentIndex, limit } = this.state;
    const newIndex = (currentIndex + limit) % cards.length;
    this.setState(
      { currentIndex: newIndex },
      this.updateDisplay
    );
  }

  gotoPrev() {
    const { currentIndex, limit } = this.state;
    const newIndex =
      (currentIndex - limit + cards.length) % cards.length;
    this.setState(
      { currentIndex: newIndex },
      this.updateDisplay
    );
  }

  render() {
    const { display } = this.state;

    return (
      <div className="suggestion">
        <h2>Some programming & tech suggestions</h2>
        <div className="slide-container">
          <div className="prevSlides">
            <button onClick={this.gotoPrev}>&#8592;</button>
          </div>
          {display.map((item, index) => (
            <div className="slide" key={index}>
              <SuggestionCard item={item} />
            </div>
          ))}
          <div className="nextSlides">
            <button onClick={this.gotoNext}>&#8594;</button>
          </div>
        </div>
      </div>
    );
  }
}