import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Product from "./Components/Product/Product.jsx";
import Registro from "./Components/Registro.jsx";
import Login from "./Components/Login.jsx";
// import ProtectedRoute from './Components/ProtectedRoute';
import { UserAuth } from "./Components/context/AuthContext";

function App() {
  const { user } = UserAuth();
  console.log(user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<Product />}/>
            {/* <Route path="Registro" element={<Registro />}/> */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* <Route element={<ProtectedRoute />}>
            </Route> */}

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
