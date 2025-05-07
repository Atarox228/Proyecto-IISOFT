import './CreateProduct.css'
import { useEffect, useState } from "react";
import { createProduct, getIdOfGameByName, getNameOfGames, checkUserHasCbu, saveCbu } from "../../db/queries.jsx";
import Loading from "../Loading/Loading.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CbuForm from "../CbuForm/CbuForm.jsx";

const CreateProduct = () => {
  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState('');
  const [nombreDeJuegos, setNombreDeJuegos] = useState(null);
  const [idDeJuego, setIdDeJuego] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasCbu, setHasCbu] = useState(true); // Suponemos que tiene CBU por defecto
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargamos los nombres de juegos
        const gamesData = await getNameOfGames();
        setNombreDeJuegos(gamesData);
        
        // Verificamos si el usuario ya ha registrado un CBU
        if (user) {
          const userHasCbu = await checkUserHasCbu(user.username);
          setHasCbu(userHasCbu);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    if (nombre) {
      getIdOfGameByName(nombre).then((data) => {
        setIdDeJuego(data);
      });
    }
  }, [nombre]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const productBody = {
      idDeJuego,
      ubicacion,
      precio,
      descripcion,
      seller_username: user.username  
    };
    createProduct(productBody);
    navigate('/');
  };

  const handleCbuSubmit = async (cbu) => {
    try {
      await saveCbu(user.username, cbu);
      setHasCbu(true); // Actualiza el estado para mostrar el formulario de crear producto
    } catch (error) {
      console.error("Error saving CBU:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Si el usuario no tiene CBU registrado, mostramos el formulario de CBU
  if (!hasCbu) {
    return <CbuForm onCbuSubmit={handleCbuSubmit} />;
  }

  // Si tiene CBU o ya lo registró, mostramos el formulario de crear producto
  return (
    <div className="container">
      <div className="formContainer">
        <h3>Crear publicación</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <label>Seleccionar juego:</label>
            <select
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            >
              <option value="">Ver juegos disponibles</option>
              {nombreDeJuegos.map((juego) => <option key={juego.name} value={juego.name}>{juego.name}</option>
              )}
            </select>
          </div>
          <div>
            <label>Precio:</label>
            <input
              placeholder="Ingresá el precio del producto"
              value={precio}
              onChange={(e) => {
                if (e.target.value === "" || /^\d+(\.\d+)?$/.test(e.target.value)) {
                  setPrecio(e.target.value);
                }
              }}
              required
            />
          </div>

          <div>
            <label>Ubicación:</label>
            <input
              placeholder="Ingresá la ubicación del producto"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Descripción:</label>
            <textarea
              className="lined-textarea"
              placeholder="Ingresá la descripción del producto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={6}
              required
            />
          </div>
          <button className="crearPublicacion" type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;