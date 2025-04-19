import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Product from "./Components/Product/Product.jsx";
import Registro from "./Components/Registro.jsx";
import Login from "./Components/Login.jsx";
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from "./Components/context/AuthContext";
import NotFound from './Components/NotFound'; // Asegúrate de crear este componente

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products/:id" element={<Product />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                {/* Coloca aquí tus rutas que requieren autenticación */}
                {/* Por ejemplo: <Route path="/profile" element={<Profile />} /> */}
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App