import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Components/Admin/collectionModal.css';

export default function CollectionModal({ onClose, editItem, onSaved }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [colors, setColors] = useState([{ color: '', sizes: [] }]);
  const [saving, setSaving] = useState(false);

  const resetModal = () => {
    setItemName(''); setItemPrice(''); setItemDesc('');
    setFrontImage(null); setBackImage(null); setExtraImages([]);
    setColors([{ color: '', sizes: [] }]);
  };

  useEffect(() => {
    if (editItem) {
      setItemName(editItem.name || '');
      setItemPrice(editItem.price || '');
      setItemDesc(editItem.description || '');
      setFrontImage(editItem.frontImage || null);
      setBackImage(editItem.backImage || null);
      setExtraImages(editItem.images || []);

      // conver back
      if (editItem.variants && editItem.variants.length > 0) {
        const colorMap = {};
        editItem.variants.forEach(v => {
          if (!colorMap[v.color]) colorMap[v.color] = [];
          colorMap[v.color].push({ size: v.size, quantity: v.quantity });
        });
        setColors(Object.entries(colorMap).map(([color, sizes]) => ({ color, sizes })));
      }
    } else {
      resetModal();
    }
  }, [editItem]);

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/admin/upload', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.url;
  };

  const handleAddColor = () => {
    setColors(prev => [...prev, { color: '', sizes: [] }]);
  };

  const handleColorChange = (idx, val) => {
    setColors(prev => prev.map((c, i) => i === idx ? { ...c, color: val } : c));
  };

  const handleToggleSize = (colorIdx, size) => {
    setColors(prev => prev.map((c, i) => {
      if (i !== colorIdx) return c;
      const exists = c.sizes.find(s => s.size === size);
      if (exists) return { ...c, sizes: c.sizes.filter(s => s.size !== size) };
      return { ...c, sizes: [...c.sizes, { size, quantity: 1 }] };
    }));
  };

  const handleSizeQty = (colorIdx, size, qty) => {
    setColors(prev => prev.map((c, i) => {
      if (i !== colorIdx) return c;
      return { ...c, sizes: c.sizes.map(s => s.size === size ? { ...s, quantity: Number(qty) } : s) };
    }));
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSaveItem = async () => {
    if (!itemName || !itemPrice || !itemDesc || !frontImage) return;
    setSaving(true);
    try {
      const frontUrl = typeof frontImage === 'string' ? frontImage : await uploadFile(frontImage);
      const backUrl = backImage ? (typeof backImage === 'string' ? backImage : await uploadFile(backImage)) : '';
      const extraUrls = await Promise.all(extraImages.map(f => typeof f === 'string' ? f : uploadFile(f)));

      const variants = colors.flatMap(c =>
        c.sizes.map(s => ({ size: s.size, color: c.color, quantity: s.quantity }))
      );

      const itemDTO = {
        name: itemName,
        price: parseFloat(itemPrice),
        description: itemDesc,
        frontImage: frontUrl,
        backImage: backUrl,
        images: extraUrls,
        variants
      };

      const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

      if (editItem) {
        await axios.put(`/api/admin/items/${editItem.id}`, itemDTO, authHeader);
        onSaved({ ...itemDTO, id: editItem.id }); // ← передаём наверх
      } else {
        await axios.post('/api/admin/items', itemDTO, authHeader);
        const res = await axios.get('/api/admin/items', authHeader);
        onSaved(res.data[res.data.length - 1]); // ← передаём последний добавленный
      }
      onClose(); // ← закрываем модалку
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={handleClose}>
      <div className="modalBox" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <span className="modalTitle">{editItem ? 'Edit Item' : 'Add Item'}</span>
          <button className="modalClose" onClick={handleClose}>✕</button>
        </div>

        <div className="modalBody">
          <div className="modalRow">
            <input className="modalInput" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
            <input className="modalInput" placeholder="Price (€)" type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} />
          </div>
          <textarea className="modalTextarea" placeholder="Description" value={itemDesc} onChange={e => setItemDesc(e.target.value)} />

          <div className="modalSection">
            <div className="modalSectionTitle">Images</div>
            <div className="imageUploads">
              <label className="imageUploadBox">
                <span>{frontImage ? '✓ Front' : '+ Front Image'}</span>
                <input type="file" accept="image/*" onChange={e => setFrontImage(e.target.files[0])} hidden />
              </label>
              <label className="imageUploadBox">
                <span>{backImage ? '✓ Back' : '+ Back Image'}</span>
                <input type="file" accept="image/*" onChange={e => setBackImage(e.target.files[0])} hidden />
              </label>
              <label className="imageUploadBox">
                <span>+ Extra</span>
                <input type="file" accept="image/*" multiple onChange={e => setExtraImages(Array.from(e.target.files))} hidden />
              </label>
            </div>
            {extraImages.length > 0 && <div className="extraCount">{extraImages.length} extra image(s) selected</div>}
          </div>

          <div className="modalSection">
            <div className="modalSectionTitle">Variants</div>
            {colors.map((c, ci) => (
              <div key={ci} className="colorBlock">
                <input
                  className="modalInput colorInput"
                  placeholder="Color name (e.g. Black)"
                  value={c.color}
                  onChange={e => handleColorChange(ci, e.target.value)}
                />
                <div className="sizePills">
                  {SIZES.map(size => {
                    const active = c.sizes.find(s => s.size === size);
                    return (
                      <div
                        key={size}
                        className={`sizePill ${active ? 'active' : ''}`}
                        onClick={() => handleToggleSize(ci, size)}
                      >
                        <span>{size}</span>
                        {active && (
                          <input
                            type="number"
                            min="1"
                            className="sizeQty"
                            value={active.quantity}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleSizeQty(ci, size, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button className="addColorBtn" onClick={handleAddColor}>+ Add Color</button>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalCancel" onClick={handleClose}>Cancel</button>
          <button className="modalSave" onClick={handleSaveItem} disabled={saving}>
            {saving ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}