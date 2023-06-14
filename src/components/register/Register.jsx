import React, {  useState } from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
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

    </div>
  )
}

export default Register;