import axios from 'axios';
import React, {  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Verify() {
  console.log(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramValue = searchParams.get('userId');
  const navigate=useNavigate()

  async function verifyDetails() {
    try {
      const verifyUser = await axios.post(`http://192.168.15.201:8070/api/user/verify`, {
        userId: paramValue
      });
      if (verifyUser.status === 200) {
        toast.success('User verified successfully!');
        navigate('/login')
      }
    } catch (error) {
      toast.error(error);
    }
  }
  if (paramValue) {
    verifyDetails();
  }
  return (
    <div>
      <h2>Verify page</h2>
    </div>
  )
}

export default Verify;