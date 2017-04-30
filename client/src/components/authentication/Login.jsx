/*eslint-disable no-unused-vars*/
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { browserHistory, Link } from 'react-router';
import React, { Component } from 'react';
import loginAction from '../../actions/authentication/loginAction';
import Header from '../common/Header.jsx';

const ADMIN_ROLE_ID = 1;

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      success: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectIfLoggedIn = this.redirectIfLoggedIn.bind(this);
  }


  componentWillMount() {
    this.redirectIfLoggedIn();
  }
  componentWillReceiveProps(nextProps) {
    this.state.error = nextProps.loginError;
    this.state.success = nextProps.loginSuccess;
    setTimeout(() => {
      this.redirectIfLoggedIn();
    }, 1000);
  }

   handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  redirectIfLoggedIn (){
    const token = window.localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      const roleId = decodedUser.RoleId;
      if (roleId === ADMIN_ROLE_ID) {
        browserHistory.push('/admindashboard');
      } else {
        browserHistory.push('/dashboard');
      }
    }
  }

  handleSubmit(event) {
    // prevent default submit action
    event.preventDefault();

    // clear any error or success messages showing
    this.setState({
      success: null,
      error: null
    });
    this.props.login(this.state);
  }

  render() {
    return (
      <div>
        <Header />
        <div className="row">
        <div className="col s4 l6 homePage"/>
        <div className="col l1" />
        <form className="col s8 l4 loginForm" onSubmit={this.handleSubmit}>
          { this.state.error ?
            <div className="login-feedback error">
              { this.state.error }
            </div>
            : <span />
          }

          { this.state.success ?
            <div className="login-feedback success">
              { this.state.success }
            </div>
            : <span />
          }
          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="email"
                name="email"
                id="email"
                onChange={this.handleChange}
              />
              <label htmlFor="email">Enter your email</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="password"
                name="password"
                id="password"
                onChange={this.handleChange}
              />
              <label htmlFor="password">Enter your password</label>
            </div>

            <div>
              <span className="changeLogin">New User? <Link to="/register">Register Here</Link></span>
            </div>
          </div>
          <label className="loginError" id="loginError"></label>

          <br />
          <center>
            <div className="row">
              <button
                type="submit"
                name="btn_login"
                id="btn_login"
                onClick={this.handleSubmit}
                className="col s12 btn btn-large waves-effect amber accent-2"
              >
                Login
                </button>
            </div>
          </center>
        </form>
      </div>
    </div>

    );
  }
}

LoginPage.PropTypes = {
  loginThings: PropTypes.func.isRequired
};

LoginPage.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = (state) => {
  return {
    loginSuccess: state.loginReducer.success,
    loginError: state.loginReducer.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: credentials => dispatch(loginAction(credentials))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(LoginPage);
