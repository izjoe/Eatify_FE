// SELLER DASHBOARD ARCHITECTURE

/**
 * ROUTING FLOW:
 * 
 * App.jsx
 *   ├─ Check: role === 'seller' ?
 *   │
 *   ├─ YES ──→ SellerLayout
 *   │            ├─ SellerNavbar (fixed sidebar)
 *   │            └─ Routes
 *   │                ├─ /seller-dashboard → SellerDashboard
 *   │                ├─ /manage-menu → ManageMenu
 *   │                ├─ /seller-orders → SellerOrders
 *   │                ├─ /seller-revenue → SellerRevenue
 *   │                ├─ /seller-profile → SellerProfile
 *   │                ├─ /seller-promotions → SellerPromotions
 *   │                ├─ /seller-settings → SellerSettings
 *   │                └─ /* → SellerDashboard (default)
 *   │
 *   └─ NO ──→ Standard Buyer Layout (with Navbar + Footer)
 *                ├─ / → Home
 *                ├─ /cart → Cart
 *                ├─ /profile → Profile
 *                └─ ... other buyer routes
 */

/**
 * FILE STRUCTURE:
 * 
 * frontend/src/
 * │
 * ├── components/
 * │   ├── Navbar/  [BUYER NAVBAR]
 * │   └── SellerNavbar/  [NEW - SELLER NAVBAR]
 * │       ├── SellerNavbar.jsx
 * │       └── SellerNavbar.css
 * │
 * ├── layouts/  [NEW]
 * │   ├── SellerLayout.jsx
 * │   └── SellerLayout.css
 * │
 * ├── pages/
 * │   ├── Home/ [BUYER]
 * │   ├── Cart/ [BUYER]
 * │   ├── Profile/ [BUYER]
 * │   ├── MyShop/ [BUYER]
 * │   └── SellerPages/  [NEW - SELLER]
 * │       ├── SellerDashboard/
 * │       │   ├── SellerDashboard.jsx
 * │       │   └── SellerDashboard.css
 * │       ├── ManageMenu/
 * │       │   ├── ManageMenu.jsx
 * │       │   └── ManageMenu.css
 * │       ├── SellerOrders/
 * │       │   ├── SellerOrders.jsx
 * │       │   └── SellerOrders.css
 * │       ├── SellerRevenue/
 * │       │   ├── SellerRevenue.jsx
 * │       │   └── SellerRevenue.css
 * │       ├── SellerProfile/
 * │       │   ├── SellerProfile.jsx
 * │       │   └── SellerProfile.css
 * │       ├── SellerPromotions/
 * │       │   ├── SellerPromotions.jsx
 * │       │   └── SellerPromotions.css
 * │       └── SellerSettings/
 * │           ├── SellerSettings.jsx
 * │           └── SellerSettings.css
 * │
 * ├── context/
 * │   └── StoreContext.jsx [UPDATED - now has role state]
 * │
 * ├── App.jsx [UPDATED - conditional routing based on role]
 * └── ...
 */

/**
 * VISUAL LAYOUT:
 * 
 * SELLER MODE:
 * ┌──────────────────────────────────────┐
 * │     SellerNavbar (230px fixed)       │  Content Area
 * │ ┌─────────────────────────────────── │─────────────────────┐
 * │ │ Eatify                            │  Dashboard/Orders/  │
 * │ ├─────────────────────────────────── │  Menu/Revenue etc.  │
 * │ │ Dashboard                       │                     │
 * │ │ Manage Menu                     │  Scrollable Content │
 * │ │ Orders                          │                     │
 * │ │ Revenue                         │                     │
 * │ │ Profile                         │                     │
 * │ │ Promotions                      │                     │
 * │ │ Settings                        │                     │
 * │ ├─────────────────────────────────── │─────────────────────┤
 * │ │ [Logout]                           │                     │
 * │ └─────────────────────────────────── │─────────────────────┘
 * └──────────────────────────────────────┘
 * 
 * BUYER MODE:
 * ┌──────────────────────────────────────┐
 * │         Navbar (Top Horizontal)      │
 * ├──────────────────────────────────────┤
 * │                                      │
 * │         Main Content Area            │
 * │    (Home, Cart, Orders, etc.)        │
 * │                                      │
 * ├──────────────────────────────────────┤
 * │         Footer                       │
 * └──────────────────────────────────────┘
 */

/**
 * STATE MANAGEMENT:
 * 
 * StoreContext provides:
 * - role: 'buyer' | 'seller'
 * - token: user auth token
 * - setRole: function to update role
 * - setToken: function to update token
 * - ... other buyer-related states
 * 
 * LocalStorage:
 * - token: user JWT token
 * - role: user role (buyer/seller)
 * - profileData: user profile info
 */

/**
 * COMPONENT HIERARCHY:
 * 
 * App (role-based routing)
 * ├─ [IF role === 'seller']
 * │  └─ SellerLayout
 * │     ├─ SellerNavbar
 * │     └─ Routes (seller pages)
 * │
 * └─ [ELSE]
 *    ├─ Navbar
 *    ├─ Routes (buyer pages)
 *    └─ Footer
 */

/**
 * AUTHENTICATION FLOW:
 * 
 * 1. User clicks "Sign in"
 * 2. LoginPopup shows
 * 3. User chooses "Sell Food" (role=seller) or "Buy Food" (role=buyer)
 * 4. API returns: { token, role, ... }
 * 5. Client stores: localStorage.role = 'seller'|'buyer'
 * 6. App detects role change
 * 7. Render appropriate layout
 * 
 * Logout:
 * 1. localStorage.removeItem('role')
 * 2. localStorage.removeItem('token')
 * 3. setRole('buyer')
 * 4. Redirect to /
 */
