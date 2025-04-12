import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import SearchColumn from './Components/SearchColumn/SearchColumn.jsx'
import ProductsGrid from './Components/ProductsGrid/ProductsGrid.jsx'
import supabase from './supabase-client.js'
import Product from './Components/Product/Product.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Components/Layout/Layout.jsx";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>

          </Route>
        </Routes>
      </BrowserRouter>



    </>
  )
}

export default App
