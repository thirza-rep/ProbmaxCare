import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import LandingPage from "./views/LandingPage";
import Dashboard from "./views/Dashboard";
import ConsultantSchedule from "./views/ConsultantSchedule";
import ConsultantAppointments from "./views/ConsultantAppointments";
import ConsultantAnalytics from "./views/ConsultantAnalytics";
import UserAppointment from "./views/UserAppointment";
import DailyFeedback from "./views/DailyFeedback";
import DailyCheckHistory from "./views/DailyCheckHistory";
import UserFeedback from "./views/UserFeedback";
import ChatAI from "./views/ChatAI";
import Profile from "./views/Profile";
import UserManagement from "./views/UserManagement";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/schedules',
        element: <ConsultantSchedule />
      },
      {
        path: '/consultant/appointments',
        element: <ConsultantAppointments />
      },
      {
        path: '/consultant/analytics',
        element: <ConsultantAnalytics />
      },
      {
        path: '/appointments',
        element: <UserAppointment />
      },
      {
        path: '/daily-check',
        element: <DailyFeedback />
      },
      {
        path: '/daily-check/history',
        element: <DailyCheckHistory />
      },
      {
        path: '/pmc-game',
        element: <UserFeedback />
      },
      {
        path: '/chat-ai',
        element: <ChatAI />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/user-management',
        element: <UserManagement />
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/home',
        element: <LandingPage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  }
])

export default router;
