import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/login/Login';
import Welcome from './components/welcome/Welcome';
import Profile from './components/profile/profile';
import NotFound from './components/not-found/NotFound';
import Verify from './components/verify/Verify';
import { createContext, useReducer } from 'react';
import { initialState,reducer } from './store/reducer';
export const AuthContext =createContext();
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
          <AuthContext.Provider value={{state,dispatch}}>
          <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='*' element={<NotFound />} />
        </Routes>        
      </BrowserRouter>
      </AuthContext.Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
