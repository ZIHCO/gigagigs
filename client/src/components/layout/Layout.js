import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import {
  QueryClient, QueryClientProvider
} from 'react-query';
import Navbar from '../navbar/Navbar.js';
import Footer from '../footer/Footer.js';


/**
 * Layout class
 */
export default class Layout extends Component {
  /**
   * props - arguments
   */
  constructor(props) {
    super(props);
    this.queryClient = new QueryClient();
  }

  render() {
    return (
      <div className='layout'>
        <QueryClientProvider client={this.queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  }
}
