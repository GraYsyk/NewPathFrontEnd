import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components/Util/ProtectedRout.jsx'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import Catalog from './Catalog.jsx'
import { ItemPage } from './pages/ItemPage.jsx'
import { CartProvider } from './components/Cart/CartContext.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { SuccessPaymentPage } from './pages/SuccessPaymentPage.jsx'
import { CancelPaymentPage } from './pages/CancelPaymentPage.jsx'
import { OAuthPopupCallback } from './pages/Utils/OAuthPopupCallback.jsx'
import { Account } from './pages/Account.jsx'
import { Admin } from './components/Layout/Admin.jsx'
import { AdminRoute } from './components/Util/AdminRoute.jsx'
import './pages/Utils/axiosConfiguration.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPaymentPage />} />
          <Route path="/cancel" element={<CancelPaymentPage />} />
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="/oauth2/popup-callback" element={<OAuthPopupCallback />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
