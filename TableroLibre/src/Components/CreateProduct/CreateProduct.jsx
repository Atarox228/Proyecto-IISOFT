import './CreateProduct.css'
import {useEffect, useState} from "react";
import {createProduct, getNameOfGames} from "../../db/queries.jsx";
import Loading from "../Loading/Loading.jsx";


const CreateProduct = () => {

  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState('');
  const [nombreDeJuegos, setNombreDeJuegos] = useState(null);

  useEffect(() => {
    getNameOfGames().then((data) => setNombreDeJuegos(data));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    const productoIncompletoACrear = {nombre, ubicacion, precio, descripcion};
    createProduct(productoIncompletoACrear);
  };

  if (!nombreDeJuegos) {
    return <Loading />;
  }


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