import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Doctors from "./components/Doctors/Doctors";
import Sessions from "./components/Sessions/Sessions";
import AIChat from "./components/Aichat/Aichat";
import Symptoms from "./components/Symptoms/Symptoms";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/Protectedroute/Protectedroute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
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
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
<<<<<<< Updated upstream
=======
       {
         path: "doctorprofile/:id",
         element: 
         <ProtectedRoute>
           <DoctorProfile /> 
         </ProtectedRoute>
        },
>>>>>>> Stashed changes
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}