import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function GuestLayout() {
  const { token } = useStateContext();
  const location = useLocation();

  if (token) {
    return <Navigate to="/dashboard" />
  }

  // Landing page has its own layout
  if (location.pathname === '/home') {
    return <Outlet />
  }

  // Login/Register pages use centered layout
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
