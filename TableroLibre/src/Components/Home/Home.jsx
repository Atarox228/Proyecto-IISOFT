import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import {fetchAllProducts} from "../../db/queries.jsx";

const Home = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts().then((data) => setProducts(data));
  }, []);

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