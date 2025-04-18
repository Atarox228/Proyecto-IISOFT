import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import supabase from "../../supabase-client.js";
import {Link} from "react-router";

const Home = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const {data, error} = await supabase.from("Products").select().order('created_at', { ascending: false });
    if (error) {
      console.log(error);
    }
    console.log(data);
    setProducts(data);
  }

  return (
      <div className='products-wrapper'>
        <ProductsGrid products={products}/>
        <Link to={"/create"}>
          <p>Hola</p>
        </Link>
      </div>
  );
}

export default Home;