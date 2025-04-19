import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client.js";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAllProducts();
    
    // Verificar si hay una sesión activa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkSession();
    
    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    // Limpieza al desmontar el componente
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from("Products")
      .select()
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setProducts(data);
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      {!user ? (
        // Mostrar botones de autenticación solo si no hay usuario logueado
        <div className="auth-buttons">
          <Link to="/registro">
            <button className="create-account-btn">Registrarse</button>
          </Link>
          <Link to="/login">
            <button className="create-account-btn">Iniciar Sesión</button>
          </Link>
        </div>
      ) : (
        // Mostrar botón de cerrar sesión si hay un usuario logueado
        <div className="auth-buttons">
          <button className="create-account-btn" onClick={handleSignOut}>
            Cerrar Sesión
          </button>
        </div>
      )}
      <div className='products-wrapper'>
        <ProductsGrid products={products} />
      </div>
    </div>
  );
};

export default Home;