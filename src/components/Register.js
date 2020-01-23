import React, { Component } from 'react'
import FormError from '../FormError'
import firebase from '../Firebase'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayName: '',
      email: '',
      passOne: '',
      passTwo: '',
      errorMessage: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({ [itemName]: itemValue }, () => {
      if (this.state.passOne !== this.state.passTwo) {
        this.setState({ errorMessage: 'Passwords don\'t match' })
      } else {
        this.setState({ errorMessage: null })
      }
    })
  }

  handleSubmit(e) {
    var registrationInfo = {
      displayName: this.state.displayName,
      email: this.state.email,
      password: this.state.passOne
    }
    e.preventDefault()

    firebase
      .auth()
      .createUserWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      ).then(() => {
        this.props.registerUser(registrationInfo.displayName)
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
        <h1 className="text-xl font-bold mb-2">Register</h1>
        <div className="form-row">
          {this.state.errorMessage !== null ? (
            <FormError theMessage={this.state.errorMessage} />
          ) : null}
        </div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="displayName"
        >
          Display Name
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="text"
          id="displayName"
          name="displayName"
          required
          value={this.state.displayName}
          onChange={this.handleChange}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="email"
          id="email"
          required
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="passwordone"
        >
          Password
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="password"
          name="passOne"
          id="passwordone"
          value={this.state.passOne}
          onChange={this.handleChange}
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="passwordtwo"
        >
          Re-enter password
        </label>

        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
          type="password"
          required
          name="passTwo"
          id="passwordtwo"
          value={this.state.passTwo}
          onChange={this.handleChange}
        />

        <div className="">
          <button
            className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    );
  }
}

export default Register