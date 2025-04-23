import './Product.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {cancelReserve, getProductById} from "../../db/queries.jsx";
import manual from '../../assets/manual.png';
import returnIcon from '../../assets/return.png';
import Loading from "../Loading/Loading.jsx";
import { useAuth } from "../context/AuthContext";
import supabase from '../../supabase-client.js';


const Product = () => {

  const [product, setProduct] = useState(null);
  const [esManualVisible, setEsManualVisible] = useState(false);
  const {id} = useParams();  
  const {isAuthenticated, user } = useAuth();  

  useEffect(() => {
    getProductById(id).then((data) => setProduct(data));
  }, []);

  useEffect(() => {
    getProductById(id).then((data) => setProduct(data));
  }, [product]);


  if (!product) {
    return <Loading />;
  }

  const isProductBought = product.id_buyer !== null;
  const isBuyer = isAuthenticated && user?.id === product.id_buyer;
  const isSeller = isAuthenticated && user?.username === product.seller_username;


  const handleBuy = () => {
    console.log("Comprando producto con ID:", product.id);
  };

  const handleCancelReserve = () => {
    if (user?.id && product?.id) {
      cancelReserve({id_product: product.id});
    } else {
      console.error("Faltan datos para cancelar la reserva");
    }
    getProductById(id).then((data) => setProduct(data));
  };

  const handleLoginRedirect = () => {
    window.location.href = "/Login";
  };

  const handleConfirmSale = async () => {
    if (!product?.id) {
      console.error("Id invalido");
      return;
    }

    try {
      const { error } = await supabase
      .from("Productos")
      .delete()
      .eq("id", product.id);
      
      if (error) {
        throw error;
      }

      alert("Venta confirmada");
      window.location.href = "/";
    } catch (err) {
      console.error("Error al confirmar la venta:", err.message);
      alert("Ocurrió un error al confirmar la venta");
    }
  }
  


 

  const renderReservationButton = () => {
    if (isSeller) {
      if (isProductBought) {
        return (
          <button className="botonManual" onClick={handleConfirmSale}>
            <p>Confirmar entrega</p>
          </button>
        );
      } else {
        return null;
      }
    }

    if (isProductBought) {
      return isBuyer ? (
        <button className="botonManual" onClick={handleCancelReserve}>
          <p>Cancelar reserva</p>
        </button>
      ) : (
        <button className="botonManual" disabled>
          <p>Reservado</p>
        </button>
      );
    } else {
      return isAuthenticated ? (
        <button className="botonManual" onClick={handleBuy}>
          <p>Reservar juego</p>
        </button>
      ) : (
        <button className="botonManual" onClick={handleLoginRedirect}>
          <p>Inicia sesión para reservar</p>
        </button>
      );
    }
  };


  return (
    <div className="container">
      {esManualVisible ? (
        <div className="manual">
          <button className="botonManual" onClick={() => setEsManualVisible(false)} type="button">
            <img src={returnIcon} className='logoManual' alt="volverAProducto"/>
            <p>Volver al producto</p>
          </button>
          <embed src={product.Juegos.user_manual} />
        </div>
      ) : (
        <>
          <div className="resumenProducto">
            <div className='imagenYResumen'>
              <div className="contenedorImagen">
                <img src={product.Juegos.image_url} className="imagen" alt={"Imagen del juego"} />
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
                {renderReservationButton()}

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
};

export default Product;