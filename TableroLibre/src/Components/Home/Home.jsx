import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {fetchAllProducts, onSearch} from "../../db/queries.jsx";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import Loading from "../Loading/Loading.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";

const Home = () => {

  const [products, setProducts] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      console.log(data);
    });
  }, []);
    
  const handleSearch = (searchQuery) => {
    // Si no hay texto de búsqueda, mostrar todos los productos
    if (!searchQuery) {
      setProducts(products);
      return;
    }
    const results = onSearch('searchQuery').then(async (data) => {
      if (data) {
        setProducts(data);
      } else {
        setError(true);
      }
    })
    .catch(() => setError(true))
    .finally(() => setLoading(false));;
    return;
  }

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '-90px' }}>
        <SearchBar onSearch={handleSearch} setProducts = {setProducts} />
      </div>
      <div className='products-wrapper'>
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}

export default Home;