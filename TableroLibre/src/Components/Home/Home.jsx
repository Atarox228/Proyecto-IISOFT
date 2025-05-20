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
  const [viewingReservations, setViewingReservations] = useState(false);
  const [viewingPublications, setViewingPublications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  // Filtrar por mis reservas
  const filterByReservations = () => {
    if (!user || !products.length) return;
    
    // Filtrar productos donde id_buyer coincide con el ID del usuario
    const reservedProducts = products.filter(product => product.id_buyer === user.id);
    setFilteredProducts(reservedProducts);
  };

  // Filtrar por mis publicaciones
  const filterByPublications = () => {
    if (!user || !products.length) return;
    
    // Filtrar productos donde seller_username coincide con el username del usuario
    const reservedProducts = products.filter(product => product.seller_username === user.username);
    setFilteredProducts(reservedProducts);
  };


  const handleSearch = (searchParams) => {
    // Restablecer el modo de visualización al realizar una búsqueda
    setViewingReservations(false);
    setViewingPublications(false);
    
    // Filtrar productos basados en los parámetros de búsqueda
    let results = [...products];

    // Si no hay texto de búsqueda, mostrar todos los productos
    // Filtrar productos basados en el texto de búsqueda
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      results = results.filter(product => 
        product.Juegos.name.toLowerCase().includes(query)
      );
    }
    // Filtrar por categoría
    if (searchParams.category) {
      results = results.filter(product => 
        product.Juegos.category === searchParams.category
      );
    }
    // Filtrar por duración
    if (searchParams.duration) {
      const [min, max] = searchParams.duration.split('-');
      
      if (max) { // Rango (por ejemplo: 15-45)
        results = results.filter(product => {
          const duration = parseInt(product.Juegos.duration);
          return duration >= parseInt(min) && duration <= parseInt(max);
        });
      } else if (min.endsWith('+')) { // Más de X (por ejemplo: 120+)
        const minValue = parseInt(min);
        results = results.filter(product => {
          const duration = parseInt(product.Juegos.duration);
          return duration >= minValue;
        });
      } else if (min.endsWith('_')) { // Menos de X (por ejemplo: <15)
        const minValue = parseInt(min);
        results = results.filter(product => {
          const duration = parseInt(product.Juegos.duration);
          return duration < minValue;
        });
      }
    }

    //Filtrar por edad
    if (searchParams.age) {
      const [min, max] = searchParams.age.split('-');
      
      if (max) { // Rango (por ejemplo: 8-16)
        results = results.filter(product => {
          const age = parseInt(product.Juegos.age);
          return age >= parseInt(min) && age <= parseInt(max);
        });
      } else if (min.endsWith('+')) { // Más de X (por ejemplo: 16+)
        const minValue = parseInt(min);
        results = results.filter(product => {
          const age = parseInt(product.Juegos.age);
          return age >= minValue;
        });
      } else if (min.endsWith('_')) { // Menos de X (por ejemplo: <8)
        const minValue = parseInt(min);
        results = results.filter(product => {
          const age = parseInt(product.Juegos.age);
          return age < minValue;
        });
      }
    }

    //Filtro por cantidad de jugadores
    if (searchParams.players) {
      results = results.filter(product => 
        product.Juegos.players === searchParams.players
      );
    }
    
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
          <button 
            className="view-mode-btn" 
            onClick={filterByReservations}
          >
            Mis Reservas
          </button>
          <button 
            className="view-mode-btn" 
            onClick={filterByPublications}
          >
            Mis Publicaciones
          </button>
        </div>
      )}
      <div className='products-wrapper'>
        <ProductsGrid products={filteredProducts} />
      </div>
    </div>
  );
}

export default Home;