import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {fetchAllProducts} from "../../db/queries.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";
import logout from '../../assets/log-out.png'
import signin from '../../assets/sign-in.png'
import add from '../../assets/add-icon.png'
import signup from '../../assets/sign-up.png'
import Loading from "../Loading/Loading.jsx";
import SearchColumn from "../SearchColumn/SearchColumn.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isAuthenticated, user, logout } = useAuth();
  const [viewingReservations, setViewingReservations] = useState(false);
  const [viewingPublications, setViewingPublications] = useState(false);
  const location = useLocation();
  const [isResultEmpty, setIsResultEmpty] = useState(false);

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

    // Para avisar que no se encontró nada
    if (results.length === 0) {
      setIsResultEmpty(true);
    } else {
      setIsResultEmpty(false);
    }
    setFilteredProducts(results);
  };

  const manejarCerrarSesion = () => {
    if (logout) {
      logout();
    }
    // Limpiar el localStorage
    localStorage.clear();
    // Recargar la página
    window.location.reload();

  };

  if (!products) {
    return <Loading />;
  }

  return (
    <div className="home-wrapper">
      <div className="dashboard-wrapper">
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <div className="button-group">
            <Link to="./Registro">
              
              <button className="view-mode-btn">
                <img src={signup}/>
                Registrarse
                </button>
            </Link>
            <Link to="./Login">
             <button className="view-mode-btn">Iniciar Sesión</button>
            </Link>
            </div>
              <div className="button-group">
            <Link to="./create">
             <button className="view-mode-btn">
              <img src={add}/>
              Crear Producto
              </button>
            </Link>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">            
            <div className="button-group">
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
            <div className="button-group">

            <Link to="./create">
             <button className="view-mode-btn">Crear Producto</button>
            </Link>
            {isAuthenticated && (
              <div className="logout-container">
                <button 
                className="logout-btn" 
                onClick={manejarCerrarSesion}
                >
                 Cerrar Sesión
                </button>
              </div>
      )}
            </div>
          </div>
      )}
      </div>
      <div className="filter-and-table">
        <SearchColumn onSearch={handleSearch} />  
          <div className='products-wrapper'>
            {/* <ProductsGrid products={filteredProducts} /> */}
            <ProductsGrid products={filteredProducts} isResultEmpty={isResultEmpty}/>
          </div>
      </div>
      
      
      

    </div>
  );
}

export default Home;