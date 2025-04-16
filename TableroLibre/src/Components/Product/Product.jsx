import './Product.css'
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {getProductById} from "../../db/queries.jsx";
import manual from '../../assets/manual.png';
import returnIcon from '../../assets/return.png';


const Product = () => {

  const [product, setProduct] = useState(null);
  const [esManualVisible, setEsManualVisible] = useState(false);
  const {id} = useParams();


  useEffect(() => {
    getProductById(id)
        .then((data) => setProduct(data)
        );
  }, []);

  if (!product) {
    return (<div>Cargando...</div>);
  }

  return (
      <div className="container">
        {esManualVisible ? (
            <div className="manual">
              <button className="botonManual" onClick={() => setEsManualVisible(false)} type="button">
                <img src={returnIcon} className='logoManual'/>
                <p>Volver al producto</p>
              </button>
              <embed src={product.user_manual}/>
            </div>
        ) : (
            <>
              <div className="resumenProducto">
                <div className='imagenYResumen'>
                  <div className="contenedorImagen">
                    <img src={product.image_url} className="imagen" alt={"Imagen del juego"}/>
                  </div>
                  <div className="informacionBasica">
                    <h1>{product.name}</h1>
                    <p className="nombreVendedor">De Juan Pérez</p>
                    <p>Categoría: {product.category}</p>
                    <p>Lugar: {product.location}</p>
                    <p>Edad mínima: {product.age}</p>
                    <p>Duración estimada: {product.duration} min.</p>
                    <p>Cantidad de jugadores: {product.players}</p>
                    <p><strong>$ {product.price}</strong></p>
                    <button className="botonManual" onClick={() => setEsManualVisible(true)} type="button">
                      <img className='logoManual' src={manual}/>
                      <p>Ver instrucciones de juego</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="seccion">
                <p className="textoSeccion">Descripción</p>
                <hr />
                <p>{product.description}</p>
              </div>
            </>
        )}
      </div>
  );
}

export default Product;