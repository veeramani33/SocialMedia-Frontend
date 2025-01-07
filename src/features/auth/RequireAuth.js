import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem('userId') !== null; // Check if user is logged in

  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return children; // Render the children if authenticated
};

export default RequireAuth;
