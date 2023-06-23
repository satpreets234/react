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
import { createContext, useState } from 'react';
import Counter from './components/counter/Counter';
import store from './redux/store';
import { Provider } from 'react-redux';
import UserTable from './components/UserManagement/UserManagement';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    // Perform authentication logic and set isAuthenticated to true
    setIsAuthenticated(true);
  };



  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/welcome" element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/verify" element={<Verify />} />
            <Route path="/counter" element={
              <ProtectedRoute>
                <Counter />
              </ProtectedRoute>
            } />


            {/* Protected Routes */}
            <Route path="/user-management" element={
              <ProtectedRoute>
                <UserTable />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
