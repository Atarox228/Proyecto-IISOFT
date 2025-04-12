import Navbar from "../Navbar/Navbar.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import supabase from "../../supabase-client.js";


const Layout = () => {

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
      <div className='page-wrapper'>
        <Navbar onClick={handleClickedLogo}/>
        <div className='products-wrapper'>
          <ProductsGrid products={products} setClickedCard = {setSelectedCard}/>
        </div>
      </div>
  );
}

export default Layout;