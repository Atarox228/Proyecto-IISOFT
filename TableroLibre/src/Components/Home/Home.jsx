import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import {fetchAllProducts} from "../../db/queries.jsx";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {

  const [products, setProducts] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchAllProducts().then((data) => setProducts(data));
  }, [isAuthenticated]);

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
      <Link to={"/create"}>
        <p>Hola</p>
      </Link>
    </div>
  );
}

export default Home;