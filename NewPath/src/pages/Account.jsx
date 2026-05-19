import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { usePageAnimation } from '../components/Util/usePageAnimation';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import '../../styles/account.css';
import axios from 'axios';

export function Account() {
  const [isChanging, setIsChanging] = useState(false);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const mounted = usePageAnimation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setName(res.data.name || '')
        setEmail(res.data.email || '')
        setAddress(res.data.address || '')
      } catch (error) {
        console.error('Failed to fetch user data', error)
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    }

    fetchUser();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/');
  }

  const handleSaveDetails = async () => {
    try {
      await axios.put('/api/auth/me', { name, email, address }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsChanging(false);
    } catch (error) {
      console.error('Failed to update user details', error);
    }
  };

  return (
    <>
      <Header />
      <main className={`accountMain pageEnter ${mounted ? 'pageVisible' : ''}`}>
        <div className="accountContainer">

          <div className="accountHeader">
            <h1 className="accountTitle">MY ACCOUNT</h1>
            <button className="logoutBtn" onClick={handleLogout}>
              LOG OUT
            </button>
          </div>

          <div className="accountGrid">
            <div className="accountSection">
              <h2 className="sectionTitle">ORDER HISTORY</h2>
              {orders.length === 0
                ? <p className="accountEmpty">No orders yet.</p>
                : orders.map(order => (
                  <div key={order.id} className="orderCard">
                    <img src={order.orderItems[0]?.frontImage} alt={order.orderItems[0]?.itemName} className="orderImg" />
                    <div className="orderInfo">
                      <span className="orderId">Order #{order.id}</span>
                      <span className="orderDate">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="orderItems">{order.orderItems.map(i => `${i.itemName} x${i.quantity}`).join(', ')}</span>
                      <span className="orderTotal">€{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="orderRight">
                      <span className={`orderStatus ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                      <Link to={`/item/${order.orderItems[0]?.itemId}`}>
                        <button className="orderAgainBtn">ORDER AGAIN</button>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="accountSection accountDetailSection">
              <h2 className="sectionTitle">ACCOUNT DETAILS</h2>
              {!isChanging
                ? (
                  <div className="accountDetails">
                    <div className="detailGroup">
                      <span className="detailLabel">NAME</span>
                      <span className="detailValue">{name}</span>
                    </div>
                    <div className="detailGroup">
                      <span className="detailLabel">EMAIL</span>
                      <span className="detailValue">{email || 'Not set'}</span>
                    </div>
                    <div className="detailGroup">
                      <span className="detailLabel">ADDRESS</span>
                      <span className="detailValue">{address || 'Not set'}</span>
                    </div>
                    <button className="editDetailsBtn" onClick={() => setIsChanging(true)}>EDIT DETAILS</button>
                  </div>
                )
                : (
                  <div className="accountDetails">
                    <div className="detailGroup">
                      <span className="detailLabel">NAME</span>
                      <input className="detailInput" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="detailGroup">
                      <span className="detailLabel">EMAIL</span>
                      <input className="detailInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="detailGroup">
                      <span className="detailLabel">ADDRESS</span>
                      <input className="detailInput" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="detailBtns">
                      <button className="editDetailsBtn" onClick={handleSaveDetails}>SAVE</button>
                      <button className="cancelDetailsBtn" onClick={() => setIsChanging(false)}>CANCEL</button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}