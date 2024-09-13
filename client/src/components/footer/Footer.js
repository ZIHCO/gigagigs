import React, { Component } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';


/**
 * Footer component
 */
export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="footer">
        <div className="footerOne">
          <div className="logo">
            <span className="text">GigaGigs</span>
            <span className="dot">.</span>
          </div>
          <div className="copyright">
            <span>© GigaGigs Ltd. 2024</span>
          </div>
        </div>
        <div className="footerTwo">
          <a
            className="link"
            href={'https://facebook.com/jamesmatics'}
            target="_blank" rel="noopener noreferrer"
          >
            <img src="../images/facebook.png" />
          </a>
          <a
            className="link"
            href={'https://x.com/jamesmatics'}
            target="_blank" rel="noopener noreferrer"
          >
            <img src="../images/twitter.png" />
          </a>          <a
            className="link"
            href={'https://www.linkedin.com/in/chizoba-odinaka-00563a144/'}
            target="_blank" rel="noopener noreferrer"
          >
            <img src="../images/linkedin.png" />
          </a>
        </div>
      </div>
    );
  }
}