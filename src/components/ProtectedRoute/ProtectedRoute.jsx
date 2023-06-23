import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/actions';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    let location = useLocation();
    const dispatch=useDispatch();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await axios.get('http://localhost:8070/api/user/profile-data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (userData.status === 200) {
                    
                }else{
                    dispatch(logout());
                }
            } catch (error) {
                dispatch(logout());

            }
        };

        if (!token) {
            dispatch(logout());
        } else {
            checkAuth();
        }
    }, [token]);

    if (isAuthenticated === null) {
        // Loading state, you can show a loader here if needed
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;