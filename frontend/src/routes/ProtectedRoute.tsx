import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading protected route...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
