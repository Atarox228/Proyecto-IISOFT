import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Product from "./Components/Product/Product.jsx";
import CreateProduct from "./Components/CreateProduct/CreateProduct.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<Product />}/>
            <Route path="create" element={<CreateProduct />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
