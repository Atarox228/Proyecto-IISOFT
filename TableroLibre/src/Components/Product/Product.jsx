import './Product.css'
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {getProductById} from "../../db/queries.jsx";


const Product = ({ producdt }) => {

  const [product, setProduct] = useState(null);

  useEffect(() => {

  })

  return (
      <div className="container">
        <div className="resumenProducto">
          <div className="contenedorImagen">
            <img src={product.image_url} className="imagen"/>
          </div>
          <div className="informacionBasica">
            <p>{product.name}</p>
            <p className="nombreVendedor">De Juan Pérez</p>
            <p><strong>$ {product.price}</strong></p>
            <button className="botonManual">
            </button>
          </div>
        </div>
        <div className="seccion">
          <p className="textoSeccion">Características</p>
          <hr />
          <div className="informacionDeProducto">
            <p>Edad mínima: {product.age}</p>
            <p>Duración estimada: {product.duration}</p>
            <p>Cantidad de jugadores: {product.players}</p>
          </div>
        </div>
        {/*<div className="seccion">*/}
        {/*  <p className="textoSeccion">Descripción</p>*/}
        {/*  <hr />*/}
        {/*  <p>{product.descripcion}*/}
        {/*  </p>*/}
        {/*</div>*/}
      </div>
  );
}

export default Product;