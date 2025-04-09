import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import SearchColumn from './Components/SearchColumn/SearchColumn.jsx'
import ProductsGrid from './Components/ProductsGrid/ProductsGrid.jsx'
import supabase from './supabase-client.js'

function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

 const fetchAllProducts = async () => {
  const {data, error} = await supabase.from("Products").select();
  if (error) {
    console.log(error);
  }
  console.log(data);
  setProducts(data);

 }
  return (
    <>
      <div className='page-wrapper'>
        <Navbar/>
        <div className='products-wrapper'>
          <SearchColumn/>
          <ProductsGrid products={products}/>
        </div>     


     </div>
    </>
  )
}

export default App
