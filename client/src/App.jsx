import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import UserSignUp from './pages/UserSignUp';
import AdminConsole from './pages/AdminConsole'; 
import ErrorPage from './pages/ErrorPage'; 
import EventsCalendar from './pages/EventsCalendar'
import Navbar from './components/Navbar'
import './App.css';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
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
    <>
      <RouterProvider router={router}>
      </RouterProvider>
    </>
  );
}

export default App;
