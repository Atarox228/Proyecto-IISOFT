import { useState } from 'react'
import ProductCard from './Components/ProductCard/ProductCard.jsx'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import SearchColumn from './Components/SearchColumn/SearchColumn.jsx'
import ProductsGrid from './Components/ProductsGrid/ProductsGrid.jsx'

function App() {

  return (
    <>
      <div className='page-wrapper'>
        <Navbar/>
        <div className='products-wrapper'>
          <SearchColumn/>
          <ProductsGrid/>
        </div>
        
      


     </div>
    </>
  )
}

export default App
