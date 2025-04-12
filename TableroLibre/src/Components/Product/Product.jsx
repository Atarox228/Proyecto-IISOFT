import './Product.css'

const Product = ({ product }) => {

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
          </div>
        </div>
        <div className="caracteristicas">
          <p className="textoSeccion">Características</p>
          <hr />
          <div className="informacionDeProducto">
            <p>Edad mínima: {product.age}</p>
            <p>Duración estimada: {product.duration} min</p>
            <p>Cantidad de jugadores: {product.players}</p>
          </div>
        </div>
        <div className="manual">
          <p className="textoSeccion">Manual de usuario</p>
          <hr />
          <embed
              src={product.user_manual}
              width="100%"
              height="85%"/>
        </div>

      </div>

  );
}

export default Product;