import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    console.log('decoded:', decoded); // ← добавь
    const roles = decoded.roles || [];
    console.log('roles:', roles); // ← добавь
    if (!roles.includes('ROLE_ADMIN')) return <Navigate to="/" />;
  } catch (e) {
    console.log('error:', e); // ← добавь
    return <Navigate to="/login" />;
  }

  return children;
}