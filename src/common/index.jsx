import axios from 'axios';

export const isAuthenticated = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    } else {
        try {
            const userData = await axios.get('http://192.168.15.201:8070/api/user/profile-data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (userData.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }

    }
}

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};