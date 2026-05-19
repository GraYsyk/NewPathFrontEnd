import { Routes, Route, NavLink, useNavigate } from 'react-router';
import { AdminDashboard } from '../../pages/Admin/AdminDashboard';
import { AdminCollection } from '../../pages/Admin/AdminCollection';
import { AdminOrders } from '../../pages/Admin/AdminOrders';
import { AdminSpecial } from '../../pages/Admin/AdminSpecial';
import { usePageAnimation } from '../../components/Util/usePageAnimation';
import '../../../styles/Components/Layout/Admin.css';

export function Admin() {
  const navigate = useNavigate();

  const mounted = usePageAnimation();

  return (<div className="adminLayout">
    <aside className="adminSidebar">
      <div className="adminLogo" onClick={() => navigate('/')}>
        NEWPATH
      </div>
      <nav className="adminNav">
        <NavLink to="/admin" end className={({ isActive }) => `adminNavItem ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `adminNavItem ${isActive ? 'active' : ''}`}>
          Orders
        </NavLink>
        <NavLink to="/admin/collection" className={({ isActive }) => `adminNavItem ${isActive ? 'active' : ''}`}>
          Collection
        </NavLink>
        <NavLink to="/admin/special" className={({ isActive }) => `adminNavItem ${isActive ? 'active' : ''}`}>
          Special
        </NavLink>
      </nav>
      <div className="adminSidebarFooter">
        <span onClick={() => navigate("/")}>← Back to store</span>
      </div>
    </aside>

    <main className={`adminContent pageEnter ${mounted ? 'pageVisible' : ''}`}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="collection" element={<AdminCollection />} />
        <Route path="special" element={<AdminSpecial />} />
      </Routes>
    </main>
  </div>
  );
}