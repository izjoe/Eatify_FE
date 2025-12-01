import './ManageMenu.css';
import { useState } from 'react';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Fried Chicken', price: 45000, category: 'Chicken', status: 'active' },
    { id: 2, name: 'Beef Hamburger', price: 50000, category: 'Burger', status: 'active' },
    { id: 3, name: 'Cheese Pizza', price: 60000, category: 'Pizza', status: 'inactive' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value) : value
    }));
  };

  const handleSave = (id) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? editData : item))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="manage-menu">
      <div className="menu-header">
        <h1>Manage Menu</h1>
        <button className="add-item-btn">+ Add Item</button>
      </div>

      <div className="menu-container">
        <div className="menu-filters">
          <input type="text" placeholder="Search items..." className="search-input" />
          <select className="filter-select">
            <option>All Categories</option>
            <option>Chicken</option>
            <option>Burger</option>
            <option>Pizza</option>
            <option>Beverages</option>
          </select>
        </div>

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
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
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
                      `${item.price.toLocaleString()}đ`
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
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancel}
                        >
                          Cancel
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
      </div>
    </div>
  );
};

export default ManageMenu;
