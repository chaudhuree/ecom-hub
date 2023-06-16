import "antd/dist/antd.min.css";
import axios from "axios";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BillsPage from "./pages/BillsPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CutomerPage from "./pages/CutomerPage";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  axios.defaults.headers.common["Authorization"] = JSON.parse(
    localStorage.getItem("auth")
  ).token;
  axios.defaults.baseURL = "http://localhost:5000/api/v1";
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/customers" element={<CutomerPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
    return <Navigate to="/login" />;
  }
}
