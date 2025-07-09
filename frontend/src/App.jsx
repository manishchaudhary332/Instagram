import Home from './components/Home';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Signup from './components/SignUp';
import Profile from './components/ui/Profile';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser } from './Redux/authSlice';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/check-auth', {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAuthUser(res.data.user)); // ✅ Redux me user set
          // console.log('User loaded:', res.data.user);
        }
      } catch (error) {
        console.log('User not authenticated:', error.response?.data?.message || error.message);
        dispatch(setAuthUser(null)); // ❌ Reset on error
      }
    };

    checkAuth();
  }, [dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
