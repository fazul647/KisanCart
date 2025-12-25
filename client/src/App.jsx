import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"; // make sure this file exists
import AddProduct from "./pages/AddProduct";
import Navbar from "./components/Navbar";
import FarmerDashboard from "./pages/FarmerDashboard";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import FarmerProducts from "./pages/FarmerProducts";
import Cart from "./pages/Cart";
import FarmerOrders from "./pages/FarmerOrders";
import FarmerMessages from "./pages/FarmerMessages";
import BuyerMessages from "./pages/BuyerMessages";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerDashboard from "./pages/BuyerDashboard";
import Farmers from "./pages/Farmers";
import EditProduct from "./pages/EditProduct";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";









export default function App() {
  return (
    <BrowserRouter>
     <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/buyer/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/farmer/products" element={<FarmerProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/messages" element={<FarmerMessages />} />
        <Route path="/messages" element={<BuyerMessages />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/farmer/products/edit/:id" element={<EditProduct />} />
        <Route path="about" element={<About/>} />
        <Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/products" element={<AdminProducts />} />
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/orders" element={<AdminOrders />} />





 



      </Routes>
    </BrowserRouter>
  );
}
