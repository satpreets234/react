import React, { useContext, useState } from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from '@react-oauth/google';
import TwitterLogin from 'react-twitter-auth';
import { AuthContext } from '../../App';
import GitHubLogin from 'react-github-login';
import InstagramLogin from 'react-instagram-login'
import ReactLoginMS from "react-ms-login";
function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '', password: '', confirmPassword: ''
  })
  // useEffect(() => {
  //   async function checkAuth() {
  //     const authenticated = await isAuthenticated();
  //     console.log(authenticated, 'ertyu');
  //     if (authenticated) {
  //       navigate('/welcome')
  //     }
  //   }
  //   checkAuth()

  // }, [])
  const responseFacebook = async (response, e) => {
    try {
      console.log(response);
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
  const { state, dispatch } = useContext(AuthContext);
  const twitterError = (error) => {
    console.log(2);
    console.log(error);
  }
  const responseTwitter = async (response) => {
    try {
      console.log(1);
      console.log(response);
      const response = await axios.post('http://localhost:8070/api/user/login-twitter', {
        email: response?.email,
        name: response.name,
        provider_id: response.id,
        provider_name: "twitter",
      })
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const onSuccessGithub = async (response) => {
    try {
      console.log('9');
      if (response) {
        const loginResponse = await axios.post(`http://localhost:8070/api/user/login-github`, response);
        console.log(loginResponse);
        if (loginResponse.status == 200) {
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
    console.log(response);
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
  const responseInstagram = (response) => {
    console.log(response);
  }
  const handleSubmit = async (userData) => {
    if (userData.password === '' || userData.email === '' || userData.confirmPassword === '') {
      toast.error("please provide all details !");
    }
    else if (userData.password !== userData.confirmPassword) {
      toast.error("passwords doesn't match");
    } else {
      try {
        const data = await axios.post('http://192.168.15.201:8070/api/user/signup', userData)
        if (data.status === 200) {
          toast.success('Register successfully !')
          setUserData({ ...userData, email: '', password: '', confirmPassword: '' })
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
          <input type="password" value={userData.password} onChange={(e) => { setUserData({ ...userData, password: e.target.value }) }} placeholder="Enter Password" name="psw" id="psw" required />

          <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" value={userData.confirmPassword} onChange={(e) => { setUserData({ ...userData, confirmPassword: e.target.value }) }} placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required />
          <hr />

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
      <ReactLoginMS
        clientId="8d12a44f-9712-41ba-871c-b9f13da29e2a"
        redirectUri="http://localhost:3001/welcome"
        cssClass="ms-login"
        btnContent="LOGIN WITH MICROSOFT"
        responseType="token"
        handleLogin={(data) => console.log(data)}
      />
    </div>
  )
}

export default Register;