import { useState } from 'react'
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

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/order' element={<PlaceOrder/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path='/myorders' element={<MyOrders/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/restaurants' element={<Restaurants/>} />
          <Route path='/track-orders' element={<TrackOrder/>} />
          
          {/* Thêm Route này */}
          <Route path='/my-shop' element={<MyShop/>} />
          
        </Routes>
      </div>
      <Footer />
      <ToastContainer/>
    </>
  )
}

export default App