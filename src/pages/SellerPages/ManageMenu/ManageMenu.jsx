// pages/SellerPages/ManageMenu/ManageMenu.jsx
// Menu management với dữ liệu thực từ API

import './ManageMenu.css';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ManageMenu = () => {
  const { url, token } = useContext(StoreContext);
  
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Add item modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    foodName: '',
    description: '',
    price: '',
    category: '',
    foodImage: '',
    stock: 10,
  });

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!token) return;
      
      setLoading(true);
      
      try {
        const storeResponse = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (storeResponse.data.ok && storeResponse.data.store) {
          setStoreData(storeResponse.data.store);
          
          // Menu items đã có trong response
          const items = storeResponse.data.store.menuItems || [];
          setMenuItems(items.map(item => ({
            id: item.foodID || item._id,
            name: item.foodName,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.foodImage,
            stock: item.stock || 0,
            status: item.isAvailable !== false ? 'active' : 'inactive',
          })));
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        toast.error('Lỗi tải dữ liệu menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [token, url]);

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  // Save edit to API
  const handleSave = async (id) => {
    if (!storeData?.sellerID) return;
    
    try {
      const response = await axios.put(
        `${url}/api/seller/store/${storeData.sellerID}/menu/${id}`,
        {
          foodName: editData.name,
          description: editData.description,
          price: editData.price,
          category: editData.category,
          foodImage: editData.image,
          stock: editData.stock,
          isAvailable: editData.status === 'active',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.ok) {
        setMenuItems(prev =>
          prev.map(item => (item.id === id ? { ...editData, id } : item))
        );
        setEditingId(null);
        toast.success('✓ Đã xác nhận thay đổi!');
      } else {
        toast.error(response.data.message || 'Lỗi cập nhật');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Lỗi kết nối server');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món này?')) return;
    if (!storeData?.sellerID) return;
    
    try {
      const response = await axios.delete(
        `${url}/api/seller/store/${storeData.sellerID}/menu/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        toast.success('Đã xóa món ăn!');
        
        // Warn if store becomes incomplete
        if (response.data.menuCount < 1) {
          toast.warning('⚠️ Cửa hàng cần ít nhất 1 món trong menu!');
        }
      } else {
        toast.error(response.data.message || 'Lỗi xóa món');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Lỗi kết nối server');
    }
  };

  // Add new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!storeData?.sellerID) {
      toast.error('Không tìm thấy thông tin cửa hàng');
      return;
    }
    
    // Validate
    if (!newItem.foodName || !newItem.description || !newItem.price || !newItem.category || !newItem.foodImage) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      const response = await axios.post(
        `${url}/api/seller/store/${storeData.sellerID}/menu`,
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.ok) {
        const addedFood = response.data.food;
        setMenuItems(prev => [...prev, {
          id: addedFood.foodID || addedFood._id,
          name: addedFood.foodName,
          description: addedFood.description,
          price: addedFood.price,
          category: addedFood.category,
          image: addedFood.foodImage,
          stock: addedFood.stock || 10,
          status: 'active',
        }]);
        
        setShowAddModal(false);
        setNewItem({
          foodName: '',
          description: '',
          price: '',
          category: '',
          foodImage: '',
          stock: 10,
        });
        toast.success('✓ Đã thêm món mới! Món ăn sẽ hiển thị cho khách hàng.');
      } else {
        toast.error(response.data.message || 'Lỗi thêm món');
      }
    } catch (error) {
      console.error('Add error:', error);
      toast.error(error.response?.data?.message || 'Lỗi kết nối server');
    }
  };

  if (loading) {
    return (
      <div className="manage-menu">
        <div className="menu-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-menu">
      <div className="menu-header">
        <h1>Manage Menu</h1>
        <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      <div className="menu-container">
        <div className="menu-filters">
          <input 
            type="text" 
            placeholder="Search items..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-menu">
            <p>📋 Chưa có món nào trong menu</p>
            <button className="add-first-btn" onClick={() => setShowAddModal(true)}>
              + Thêm món đầu tiên
            </button>
          </div>
        ) : (
          <div className="menu-table">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="category"
                          value={editData.category}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      ) : (
                        item.category
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editData.price}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      ) : (
                        `${item.price?.toLocaleString()}đ`
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                          className="edit-input"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`status ${item.status}`}>
                          {item.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <>
                          <button
                            className="save-btn"
                            onClick={() => handleSave(item.id)}
                          >
                            ✓ Xác nhận
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={handleCancel}
                          >
                            ✕ Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm món mới</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form className="modal-body" onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Tên món *</label>
                <input
                  type="text"
                  value={newItem.foodName}
                  onChange={(e) => setNewItem(prev => ({ ...prev, foodName: e.target.value }))}
                  placeholder="VD: Phở Bò Tái"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mô tả *</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả món ăn..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="45000"
                    min="1000"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Rice">Rice</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Ảnh món ăn (URL) *</label>
                <input
                  type="url"
                  value={newItem.foodImage}
                  onChange={(e) => setNewItem(prev => ({ ...prev, foodImage: e.target.value }))}
                  placeholder="https://example.com/food.jpg"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Số lượng</label>
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="10"
                  min="0"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  ✓ Thêm món
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
