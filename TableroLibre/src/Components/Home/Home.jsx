import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {fetchAllProducts} from "../../db/queries.jsx";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import Loading from "../Loading/Loading.jsx";
import SearchColumn from "../SearchColumn/SearchColumn.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  const handleSearch = (searchQuery) => {
    // Si no hay texto de búsqueda, mostrar todos los productos
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    
    // Filtrar productos basados en el texto de búsqueda
    const query = searchQuery.toLowerCase();
    const results = products.filter(product => 
      product.Juegos.name.toLowerCase().includes(query)
    );
    
    setFilteredProducts(results);
  };

  if (!products) {
    return <Loading />;
  }

  return (
    <div>
      <SearchColumn onSearch={handleSearch} />
      
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
        <ProductsGrid products={filteredProducts} />
      </div>
    </div>
  );
}

export default Home;