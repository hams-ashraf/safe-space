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
import StartNewChat from "./components/Startnewchat/Startnewchat";
import CurrentChats from "./components/CurrentChats/CurrentChats";
//import لشات الدكتور 
// import DoctorCurrentChat from "./components/DoctorCurrentChat/DoctorCurrentChat";
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


        // {
        // path: "start-chat/:doctorId", 
        //       element: (
              
        //           <CurrentChats />
        //       ),
        // },

        {
  // المريض والدكتور هيدخلوا هنا للمحادثة
  path: "start-chat/:id", 
  element: (
    <ProtectedRoute>
      <CurrentChats /> 
    </ProtectedRoute>
  ),
},
        //ازود الpath بتاع شات الدكتور
    //   {
    //   path: "DoctorCC/:id", 
    //   element: <DoctorCurrentChat />,
    // },

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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}



