import React, { useEffect } from 'react'
import { isAuthenticated } from '../../common';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate=useNavigate();
  useEffect(() => {
    async function checkAuth() {
        const authenticated = await isAuthenticated();
        if (!authenticated){
          navigate('/login');
        }
    }
    checkAuth()

}, )
  return (
    <div>Welcome to your profile</div>
  )
}

export default Profile