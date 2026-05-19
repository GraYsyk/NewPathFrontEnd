import { Navigate } from 'react-router-dom'

export function ProtectedRoute({children}) {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  if (!token || !refreshToken) return <Navigate to="/login" />;

  return children;
}