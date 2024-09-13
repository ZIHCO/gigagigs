import React, { Component } from 'react';
import './Logout.scss';

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      error: null,
      cancel: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    try{
      const response = await fetch(
        'http://192.168.169.6:5000/logout',
        {
          method: 'GET',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
          },
        }
      );
  
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
  
      sessionStorage.clear();
      this.setState({success: true});
    } catch (error) {
      this.setState({error: error.message});
    }
  }

  render() {
    const { cancel, error, success } = this.state;

    if (cancel) {
      window.location.href = './dashboard';
      return ;
    }

    if (success) {
      window.location.href = './login';
      return ;
    }

    return (
      <div className='logout'>
        <div className='container'>
          {error && <div className='flash failed'><span>{error}</span></div>}
          <span>Logout of <i>GigaGigs.</i>?</span>
          <button onClick={this.handleLogout}>Logout</button>
          <button onClick={() => this.setState({cancel: true})}>Cancel</button>
        </div>
      </div>
    );
  }
}