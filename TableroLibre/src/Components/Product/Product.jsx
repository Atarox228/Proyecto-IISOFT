import './Product.css'
import {useEffect, useState} from "react";
import {getProductById} from "../../db/queries.jsx";

const Product = ({ id }) => {

  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id)
        .then((data) => {
          setProduct(data);
        });
  }, []);

  return (
      <>
        <div className="container">
          <div className="resumenProducto">
            <div className="contenedorImagen">
              <img src={product?.image_url} className="imagen"/>
            </div>
            <div className="informacionBasica">
              <p>{product?.name}</p>
              <p className="nombreVendedor">De Juan Pérez</p>
              <p><strong>$ {product?.price}</strong></p>
            </div>
          </div>
          <div className="caracteristicas">
            <p className="textoSeccion">Características</p>
            <hr />
            <div className="informacionDeProducto">
              <p>Edad mínima: {product?.age}</p>
              <p>Duración estimada: {product?.duration}</p>
              <p>Cantidad de jugadores: {product?.players}</p>
            </div>
          </div>
          <div className="manual">
            <p className="textoSeccion">Manual de usuario</p>
            <hr />
            <embed
                src="https://www.uno-juego.es/wp-content/uploads/2020/11/UNO-reglas.pdf"
                width="100%"
                height="85%"/>
          </div>

        </div>
      </>
  )
}

export default Product;