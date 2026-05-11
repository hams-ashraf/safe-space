import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Doctors from "./components/Doctors/Doctors";
import Sessions from "./components/Sessions/Sessions";
import AIChat from "./components/Aichat/Aichat";
import Symptoms from "./components/Symptoms/Symptoms";
import DoctorProfile from "./components/DoctorProfile/DoctorProfile";
import PatientProfile from "./components/PatientProfile/PatientProfile";
import Meeting from "./components/Meeting/Meeting";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/Protectedroute/Protectedroute";
import EditProfile from "./components/editProfile/editProfile";
import StartNewChat from "./components/Startnewchat/Startnewchat";
import CurrentChats from "./components/CurrentChats/CurrentChats";
import MyProfileDoctor from "./components/MyProfileDoctor/MyProfileDoctor";
import EditProfileDoctor from "./components/EditProfileDoctor/EditProfileDoctor";
import ViewHistory from "./components/ViewHistory/ViewHistory";
import SessionDetails from "./components/SessionDetails/SessionDetails";

import AdminLayout from "./components/Shared/AdminLayout";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import UsersPage from "./components/AdminDashboard/UsersPage";
import UserDetails from "./components/AdminDashboard/UserDetails";
import AdminDoctorsPage from "./components/AdminDashboard/DoctorsPage";
import DoctorDetails from "./components/AdminDashboard/DoctorDetails";
import EditDoctor from "./components/AdminDashboard/EditDoctor";
import AddDoctorPage from "./components/AdminDashboard/AddDoctorPage";

const router = createBrowserRouter([
  {
 
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },

      {
        path: "start-new-chat",
          element: (
          <StartNewChat />
          )
        },

  {
    path: "start-chat/:id", 
    element: (
      <ProtectedRoute>
        <CurrentChats /> 
      </ProtectedRoute>
    ),
  },

      {
        path: "doctors",
        element: (
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        ),
      },
      {
        path: "sessions",
        element: (
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        ),
      },
      {
        path: "ai-chat",
        element: (
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        ),
      },
      {
        path: "symptoms",
        element: (
          <ProtectedRoute>
            <Symptoms />
          </ProtectedRoute>
        ),
      },
      {
        path: "myprofile",
        element: (
          <ProtectedRoute>
            <PatientProfile />
          </ProtectedRoute>
        ),
      },
      {
        path:"doctor-profile",
        element: (
          <ProtectedRoute>
            <MyProfileDoctor />
          </ProtectedRoute>
        )
      },
      {
        path: "edit-profile",
        element:(
        <ProtectedRoute>
          <EditProfile /> 
        </ProtectedRoute>
        )},
      {
        path: "meeting",
        element: (
          <ProtectedRoute>
            <Meeting />
          </ProtectedRoute>
        ),
      },
       {
         path: "doctorprofile/:id",
         element: 
         <ProtectedRoute>
           <DoctorProfile /> 
         </ProtectedRoute>
        },
        {
          path: "doctor/:id",
          element: (
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/edit-profile",
          element: (
            <ProtectedRoute>
              <EditProfileDoctor />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/history",
          element: (
            <ProtectedRoute>
              <ViewHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/session-details/:id",
          element: (
            <ProtectedRoute>
              <SessionDetails />
            </ProtectedRoute>
          ),
        },
    ],
  },
  {
  path: "/admin", 
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "users", element: <UsersPage /> },
    { path: "doctors", element: <AdminDoctorsPage /> },
    { path: "add-doctor", element: <AddDoctorPage /> },
    { path: "user/:id", element: <UserDetails /> },
    { path: "doctor/:id", element: <DoctorDetails /> },
    { path: "edit-doctor/:id", element: <EditDoctor /> },
  ],
}
]);

export default function App() {
  return <RouterProvider router={router} />;
}



