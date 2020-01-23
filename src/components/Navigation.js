import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {navigate, Link} from "@reach/router"
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

  // componentDidMount() {
  //   this.setState({
  //     dropdown: false
  //   })
  // }

  render() {
    const { user, logOutUser } = this.props
    return (
      <nav className="main-navigation flex items-center bg-gray-600">
        <Link to="/">
          <img className="block bmal-logo mt-px -ml-20" src={logo} />
        </Link>

        {user && (
          <ul className="ml-2 w-full text-right md:text-left">
            <li className="relative md:static">

              <label className="p-2 ml-auto inline-block text-3xl md:hidden md:text-4xl" htmlFor="nav-menu-toggle">
                <FaCaretSquareDown className="text-blue-900"/>
              </label>
              <input type="checkbox" className="checkbox-toggle hidden" id="nav-menu-toggle" onChange={this.toggleDropdown} checked={this.state.dropdown} />
              
              <ul className="toggle-target hidden absolute bg-blue-900 py-1 px-3 rounded inline-block md:bg-transparent md:static md:flex w-full">
                <li className="md:mr-2">
                  <Link to="/" onClick={this.toggleDropdown}>Bookmarks</Link>
                </li>
                <li className="md:mr-2">
                  <Link className="whitespace-no-wrap" to="/create" onClick={this.toggleDropdown}>Add Bookmark</Link>
                </li>
                <li className="md:ml-auto md:mr-2">
                  <a href="#" onClick={e => logOutUser(e)}>
                    Log Out
                  </a>
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