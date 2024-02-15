import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import UserSignUp from './pages/UserSignUp';
import AdminConsole from './pages/AdminConsole'; 
import ErrorPage from './pages/ErrorPage'; 
import EventsCalendar from './pages/EventsCalendar'
import UserProfile from './pages/UserProfile';
import { UserProvider } from './contexts/UserContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/user-profile/:userId',
      element: <UserProfile />,
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/EventsCalendar',
      element: <EventsCalendar />,
    },
    {
      path: '/LoginPage',
      element: <LoginPage />,
    },
    {
      path: '/UserSignUp',
      element: <UserSignUp />,
    },
    {
      path: '/AdminConsole',
      element: <AdminConsole />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]);

  return (
    <UserProvider>
    <>
      <RouterProvider router={router}>
      </RouterProvider>
    </>
    </UserProvider>
  );
}

export default App;
