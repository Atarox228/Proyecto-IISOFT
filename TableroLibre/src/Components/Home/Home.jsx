import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import supabase from "../../supabase-client.js";

const Home = () => {

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
      <div className='products-wrapper'>
        <ProductsGrid products={products}/>
      </div>
  );
}

export default Home;