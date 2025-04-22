import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {fetchAllProducts} from "../../db/queries.jsx";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import Loading from "../Loading/Loading.jsx";

const Home = () => {

  const [products, setProducts] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchAllProducts().then((data) => setProducts(data));
  }, [isAuthenticated, location]);

  if (!products) {
    return <Loading />;
  }

  return (
    <div>
      {!isAuthenticated ? (
        <div className="auth-buttons">
          <Link to="./Registro">
            <button className="create-account-btn">Registrarse</button>
          </Link>
          <Link to="./Login">
            <button className="create-account-btn">Iniciar Sesión</button>
          </Link>
          <Link to="./create">
            <button className="create-account-btn">Crear Producto</button>
          </Link>
        </div>
      ) : (
          <div className="auth-buttons">
            <Link to="./create">
              <button className="create-account-btn">Crear Producto</button>
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