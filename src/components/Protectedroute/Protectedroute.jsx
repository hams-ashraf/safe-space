// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const user = localStorage.getItem("user");

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
