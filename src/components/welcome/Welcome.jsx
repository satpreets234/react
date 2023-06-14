import axios from 'axios';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, logout } from '../../common';
function Welcome() {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                navigate('/welcome')
            }
            else {
                navigate('/login')
            }
        }
        checkAuth()

    },)
    const getProfileData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token === undefined || token === '') {
                navigate('/login');
            }
            const getData = await axios.get('http://192.168.15.201:8070/api/user/profile-data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (getData.status === 200) {
                toast.success('Authorized user!')
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error?.response.data || error);
        }
    }
    return (
        <div>
            <h1>Welcome</h1>
            <h3>You are now logged in .</h3>
            <button className='profile' type='button' onClick={getProfileData}>Profile</button>
            <button className='logout' type='button' onClick={logout}>Logout</button>

        </div>
    )
}

export default Welcome;