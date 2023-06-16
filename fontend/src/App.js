import "antd/dist/antd.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BillsPage from "./pages/BillsPage";
import CartPage from "./pages/CartPage";
import CutomerPage from "./pages/CutomerPage";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";

function App() {
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
