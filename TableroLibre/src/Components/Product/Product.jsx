import './Product.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProductById} from "../../db/queries.jsx";
import manual from '../../assets/manual.png';
import returnIcon from '../../assets/return.png';
import Loading from "../Loading/Loading.jsx";


const Product = () => {

  const [product, setProduct] = useState(null);
  const [esManualVisible, setEsManualVisible] = useState(false);
  const {id} = useParams();


  useEffect(() => {
    getProductById(id).then((data) => setProduct(data));
  }, []);

  if (!product) {
    return <Loading />;
  }



  return (
      <div className="container">
        {esManualVisible ? (
            <div className="manual">
              <button className="botonManual" onClick={() => setEsManualVisible(false)} type="button">
                <img src={returnIcon} className='logoManual' alt="volverAProducto"/>
                <p>Volver al producto</p>
              </button>
              <embed src={product.Juegos.user_manual}/>
            </div>
        ) : (
            <>
              <div className="resumenProducto">
                <div className='imagenYResumen'>
                  <div className="contenedorImagen">
                    <img src={product.Juegos.image_url} className="imagen" alt={"Imagen del juego"}/>
                  </div>
                  <div className="informacionBasica">
                    <h1>{product.Juegos.name}</h1>
                    <p className="nombreVendedor">De {product.seller_username}</p>
                    <p>Categoría: {product.Juegos.category}</p>
                    <p>Lugar: {product.location}</p>
                    <p>Edad mínima: {product.Juegos.age}</p>
                    <p>Duración estimada: {product.Juegos.duration} min.</p>
                    <p>Cantidad de jugadores: {product.Juegos.players}</p>
                    <p><strong>$ {product.price}</strong></p>
                    <button className="botonManual" onClick={() => setEsManualVisible(true)} type="button">
                      <img className='logoManual' src={manual} alt="logoManual"/>
                      <p>Ver instrucciones de juego</p>
                    </button>
                    <button className="botonManual" onClick={() => null} type="button">
                      <p>Reservar juego</p>
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