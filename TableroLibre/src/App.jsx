import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Product from "./Components/Product/Product.jsx";
import Registro from "./Components/Registro.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<Product />}/>
            <Route path="Registro" element={<Registro />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
