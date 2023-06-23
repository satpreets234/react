import React from 'react'
import { useSelector } from 'react-redux';

function Profile() {
const profileData=useSelector((state)=> state.authReducer.userData)
  return (<>
    <div>Welcome to your profile</div>
    <h2>{profileData.token}</h2>
    </>
  )
}

export default Profile