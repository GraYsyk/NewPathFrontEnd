import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/Components/Admin/orders.css';

const STATUS_COLORS = {
  PENDING: { bg: '#fef9c3', color: '#854d0e' },
  PAID: { bg: '#dcfce7', color: '#166534' },
  SHIPPED: { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#f0fdf4', color: '#15803d' },
  CANCELED: { bg: '#fee2e2', color: '#991b1b' },
};

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'];

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    axios.get('/api/orders', getAuthHeader()).then(r => setOrders(r.data));
  }, []);

  const filteredOrders = orders
    .filter(o => filterStatus === 'ALL' || o.orderStatus === filterStatus)
    .filter(o => search === '' || o.id.toString().includes(search) || o.userEmail.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest'
      ? new Date(b.orderDate) - new Date(a.orderDate)
      : new Date(a.orderDate) - new Date(b.orderDate)
    );

  const handleStatusChange = async (orderId, newStatus) => {
    await axios.put(`/api/orders/${orderId}?status=${newStatus}`, {}, getAuthHeader());
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  const handleDelete = async (orderId) => {
    await axios.delete(`/api/orders/${orderId}`, getAuthHeader());
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="adminOrders">
      <h1 className="dashboardTitle">Orders</h1>

      <div className="ordersControls">
        <input
          className="ordersSearch"
          type="text"
          placeholder="Search by ID or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="ordersFilter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="ALL">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="ordersFilter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="ordersTable">
        <div className="ordersTableHeader">
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filteredOrders.length === 0 && (
          <div className="ordersEmpty">No orders found</div>
        )}

        {filteredOrders.map(order => (
          <div key={order.id} className="orderRow">
            <div className="orderRowMain">
              <span className="orderRowId" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                #{order.id}
              </span>
              <span className="orderRowEmail">{order.userEmail}</span>
              <span className="orderRowItems">
                {order.orderItems.map(i => `${i.itemName} x${i.quantity}`).join(', ')}
              </span>
              <span className="orderRowTotal">€{order.totalAmount.toFixed(2)}</span>
              <span className="orderRowDate">
                {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="orderStatusBadge" style={STATUS_COLORS[order.orderStatus]}>
                {order.orderStatus}
              </span>
              <div className="orderRowActions">
                <select
                  className="statusSelect"
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="deleteOrderBtn" onClick={() => handleDelete(order.id)}>
                  Delete
                </button>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="orderRowExpanded">
                {order.orderItems.map(item => (
                  <div key={item.itemId} className="expandedItem">
                    <img src={item.frontImage} alt={item.itemName} className="expandedItemImg" />
                    <div className="expandedItemInfo">
                      <span className="expandedItemName">{item.itemName}</span>
                      <span className="expandedItemMeta">{item.color} · {item.size} · x{item.quantity}</span>
                      <span className="expandedItemPrice">€{item.priceAtPurchase.toFixed(2)} each</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}