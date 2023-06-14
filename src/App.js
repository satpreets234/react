import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/login/Login';
import Welcome from './components/welcome/Welcome';
import Profile from './components/profile/profile';
import NotFound from './components/not-found/NotFound';
import Verify from './components/verify/Verify';
import FacebookLogin from 'react-facebook-login';
function App() {
  const responseFacebook = (response) => {
    console.log(response);
    
  }
  const componentClicked = (data) =>{
    console.log(data);
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <FacebookLogin
          appId="948115842973929"
          autoLoad={true}
          fields="name,email,picture"
          onClick={componentClicked}
          callback={responseFacebook} />
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
