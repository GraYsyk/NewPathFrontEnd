import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/Components/Admin/special.css';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const emptyForm = { code: '', discountPercent: '', usageLimit: '', expiresAt: '' };

export function AdminSpecial() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('/api/settings/promo').then(r => setPromos(r.data));
  }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discountPercent) return;
    const payload = {
      id: null,
      code: form.code.toUpperCase(),
      discountPercent: parseInt(form.discountPercent),
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : 0,
      usedCount: 0,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).getTime() : null,
      active: true
    };
    const res = await axios.post('/api/settings/promo', payload, getAuthHeader());
    setPromos(prev => [...prev, res.data]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleToggle = async (promo) => {
    const payload = {
      ...promo,
      active: !promo.active,
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).getTime() : null
    };
    await axios.put('/api/settings/promo', payload, getAuthHeader());
    setPromos(prev => prev.map(p => p.id === promo.id ? { ...p, active: !p.active } : p));
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/settings/promo/${id}`, getAuthHeader());
    setPromos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="adminSpecial">
      <h1 className="dashboardTitle">Special</h1>

      <div className="apSpecialSection">
        <div className="apSpecialSectionHeader">
          <div>
            <div className="apSpecialSectionTitle">Promocodes</div>
            <div className="apSpecialSectionSub">Manage discount codes for your customers</div>
          </div>
          <button className="apAddPromoBtn" onClick={() => setShowForm(p => !p)}>
            {showForm ? 'Cancel' : '+ New Code'}
          </button>
        </div>

        {showForm && (
          <div className="apPromoForm">
            <div className="apPromoFormRow">
              <input
                className="apPromoInput"
                placeholder="Code (e.g. SUMMER20)"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
              />
              <input
                className="apPromoInput small"
                placeholder="Discount %"
                type="number"
                min="1"
                max="100"
                value={form.discountPercent}
                onChange={e => setForm(p => ({ ...p, discountPercent: e.target.value }))}
              />
              <input
                className="apPromoInput small"
                placeholder="Usage limit"
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))}
              />
              <input
                className="apPromoInput"
                type="datetime-local"
                value={form.expiresAt}
                onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
              />
              <button className="apCreatePromoBtn" onClick={handleCreate}>Create</button>
            </div>
          </div>
        )}

        <div className="apPromoList">
          {promos.length === 0 && (
            <div className="apPromoEmpty">No promocodes yet. Create your first one.</div>
          )}
          {promos.map(promo => (
            <div key={promo.id} className={`apPromoCard ${promo.active ? '' : 'inactive'}`}>
              <div className="apPromoCode">{promo.code}</div>
              <div className="apPromoMeta">
                <span className="apPromoDiscount">−{promo.discountPercent}%</span>
                <span className="apPromoUsage">{promo.usedCount ?? 0} / {promo.usageLimit ?? '∞'} used</span>
                <span className="apPromoExpiry">
                  {promo.expiresAt
                    ? `Expires ${new Date(promo.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : 'No expiry'}
                </span>
                <span className={`apPromoStatus ${promo.active ? 'active' : 'inactive'}`}>
                  {promo.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="apPromoActions">
                <button
                  className={`apPromoToggleBtn ${promo.active ? 'deactivate' : 'activate'}`}
                  onClick={() => handleToggle(promo)}
                >
                  {promo.active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="apPromoDeleteBtn" onClick={() => handleDelete(promo.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}