import React, { Component } from 'react';
import './Introduction.scss';
import SearchResult from './SearchResult.js';

export default class Introduction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: window.innerWidth < 1024 ? 1 : 2,
      queryString: "",
      loading: false,
      queryResult: [],
      success: false,
      error: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({[name]: value});
  }

  async handleSubmit() {
    this.setState({
      loading: true, error: null, queryString: "",
      success: false, 
    });
    const { queryString, limit } = this.state;
    const skillString = queryString
      .trim()
      .toLowerCase();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs?skill=${skillString}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')) || null,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      const result = await response.json();
      const headers = await response.headers;
      if (headers) sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));

      this.setState({
        success: true,
        queryString: "",
        queryResult: result,
        loading: false
      });
    } catch(error) {
      this.setState({
        error: error.message, queryString: "", loading: false
      });
    }
  }

  render() {
    const { queryString, success, queryResult, loading } = this.state;
    console.log(queryResult);

    return (
      <div className="introduction">
        <div className="header">
          <h1>Tech & Programming Gigs</h1>
          <span>...find Gigabrains for that gig</span>
        </div>
        <div className="searchbox">
          <img src="../images/search.png" alt="search icon" />
          <input
            name='queryString'
            id='queryString'
            value={queryString}
            type="text"
            placeholder="Enter a programming/tech stack"
            onChange={this.handleChange}
            required
          />
          <button type="submit" onClick={this.handleSubmit}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {success && <div className='searchResult'>
          <SearchResult jobsFromQuery={queryResult}/>
        </div>}
      </div>
    );
  }
}