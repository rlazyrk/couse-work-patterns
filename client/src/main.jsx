import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BouquetDetail from "./pages/BouquetDetail";
import Cart from "./pages/Cart";
import Catalog from "./pages/Catalog.jsx";
import CreateCustomBouquet from "./pages/CreateCustomBouquet";
import AdminHub from "./pages/AdminHub";
import Users from "./pages/admin/Users";
import ClientCards from "./pages/admin/ClientCards";
import Bouquets from "./pages/admin/Bouquets";
import Flowers from "./pages/admin/Flowers";
import Orders from "./pages/admin/Orders";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/bouquets/:id" element={<BouquetDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/create-bouquet"
          element={
            <ProtectedRoute>
              <CreateCustomBouquet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHub />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/client-cards"
          element={
            <AdminRoute>
              <ClientCards />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bouquets"
          element={
            <AdminRoute>
              <Bouquets />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/flowers"
          element={
            <AdminRoute>
              <Flowers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
