import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import CollectionModal from '../../components/Admin/CollectionModal';
import '../../../styles/Components/Admin/collection.css';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export function AdminCollection() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ collectionName: '', collectionDesc: '', collectionVisible: true });
  const [items, setItems] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const filteredItems = items
    .filter(item => showHidden ? item.deleted : !item.deleted)
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));


  useEffect(() => {
    axios.get('/api/settings').then(r => {
      setSettings(r.data);
      setCollectionName(r.data.collectionName || '');
      setCollectionDesc(r.data.collectionDesc || '');
    });
    axios.get('/api/admin/items', getAuthHeader()).then(r => setItems(r.data));
  }, []);

  const handleVisibilityToggle = async () => {
    const newVal = !settings.collectionVisible;
    await axios.put(`/api/settings/visibility?visibilityStatus=${newVal}`, {}, getAuthHeader());
    setSettings(prev => ({ ...prev, collectionVisible: newVal }));
  };

  const handleScheduleDrop = async () => {
    if (!dropDate) return;
    const ts = new Date(dropDate).getTime();
    await axios.post(`/api/settings/drop?dropDate=${ts}`, {}, getAuthHeader());
    alert('Drop scheduled!');
  };

  const handleSaveLabel = async () => {
    await axios.put('/api/settings/label', { collectionName, collectionDesc }, getAuthHeader());
  };

  const handleRestore = async (id) => {
    await axios.put(`/api/admin/items/${id}/restore`, {}, getAuthHeader());
    setItems(prev => prev.map(i => i.id === id ? { ...i, deleted: false } : i));
  };

  const canRelease = collectionName && collectionDesc && items.length > 0;

  const handleRelease = async () => {
    if (!canRelease) return;
    const now = Date.now();
    await axios.post(`/api/settings/drop?dropDate=${now}`, {}, getAuthHeader());
    await axios.put('/api/settings/label', { collectionName, collectionDesc }, getAuthHeader());
    alert('Collection released! Waiting for the scheduled drop time to pass...');
  };



  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/items/${id}`, getAuthHeader());
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="adminCollection">
      <h1 className="dashboardTitle">Collection</h1>

      {/* УПРАВЛЕНИЕ */}
      <div className="collectionControls">

        <div className="controlCard">
          <div className="controlRow">
            <div>
              <div className="controlLabel">Collection Visibility</div>
              <div className="controlSub">{settings.collectionVisible ? 'Visible to customers' : 'Hidden from customers'}</div>
            </div>
            <button
              className={`toggleBtn ${settings.collectionVisible ? 'on' : 'off'}`}
              onClick={handleVisibilityToggle}
            >
              <span className="toggleThumb" />
            </button>
          </div>
        </div>

        <div className="controlCard">
          <div className="controlLabel">Schedule Drop</div>
          <div className="controlRow" style={{ marginTop: 10 }}>
            <input
              type="datetime-local"
              className="dateInput"
              value={dropDate}
              onChange={e => setDropDate(e.target.value)}
            />
            <button className="scheduleBtn" onClick={handleScheduleDrop}>Schedule</button>
          </div>
        </div>

        <div className="controlCard wide">
          <div className="controlLabel">Collection Info</div>
          <div className="controlFields">
            <input
              className="collectionInput"
              placeholder="Collection Name"
              value={collectionName}
              onChange={e => setCollectionName(e.target.value)}
            />
            <textarea
              className="collectionTextarea"
              placeholder="Collection Description"
              value={collectionDesc}
              onChange={e => setCollectionDesc(e.target.value)}
            />
          </div>
          <div className="controlActions">
            <button className="saveLabelBtn" onClick={handleSaveLabel}>Save Info</button>
            <button
              className={`releaseBtn ${canRelease ? 'active' : ''}`}
              onClick={handleRelease}
              disabled={!canRelease}
            >
              Release Collection
            </button>
          </div>
        </div>

      </div>

      {/* ITEMS */}
      <div className="collectionItemsHeader">
        <h2 className="collectionItemsTitle">Items</h2>
        <div className="collectionItemsControls">
          <input
            className="itemsSearch"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="itemsFilterTabs">
            <button
              className={`filterTab ${!showHidden ? 'active' : ''}`}
              onClick={() => setShowHidden(false)}
            >
              Active
            </button>
            <button
              className={`filterTab ${showHidden ? 'active' : ''}`}
              onClick={() => setShowHidden(true)}
            >
              Hidden
            </button>
          </div>
          <button className="addItemBtn" onClick={() => { setEditItem(null); setShowModal(true); }}>+ Add Item</button>
        </div>
      </div>

      {items.length === 0
        ? <div className="collectionEmpty">Collection is not created yet. Add your first item.</div>
        : <div className="collectionItemsGrid">
          {filteredItems.map(item => (
            <div key={item.id} className={`collectionItemCard ${item.deleted ? 'deletedCard' : ''}`}>
              <div className="collectionItemImgWrapper">
                <img src={item.frontImage} alt={item.name} className="collectionItemImg" />
                {item.deleted && <div className="deletedOverlay"><span>Hidden</span></div>}
              </div>
              <div className="collectionItemInfo">
                <span className="collectionItemName">{item.name}</span>
                <span className="collectionItemPrice">€{item.price?.toFixed(2)}</span>
                <span className={`collectionItemStock ${item.inStock ? 'inStock' : 'outOfStock'}`}>
                  {item.inStock ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
              <div className="collectionItemActions">
                <button className="itemActionBtn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="itemActionBtn view" onClick={() => navigate(`/item/${item.id}`)}>View</button>
                {item.deleted
                  ? <button className="itemActionBtn restore" onClick={() => handleRestore(item.id)}>Restore</button>
                  : <button className="itemActionBtn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                }
              </div>
            </div>
          ))}
        </div>
      }

      {/* MODAL */}
      {showModal && (
        <CollectionModal
          onClose={() => setShowModal(false)}
          editItem={editItem}
          onSaved={(savedItem) => {
            if (editItem) {
              // обновляем существующий
              setItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i));
            } else {
              // добавляем новый
              setItems(prev => [...prev, savedItem]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}