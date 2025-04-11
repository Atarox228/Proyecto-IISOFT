import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import SearchColumn from './Components/SearchColumn/SearchColumn.jsx'
import ProductsGrid from './Components/ProductsGrid/ProductsGrid.jsx'
import supabase from './supabase-client.js'
import Product from './Components/Product/Product.jsx'

function App() {

  const [selectedCard, setSelectedCard] = useState(null);

  const [products, setProducts] = useState([]);


  const handleClickedLogo = () => {
    setSelectedCard(null);

  }

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
        <Navbar onClick={handleClickedLogo}/>
        <div className='products-wrapper'>
          {selectedCard === null ? 
           <ProductsGrid products={products} setClickedCard = {setSelectedCard}/>
          :
           <Product product={selectedCard}/>
          
          }
         
        </div>     


     </div>
    </>
  )
}

export default App
