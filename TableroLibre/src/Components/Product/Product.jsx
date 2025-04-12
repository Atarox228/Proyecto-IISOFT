import './Product.css'
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {getProductById} from "../../db/queries.jsx";


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
    return (<div>Cargando producto...</div>);
  }

  return (
      <div className="container">
        {esManualVisible ? (
            <div className="manual">
              <button className="botonManual" onClick={() => setEsManualVisible(false)} type="button">
                <p>Volver al producto</p>
              </button>
              <embed src={product.user_manual}/>
            </div>
        ) : (
            <>

              <div className="resumenProducto">
                <div className="contenedorImagen">
                  <img src={product.image_url} className="imagen" alt={"Imagen del juego"}/>
                </div>
                <div className="informacionBasica">
                  <p>{product.name}</p>
                  <p className="nombreVendedor">De Juan Pérez</p>
                  <p><strong>$ {product.price}</strong></p>
                  <button className="botonManual" onClick={() => setEsManualVisible(true)} type="button">
                    <p>Manual</p>
                  </button>
                </div>
              </div>
            <div className="seccion">
            <p className="textoSeccion">Características</p>
            <hr />
            <div className="informacionDeProducto">
            <p>Edad mínima: {product.age}</p>
            <p>Duración estimada: {product.duration} min</p>
            <p>Cantidad de jugadores: {product.players}</p>
            </div>
            </div>
            {/*<div className="seccion">*/}
            {/*  <p className="textoSeccion">Descripción</p>*/}
            {/*  <hr />*/}
            {/*  <p>{product.descripcion}*/}
            {/*  </p>*/}
            {/*</div>*/}
            </>
        )}


      </div>
  );
}

export default Product;