import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
//@ts-ignore
import '../../../styles/Components/Admin/dashboard.css';

export function AdminDashboard() {
  const [period, setPeriod] = useState('week');
  const [income, setIncome] = useState<IncomePoint[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyGrowth[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
  const [bestseller, setBestseller] = useState<Bestseller | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/admin/income?period=${period}`).then(r => setIncome(r.data));
  }, [period]);

  useEffect(() => {
    axios.get('/api/admin/monthlyGrowth').then(r => setMonthlyGrowth(r.data));
    axios.get('/api/admin/ordersStatus').then(r => setOrderStatus(r.data));
    axios.get('/api/admin/bestseller').then(r => setBestseller(r.data));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboardTitle">Dashboard</h1>

      <div className="dashboardGrid">

        {/* INCOME CHART */}
        <div className="dashboardCard wide">
          <div className="cardHeader">
            <span className="cardTitle">Income</span>
            <div className="periodTabs">
              {['day', 'week', 'month', 'year'].map(p => (
                <button key={p} className={`periodTab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={income}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ebebeb', fontSize: 12 }} />
              <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#incomeGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MONTHLY GROWTH CHART */}
        <div className="dashboardCard">
          <div className="cardHeader">
            <span className="cardTitle">Monthly Growth</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ebebeb', fontSize: 12 }} />
              <Area type="monotone" dataKey="orders" stroke="#06b6d4" fill="url(#growthGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ORDERS STATUS PIE */}
        <div className="dashboardCard">
          <div className="cardHeader">
            <span className="cardTitle">Orders Status</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={orderStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {orderStatus.map((_, i) => (
                  <Cell key={i} fill={['#6366f1','#06b6d4','#22c55e','#f59e0b'][i % 4]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ebebeb', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} formatter={(value, entry: any) => <span style={{ fontSize: 11, color: '#666' }}>{entry.payload.orderStatus}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BESTSELLER */}
        <div className="dashboardCard">
          <div className="cardHeader">
            <span className="cardTitle">Bestseller</span>
          </div>
          {bestseller && (
            <div className="bestsellerCard">
              <img src={bestseller.frontImage} alt={bestseller.itemName} className="bestsellerImg" />
              <div className="bestsellerInfo">
                <span className="bestsellerName">{bestseller.itemName}</span>
                <span className="bestsellerIdLabel">ID: {bestseller.itemId}</span>
                <div className="bestsellerSoldBlock">
                  <span className="bestsellerArrow">↑</span>
                  <span className="bestsellerSold">{bestseller.totalSold}</span>
                  <span className="bestsellerSoldLabel">units sold</span>
                </div>
                <button className="bestsellerBtn" onClick={() => navigate(`/item/${bestseller.itemId}`)}>
                  GO TO ITEM →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}