import { useState, useContext } from 'react'
import { StoreContext } from './context/StoreContext'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile'
import Restaurants from './pages/Restaurant/Restaurant'
import TrackOrder from './pages/TrackOrder/TrackOrder'
import MyShop from './pages/MyShop'
import Menu from './pages/Menu/Menu'
import FoodDetail from './pages/FoodDetail/FoodDetail'

// Seller Pages
import SellerLayout from './layouts/SellerLayout'
import SellerDashboard from './pages/SellerPages/SellerDashboard/SellerDashboard'
import SellerOrders from './pages/SellerPages/SellerOrders/SellerOrders'
import ManageMenu from './pages/SellerPages/ManageMenu/ManageMenu'
import SellerRevenue from './pages/SellerPages/SellerRevenue/SellerRevenue'
import SellerProfile from './pages/SellerPages/SellerProfile/SellerProfile'
import SellerPromotions from './pages/SellerPages/SellerPromotions/SellerPromotions'
import SellerSettings from './pages/SellerPages/SellerSettings/SellerSettings'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const { role } = useContext(StoreContext)

  console.log("App.jsx - Current role:", role); // DEBUG

  // Seller Routes
  if (role === 'seller') {
    console.log("Role is seller, showing SellerLayout"); // DEBUG
    return (
      <>
        <SellerLayout>
          <Routes>
            <Route path='/seller-dashboard' element={<SellerDashboard />} />
            <Route path='/seller-orders' element={<SellerOrders />} />
            <Route path='/manage-menu' element={<ManageMenu />} />
            <Route path='/seller-revenue' element={<SellerRevenue />} />
            <Route path='/seller-profile' element={<SellerProfile />} />
            <Route path='/seller-promotions' element={<SellerPromotions />} />
            <Route path='/seller-settings' element={<SellerSettings />} />
            <Route path='/*' element={<SellerDashboard />} />
          </Routes>
        </SellerLayout>
        <ToastContainer />
      </>
    )
  }

  // Buyer Routes (default)
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/track-orders' element={<TrackOrder />} />
          <Route path='/my-shop' element={<MyShop />} />
          <Route path='/food/:id' element={<FoodDetail />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App