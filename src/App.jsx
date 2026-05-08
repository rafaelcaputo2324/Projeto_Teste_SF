import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
