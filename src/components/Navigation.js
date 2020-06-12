import React, { Component } from 'react'
import {Link} from "@reach/router"
import logo from '../images/bmal-logo.svg'
import { FaCaretSquareDown } from 'react-icons/fa'

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdown: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({
      dropdown: !this.state.dropdown
    })
  }

  render() {
    const { user, logOutUser } = this.props

    return (
      <nav className="main-navigation inline-flex items-center bg-gray-600">
        
          <div className="bmal-logo-wrapper-wrapper">
            <Link to="/" className="bmal-logo-wrapper">
              <img alt="" className="block bmal-logo mt-px" src={logo} />
            </Link>
          </div>
        

        {user && (
          <ul className="ml-2 w-full text-right md:text-left">
            <li className="relative md:static">

              <label className="p-2 ml-auto inline-block text-3xl md:hidden md:text-4xl" htmlFor="nav-menu-toggle">
                <FaCaretSquareDown className="text-blue-900"/>
              </label>
              <input type="checkbox" className="checkbox-toggle hidden" id="nav-menu-toggle" onChange={this.toggleDropdown} checked={this.state.dropdown} />
              
              <ul className="toggle-target hidden absolute bg-blue-900 py-1 px-3 rounded inline-block md:bg-transparent md:static md:flex flex-col md:flex-row md:w-full">
                <li className="md:mr-2">
                  <Link to="/" onClick={this.toggleDropdown}>Bookmarks</Link>
                </li>
                <li className="md:mr-2">
                  <Link className="whitespace-no-wrap" to="/create" onClick={this.toggleDropdown}>Add Bookmark</Link>
                </li>
                <li>
                  <Link to="/bookmarklet">Get the Bookmarklet</Link>
                </li>
                <li className="md:ml-auto md:mr-2">
                  <button className="text-white" onClick={e => logOutUser(e)}>
                    Log Out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        )}

        {!user && (
          <ul className="flex container m-auto ml-2">
            <li>
              <Link to="/login" className="mr-2">Login</Link>
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