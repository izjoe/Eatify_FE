import './SellerPromotions.css';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const SellerPromotions = () => {
  const { url, token } = useContext(StoreContext);
  
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  // Khởi tạo promotions rỗng - không có sample data
  const [promotions, setPromotions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discount: '',
    expireDate: ''
  });

  // Fetch store and promotions data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
      
      try {
        // Fetch store info
        const storeResponse = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (storeResponse.data.ok && storeResponse.data.store) {
          setStoreData(storeResponse.data.store);
          
          // TODO: Fetch promotions from API when endpoint is available
          // For now, promotions start empty until seller creates them
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, url]);

  const handleOpenModal = () => {
    setFormData({ title: '', code: '', discount: '', expireDate: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditPromo = (promo) => {
    setFormData({
      title: promo.title,
      code: promo.code,
      discount: promo.discount,
      expireDate: promo.expireDate
    });
    setEditingId(promo.id);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePromo = () => {
    if (!formData.title || !formData.code || !formData.discount || !formData.expireDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editingId) {
      setPromotions(prev =>
        prev.map(promo =>
          promo.id === editingId
            ? { ...promo, ...formData }
            : promo
        )
      );
      toast.success('Đã cập nhật khuyến mãi!');
    } else {
      const newPromo = {
        id: Date.now(), // Use timestamp as unique ID
        ...formData,
        status: 'active'
      };
      setPromotions(prev => [newPromo, ...prev]);
      toast.success('Đã tạo khuyến mãi mới!');
    }

    setShowModal(false);
  };

  const handleDeletePromo = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return;
    setPromotions(prev => prev.filter(promo => promo.id !== id));
    toast.success('Đã xóa khuyến mãi!');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isExpired = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const expireDate = new Date(year, month - 1, day);
    return expireDate < new Date();
  };

  if (loading) {
    return (
      <div className="seller-promotions">
        <div className="promotions-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-promotions">
      <div className="promotions-header">
        <h1>Khuyến mãi & Ưu đãi</h1>
        <button className="create-promo-btn" onClick={handleOpenModal}>
          + Tạo khuyến mãi mới
        </button>
      </div>

      <div className="promotions-container">
        {promotions.length === 0 ? (
          <div className="empty-promotions">
            <p>🎁 Chưa có khuyến mãi nào</p>
            <p className="empty-hint">Tạo khuyến mãi để thu hút khách hàng!</p>
            <button className="create-first-btn" onClick={handleOpenModal}>
              + Tạo khuyến mãi đầu tiên
            </button>
          </div>
        ) : (
          promotions.map((promo) => {
          const expired = isExpired(promo.expireDate);
          const badgeClass = expired ? 'expired' : 'active';
          const badgeText = expired ? 'EXPIRED' : 'ACTIVE';

          return (
            <div className="promotion-card" key={promo.id}>
              <div className={`promo-badge ${badgeClass}`}>{badgeText}</div>
              <h3>{promo.title}</h3>
              <p className="promo-code">Mã: {promo.code}</p>
              <p className="promo-discount">Giảm: {promo.discount}%</p>
              <p className="promo-date">Hết hạn: {promo.expireDate}</p>
              <div className="promo-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditPromo(promo)}
                >
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePromo(promo.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Tiêu đề khuyến mãi</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giảm 20% cho đơn hàng trên 200k"
                />
              </div>

              <div className="form-group">
                <label>Mã khuyến mãi</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: DISCOUNT20"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phần trăm giảm (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 20"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label>Hết hạn (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 31/12/2025"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
              <button className="save-btn" onClick={handleSavePromo}>
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPromotions;
