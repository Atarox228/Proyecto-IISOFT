import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import supabase from "../../supabase-client.js";
import {Link} from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {

  const [products, setProducts] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const {data, error} = await supabase.from("Products_old").select().order('created_at', { ascending: false });
    if (error) {
      console.log(error);
    }
    console.log(data);
    setProducts(data);
  }

  return (
    <div>
      {!isAuthenticated && (
        <div className="auth-buttons">
          <Link to="./Registro">
            <button className="create-account-btn">Registrarse</button>
          </Link>
          <Link to="./Login">
            <button className="create-account-btn">Iniciar Sesión</button>
          </Link>
        </div>
      )}
      <div className='products-wrapper'>
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}

export default Home;