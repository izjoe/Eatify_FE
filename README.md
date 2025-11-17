# Eatify
# 🍔 Eatify - Frontend

This is the complete frontend client for the Eatify food ordering platform. It's built with **React** and **Vite**, offering a fast, responsive, and modern user experience.

This application allows users to browse restaurants, explore food menus, manage their cart, and track their orders from processing to delivery.

[Image of Eatify app screenshot]

## ✨ Core Features

* **Dynamic Routing:** A complete Single Page Application (SPA) experience using `react-router-dom`.
* **Component-Based:** Built with reusable React components for UI elements like `Navbar`, `Footer`, and `LoginPopup`.
* **Global State Management:** Uses **React Context API** (`StoreContext`) to manage the shopping cart, user authentication tokens, and other global states efficiently.
* **API Integration:** Uses `axios` to communicate with the backend server for fetching data (food items, restaurants) and posting user data (orders, login).
* **User Authentication:** Secure login and registration popup with JWT (token) handling.
* **Order Tracking:**
    * `/myorders`: A dedicated page for users to view their complete order history.
    * `/track-orders`: A (newly added) page to check the status of recent orders.
* **Restaurant Listing:** A `/restaurants` page to display partner restaurants.
* **Notifications:** Uses `react-toastify` for non-intrusive user feedback on actions like "Logout Success" or "Item added to cart."

## 🛠️ Tech Stack

* **Core:** React 18, Vite
* **Routing:** `react-router-dom`
* **State Management:** React Context API
* **HTTP Client:** `axios`
* **Styling:** Vanilla CSS / CSS Modules (as per `.css` files)
* **Utilities:** `react-toastify`, `prop-types`

## 🚀 Getting Started

To run this project locally, you must be in the `frontend` directory.

### 1. Prerequisite

Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

### 2. Clone & Install

If you haven't already, install the necessary NPM packages:

```bash
# Navigate to the frontend directory
cd frontend

# Install all dependencies
npm install
