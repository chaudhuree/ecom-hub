import "antd/dist/antd.min.css";
import axios from "axios";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BillsPage from "./pages/BillsPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CutomerPage from "./pages/CutomerPage";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import SingleItemPage from "./pages/SingleItemPage";

function App() {
  axios.defaults.headers.common["Authorization"] = JSON.parse(
    localStorage.getItem("auth")
  )?.token;
  axios.defaults.baseURL = "https://ecom-hub.onrender.com/api/v1";
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route path="/category" element={<CategoryPage />} />
          <Route
            path="/items"
            element={
              <AdminRoute>
                <ItemPage />
              </AdminRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <BillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <AdminRoute>
                <CutomerPage />
              </AdminRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <SingleItemPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRegisterPage />} />

          <Route path="/register" element={<LoginRegisterPage />} />
          <Route path="/loginreg" element={<LoginRegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/loginreg" />;
  }
}

export function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("auth"));
  if (user.user?.role === 1) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
