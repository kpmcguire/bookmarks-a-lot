import React, { Component } from 'react'
import {navigate, Link} from "@reach/router"
import logo from '../images/bmal-logo.svg'

class Navigation extends Component {
  
  render() {
    const { user, logOutUser } = this.props
    return (
      <nav className="main-navigation flex items-center justify-between bg-gray-600">
        <Link to="/">
          <img className="bmal-logo -ml-20" src={logo} />
        </Link>

        {user && (
          <ul className="flex container m-auto ml-2">
            <li>
              <Link to="/">Bookmarks</Link>
            </li>
            <li>
              <Link to="/create">Add Bookmark</Link>
            </li>
            <li className="ml-auto">
              <a href="#" onClick={e => logOutUser(e)}>
                Log Out
              </a>
            </li>
          </ul>
        )}

        {!user && (
          <ul className="flex container m-auto ml-2">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        )}
      </nav>
    );
  }
}

export default Navigation