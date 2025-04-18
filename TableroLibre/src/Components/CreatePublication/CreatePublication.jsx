import './CreatePublication.css'
import {useEffect, useState} from "react";
import {getNombresDeProductos} from "../../db/queries.jsx";
import Loading from "../Loading/Loading.jsx";


const CreatePublication = () => {

  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [juego, setJuego] = useState('');
  const [nombreDeJuegos, setNombreDeJuegos] = useState(null);

  useEffect(() => {
    getNombresDeProductos().then((data) => setNombreDeJuegos(data));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Precio:', precio);
    console.log('Ubicación:', ubicacion);
    console.log('Descripción:', descripcion);
    console.log('Juego:', juego);
  };

  if (!nombreDeJuegos) {
    return <Loading />;
  }


  return (
      <>
        <div className="container">
          <div className="formContainer">
            <h3>Crear publicación</h3>
            <hr />
            <form onSubmit={handleSubmit}>
              <div>
                <label>Seleccionar juego:</label>
                <select
                    value={juego}
                    onChange={(e) => setJuego(e.target.value)}
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
                    onChange={(e) => setPrecio(e.target.value)}
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
      </>
  );
}

export default CreatePublication;