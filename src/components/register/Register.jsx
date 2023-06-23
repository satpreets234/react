import React, {  useRef, useState } from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from '@react-oauth/google';
import TwitterLogin from 'react-twitter-auth';
import GitHubLogin from 'react-github-login';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/actions/index'
import ReCAPTCHA from "react-google-recaptcha";
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '', password: '', confirmPassword: '', userType: ''
  })
  const dispatch = useDispatch();

  const captchaRef = useRef()

  const showPopup = () => {
    const LinkedInApi = {
      clientId: '7790p9ne2uqcbq',
      redirectUrl: 'http://localhost:3001/welcome',
      oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
      scope: 'r_liteprofile%20r_emailaddress',
      state: '123456'
    };
    const {  scope } = LinkedInApi;
    console.log(scope);
    const oauthUrl1 = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=7790p9ne2uqcbq&scope=r_liteprofile&r_emailaddress&state=123456&redirect_uri=http://localhost:3001/welcome`;
    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl1,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
      width +
      ', height=' +
      height +
      ', top=' +
      top +
      ', left=' +
      left
    );
  };
  const responseFacebook = async (response, e) => {
    try {
      const responseApi = await axios.post('http://localhost:8070/api/user/signup-facebook', {
        email: response?.email,
        name: response.name,
        provider_id: response.id,
        provider_name: "facebook",
      })
      console.log(responseApi);
    } catch (error) {
      console.log(error);
    }
  }
  const twitterError = (error) => {
    console.log(error);
  }
  const responseTwitter = async (response) => {
    try {
      const response1 = await axios.post('http://localhost:8070/api/user/login-twitter', {
        email: response?.email,
        name: response.name,
        provider_id: response.id,
        provider_name: "twitter",
      })
      console.log(response1);
    } catch (error) {
      console.log(error);
    }
  }
  const onSuccessGithub = async (response) => {
    try {
      if (response) {
        const loginResponse = await axios.post(`http://localhost:8070/api/user/login-github`, response);
        console.log(loginResponse);
        if (loginResponse.status === 200) {
          console.log(loginResponse.data.token);
          localStorage.setItem('token', loginResponse.data.token)
          navigate('/welcome')
        }
      }

    } catch (error) {
      console.log(error);
    }

  }

  const responseMessage = async (response) => {
    try {

      const responseApi = await axios.post('http://localhost:8070/api/user/login-gmail', {
        token: response?.credential,
        provider_name: "google",
      })
      console.log(responseApi);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('token', responseApi?.data.token)
      navigate('/welcome')
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (userData) => {
    const token = captchaRef.current.getValue();
    if (!token) {
      return toast.error('Please verify captcha')
    } else {
      if (userData.password === '' || userData.email === '' || userData.confirmPassword === '') {
        toast.error("please provide all details !");
      }
      else if (userData.password !== userData.confirmPassword) {
        toast.error("passwords doesn't match");
      } else {
        try {
          userData = { ...userData, token }
          const data = await axios.post('http://localhost:8070/api/user/signup', userData)
          if (data.status === 200) {
            toast.success('Register successfully !')
            setUserData({ ...userData, email: '', password: '', confirmPassword: '' })
            dispatch(signup(data.data))
            navigate('/login');
          } else {
            toast.error(data.data);
            setUserData({ ...userData, email: '', password: '', confirmPassword: '' })
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.response.data);
          setUserData({ ...userData, email: '', password: '', confirmPassword: '' })
        }
      }
    }
  }
  const handleUserTypeChange = (userType) => {
    setUserData({ ...userData, userType });
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      {/* <h1>hello world!</h1> */}
      <form >
        <div className="container">
          <h1>Register</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />

          <label htmlFor="email"><b>Email</b></label>
          <input type="text" value={userData.email} onChange={(e) => { setUserData({ ...userData, email: e.target.value }) }} placeholder="Enter Email" name="email" id="email" required />

          <label htmlFor="psw"><b>Password</b></label>
          {/* <input type={showPassword ? "text" : "password"} value={userData.password} placeholder="Enter Password" name="psw" id="psw" required /> */}
          <TextField
            type={showPassword ? 'text' : 'password'}
            value={userData.password}
            onChange={(e) => { setUserData({ ...userData, password: e.target.value }) }}
            label="Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={()=>setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" value={userData.confirmPassword} onChange={(e) => { setUserData({ ...userData, confirmPassword: e.target.value }) }} placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required />
          <hr />
          <h3>User Role</h3>
          <label htmlFor="admin">
            <b>Admin</b>
            <input type="radio" name="userType" checked={userData.userType === 'admin'} onChange={() => handleUserTypeChange('admin')} />
          </label>

          <label htmlFor="user">
            <b>User</b>
            <input type="radio" name="userType" checked={userData.userType === 'user'} onChange={() => handleUserTypeChange('user')} />
          </label>
          <ReCAPTCHA ref={captchaRef} sitekey='6LePJrImAAAAAMZsmoydRzpMZItgWIiw5uiwPptp' />
          <button type="button" onClick={() => { handleSubmit(userData) }} className="registerbtn">Register</button>
        </div>

        <div className="container signin">
          <p>Already have an account? <a href="/login">Sign in</a>.</p>
        </div>
      </form>
      <FacebookLogin
        appId="948115842973929"
        fields="name,email,picture"
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <img src='' alt="icon" />
          </button>
        )}
        callback={responseFacebook}
      />
      <GoogleLogin
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <img src='' alt="icon" />
          </button>
        )} onSuccess={responseMessage} onError={responseMessage} />
      <TwitterLogin loginUrl="http://localhost:8070/api/user/auth/twitter"
        onFailure={twitterError} onSuccess={responseTwitter}
        requestTokenUrl="http://localhost:8070/api/user/auth/twitter/reverse" />
      <GitHubLogin clientId="69fd3ad2af875dc7e8f6"
        onSuccess={onSuccessGithub}
        buttonText="LOGIN WITH GITHUB"
        className="git-login"
        valid={true}
        redirectUri="http://localhost:3001/welcome"
      />
      {/* <InstagramLogin
        clientId="5fd2f11482844c5eba963747a5f34556"
        buttonText="Login"
        onSuccess={responseInstagram}
        onFailure={responseInstagram}
      /> */}
      <h1 onClick={showPopup}>linkedin login</h1>

    </div>
  )
}

export default Register;