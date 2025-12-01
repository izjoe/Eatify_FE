# Seller Dashboard Setup Guide

## 📋 Overview

Bạn đã cài đặt xong giao diện Seller Dashboard với navbar dọc bên trái, tương tự như hình ảnh bạn cung cấp.

## 🎯 Các tính năng đã tạo

### 1. **SellerLayout** 
   - Layout chính cho seller
   - Navbar dọc ở bên trái cố định (230px width)
   - Tự động check role, nếu không phải seller sẽ redirect về trang chủ

### 2. **SellerNavbar**
   - Navbar dọc với các menu items:
     - 🏠 Dashboard
     - 📋 Manage Menu
     - 🛒 Orders
     - 📊 Revenue
     - 👤 Profile
     - 🎯 Promotions
     - ⚙️ Settings
   - Logout button

### 3. **Seller Pages Created**
   - **SellerDashboard** - Trang chủ seller (hiển thị các stats)
   - **SellerOrders** - Quản lý đơn hàng
   - **ManageMenu** - Quản lý thực đơn
   - **SellerRevenue** - Báo cáo doanh thu
   - **SellerProfile** - Thông tin cửa hàng
   - **SellerPromotions** - Khuyến mãi & ưu đãi
   - **SellerSettings** - Cài đặt

## 🔄 Cách hoạt động

### Flow:
1. **Khi user đăng nhập:**
   - Chọn role `Sell Food` trong form đăng ký
   - Role được lưu vào `localStorage` và `StoreContext`
   - App component detect `role === 'seller'`
   - Render `SellerLayout` thay vì buyer layout

2. **Routing cho Seller:**
   - Tất cả routes seller bắt đầu với `/seller-*` hoặc `/manage-*`
   - Nếu route khác, mặc định redirect về `SellerDashboard`

3. **Logout:**
   - Xóa token & role khỏi localStorage
   - Reset role về 'buyer'
   - Redirect về trang chủ

## 📁 Cấu trúc thư mục

```
frontend/src/
├── components/
│   └── SellerNavbar/
│       ├── SellerNavbar.jsx
│       └── SellerNavbar.css
├── layouts/
│   ├── SellerLayout.jsx
│   └── SellerLayout.css
└── pages/
    └── SellerPages/
        ├── SellerDashboard/
        ├── SellerOrders/
        ├── ManageMenu/
        ├── SellerRevenue/
        ├── SellerProfile/
        ├── SellerPromotions/
        └── SellerSettings/
```

## 🎨 Styling

- **Color scheme:** Orange (#fa8d1a) là main color, giống branding Eatify
- **Layout:** Sidebar fixed + content area scrollable
- **Responsive:** Support mobile (sidebar width 200px)

## 📝 TODO Items (cần implement thêm)

1. **API Integration:**
   - Fetch dashboard data từ backend
   - CRUD operations cho menu items
   - Order management
   - Revenue analytics

2. **Chart Library:**
   - Cài đặt Chart.js hoặc Recharts
   - Implement doanh thu chart
   - Implement stats charts

3. **Form Handling:**
   - Add menu item form
   - Edit profile form
   - Create promotion form

4. **Validations:**
   - Input validation
   - File upload (cho food images)

## 🚀 Cách test

```bash
# 1. Chạy dev server
npm run dev

# 2. Đăng nhập và chọn "Sell Food"
# 3. Sẽ thấy sidebar menu ở bên trái
# 4. Click các menu items để test routing
```

## 🔧 Customization

Bạn có thể:
- Thay đổi colors trong CSS files
- Thêm/xóa menu items trong `SellerNavbar.jsx`
- Update dashboard stats
- Thêm more detailed forms

## ⚠️ Important Notes

- StoreContext đã được update để support role
- LoginPopup đã được update để cho phép chọn role khi sign up
- App.jsx routing logic: nếu role = 'seller' thì render seller layout, ngược lại render buyer layout
