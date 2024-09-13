import React, { Component } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';


/**
 * Navbar component
 */
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: JSON.parse(sessionStorage.getItem('currentUser')) || null,
      showMenu: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const {currentUser} = this.state;
    this.handleResize();
    if (currentUser) {
      this.setState({showMenu: true});
    }
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const showMenu = window.innerWidth >= 768;
    if (showMenu) {
      this.setState({showMenu: true});
    }
  }

  handleButtonClick() {
    this.setState({showMenu: !this.state.showMenu});
  }

  render() {
    const { showMenu, currentUser } = this.state;

    return (
      <div className="navbar">
        <div className="container">
          <div className="logoMenuButton">
            <div className="logo">
              <Link to='/' className='link'>
                <span className="text">GigaGigs</span>
              </Link>
              <span className="dot">.</span>
            </div>
            <div className="navLinks">
              {currentUser &&
                <Link to="/dashboard" className="link">
                  <div className="profileMobile">
                    <img src={currentUser.profile.pfp || '../images/pfp.jpg'} alt="" />
                    <span>@{currentUser.username}</span>
                  </div>
                </Link>
              }
              {!currentUser &&
                <button onClick={this.handleButtonClick}>
                  <img src="../images/menu.png" />
                </button>
              }
            </div>
          </div>
          {showMenu && <div className="nav-links">  
            <div className="menu">
              {!currentUser && <div className="menuGroup">
                <Link to='/register' className='link'>
                  <span className="text">Sign Up</span>
                </Link>
              </div>}
              {!currentUser && <div className="menuGroup">
                <Link to='/login' className='link'>
                  <span className="text">Log In</span>
                </Link>
              </div>}
              <div className="menuGroup">
                <Link to="/jobs/create-job" className="link">
                  <span className="text">Create a Job</span>
                </Link>
              </div>
              {currentUser && <div className="menuGroup">
                <Link to='/logout' className='link'>
                  <span className="text">Log Out</span>
                </Link>
              </div>}
              {currentUser &&
                <Link to="/dashboard" className="link">
                  <div className="profileLargerScreen">
                    <img src={currentUser.profile.pfp || '../images/pfp.jpg'} alt="" />
                    <span>@{currentUser.username}</span>
                  </div>
                </Link>
              }
            </div>
          </div>}
        </div>
      </div>
    );
  }
}