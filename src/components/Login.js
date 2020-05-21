import React, { Component } from 'react'
import firebase from '../Firebase'
import FormError from '../FormError'
import { navigate } from '@reach/router'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errorMessage: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({ [itemName]: itemValue })
  }

  handleSubmit(e) {
    var registrationInfo = {
      email: this.state.email,
      password: this.state.password
    }
    e.preventDefault()

    firebase
      .auth()
      .signInWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      ).then(() => {

        if (this.props.location.state.name && this.props.location.state.url ) {
          navigate(`/create?name=${encodeURIComponent(this.props.location.state.name)}&url=${encodeURIComponent(this.props.location.state.url)}`)
        } else {
          navigate('/')
        }
      })
      .catch(error => {
        if (error.message !== null) {
          this.setState({ errorMessage: error.message })
        } else {
          this.setState({ errorMessage: null })
        }
      })
  }

  render() {
    return (
      <form className="" onSubmit={this.handleSubmit}>
        <h1 className="text-xl font-bold mb-2">Log in</h1>
        <div className="form-group">
          {this.state.errorMessage !== null ? (
            <FormError theMessage={this.state.errorMessage} />
          ) : null}
        </div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="Email"
        >
          {" "}
          Email
        </label>
        <input
          required
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="email"
          id="email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          required
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="password"
          name="password"
          id="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <button
          className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
          type="submit"
        >
          Log in
        </button>
      </form>
    );
  }
}

export default Login