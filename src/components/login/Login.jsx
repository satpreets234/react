import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from '../../common/index'
import './Login.css'
import axios from 'axios';
function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: "" });
    const navigate = useNavigate()
    useEffect(() => {
        async function checkAuth() {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                navigate('/welcome')
            }
        }
        checkAuth()

    },)
    const handleLogin = async (loginData) => {
        if (loginData.password === '' || loginData.email === '') {
            toast.error("Please enter all details !");
        } else {
            try {
                const data = await axios.post('http://192.168.15.201:8070/api/user/login', loginData)
                if (data.status === 200) {
                    toast.success('Login successfully !')
                    localStorage.setItem("token", data.data.loginToken);
                    navigate('/welcome');

                } else {
                    toast.error(data.data);
                }
            } catch (error) {
                toast.error(error?.response.data);
            }

        }
    }
    return (
        <div>

            <div className="container">
                <label htmlFor="email"><b>Email</b></label>
                <input type="text" onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }} placeholder="Enter Email" name="email" required />

                <label htmlFor="password"><b>Password</b></label>
                <input type="password" onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }} placeholder="Enter Password" name="password" required />

                <button type="button" onClick={() => { handleLogin(loginData) }}>Login</button>
            </div>


        </div>
    )
}

export default Login;