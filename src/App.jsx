import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Product from "./Components/Product/Product.jsx";
import Registro from "./Components/Registro.jsx";
import Login from "./Components/Login.jsx";
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import { AuthProvider } from "./Components/context/AuthContext.jsx";
import NotFound from './Components/NotFound.jsx';
import CreateProduct from "./Components/CreateProduct/CreateProduct.jsx";
import Reserve from "./Components/Reserve/Reserve.jsx"

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products/:id" element={<Product />}/>
              <Route path="Login" element={<Login />} />
              <Route path="Registro" element={<Registro />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                {/* Coloca aquí tus rutas que requieren autenticación */}
                {/* Por ejemplo: <Route path="/profile" element={<Profile />} /> */}                
                <Route path="products/:id/reserve" element={<Reserve/>} />
                <Route path="create" element={<CreateProduct />}/>
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