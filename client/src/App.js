import React, { Component } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './App.scss';
import Home from './pages/home/Home.js';
import Layout from './components/layout/Layout.js';
import Login from './pages/auth/Login.js';
import Logout from './pages/logout/Logout.js';
import Register from './pages/auth/Register.js';
import Dashboard from './pages/dashboard/Dashboard.js';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './redux/actions.js';
import JobListing from './pages/jobs/JobListing.js';
import Jobs from './pages/jobs/Jobs.js';
/*import Propose from './pages/proposals/Propose.js';
import MyProposals from './pages/proposals/MyProposals.js';*/


/**
 * App component
 */
class App extends Component {
  /**
   * props - argument
   */
  constructor(props) {
    super(props);
  }

  render() {
    let children = [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/jobs/create-job',
        element: <JobListing />
      },
      {
        path: '/jobs/my-jobs',
        element: <Jobs />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      }
    ];
    // if not authenticated remove route to dashboard
    if (!sessionStorage.getItem('currentUser')) {
      children = children.slice(0, children.length - 1);
    }
    /*
      {
        path: "/proposalss/create-proposal",
        element: <Propose />
      },
      {
        path: "/proposals/my-proposals",
        element: <MyProposals />
      }
    ];*/

    let routersArr = [
      {
        path: '/',
        element: <Layout />,
        children 
      },
      {
        path: '/logout',
        element: <Logout />
      }
    ];
  
    if (!sessionStorage.getItem('currentUser')) {
      routersArr = routersArr.slice(0, routersArr.length - 1);
    }

    const router = createBrowserRouter(routersArr);
    return (
      <RouterProvider router={router} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);