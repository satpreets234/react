import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from '../../common/index'
import './Login.css'
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions';
import Recaptcha from 'react-google-recaptcha';
import QueryModal from '../QueryModal/QueryModal';
import CopyButton from '../CopyText/CopyText';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: "" });
    const capctchaRef = useRef()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    async function checkAuth() {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            navigate('/login')
        } else {
            navigate('/welcome')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])
    const handleLogin = async (loginData) => {
        const token = capctchaRef.current.getValue();
        if (!token) {
            return toast.error('Please verify captcha !')
        }
        if (loginData.password === '' || loginData.email === '') {
            toast.error("Please enter all details !");
        } else {
            try {
                loginData = { ...loginData, token }
                dispatch(login(loginData)).then((response) => {
                    // Check if the login action was successful
                    if (response) {
                        toast.success('Login successfully!');
                        navigate('/welcome');
                    }
                }).catch((error) => {
                    console.log(error);
                    toast.error(error?.response.data);
                })
            } catch (error) {
                toast.error(error);
            }

        }
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    const [showPassword,setShowPassword]=useState(false);
    return (
        <div>

            <div className="container">
                <div>
                <label htmlFor="email"><b>Email</b></label>
                <input type="text" onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }} placeholder="Enter Email" name="email" required />
                </div>
                <div>
                <label htmlFor="password"><b>Password</b></label>
                {/* <input type="password" onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }} placeholder="Enter Password" name="password" required /> */}
                <TextField
                style={{width:"70%"}}
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                    label="Password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }} />
                </div>
                <Recaptcha badge='bottomleft' ref={capctchaRef} sitekey='6LePJrImAAAAAMZsmoydRzpMZItgWIiw5uiwPptp' />
                <QueryModal handleToggle={handleToggle} isOpen={isOpen} />
                <br />
                <CopyButton textToCopy={'ok bro'} />
                <button type="button" onClick={() => { handleLogin(loginData) }}>Login</button>
            </div>


        </div>
    )
}

export default Login;