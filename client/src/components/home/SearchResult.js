import React, { Component } from 'react';
import SearchResultCard from '../card/SearchResultCard.js';
import './SearchResult.scss';

export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: this.props.jobsFromQuery,
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
    const { currentIndex, limit, jobs } = this.state;
    this.setState({
      display: jobs.slice(currentIndex, currentIndex + limit),
    });
  }

  gotoNext() {
    const { currentIndex, limit, jobs } = this.state;
    const newIndex = (currentIndex + limit) % jobs.length;
    this.setState(
      { currentIndex: newIndex },
      this.updateDisplay
    );
  }

  gotoPrev() {
    const { currentIndex, limit, jobs } = this.state;
    const newIndex =
      (currentIndex - limit + jobs.length) % jobs.length;
    this.setState(
      { currentIndex: newIndex },
      this.updateDisplay
    );
  }

  render() {
    const { display } = this.state;

    return (
      <div className="searchResult">
        <h2>Jobs found from this search</h2>
        <div className="slide-container">
          <div className="prevSlides">
            <button onClick={this.gotoPrev}>&#8592;</button>
          </div>
          {display.map((job, index) => (
            <div className="slide" key={index}>
              <SearchResultCard job={job} />
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