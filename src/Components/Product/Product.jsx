import './Product.css'
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {cancelReserve, getProductById} from "../../db/queries.jsx";
import manual from '../../assets/manual.png';
import tutorial from '../../assets/video-icon-32.png';
import receipt from '../../assets/receipt-icon.png';
import returnIcon from '../../assets/return.png';
import editar from '../../assets/return.png';
import Loading from "../Loading/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import supabase from '../../supabase-client.js';
import { useNavigate} from 'react-router-dom';


const Product = () => {

  const [product, setProduct] = useState(null);
  const [esManualVisible, setEsManualVisible] = useState(false);
  const [esTutorialVisible, setEsTutorialVisible] = useState(false);
  const {id} = useParams();  
  const {isAuthenticated, user } = useAuth();  
  const navigate = useNavigate();

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

  const getYoutubeEmbedUrl = (url) => {
    // Transformar URLs de YouTube a formato embed
    // Formato: https://www.youtube.com/embed/VIDEO_ID
    let videoId = '';
    
    // Manejar formatos comunes de URLs de YouTube
    if (url.includes('youtube.com/watch')) {
      // Extraer el parámetro v= de URLs como: https://www.youtube.com/watch?v=VIDEO_ID
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      // Extraer de URLs cortas como: https://youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1];
      // Eliminar parámetros adicionales si existen
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Si no se pudo extraer el ID o el formato no es reconocido, devuelvo la URL original
    return url;
  };

  const handleBuy = () => {
    navigate(`/products/${product.id}/reserve`);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { id: product.id } });;
  };

   const handleEdit = () => {
    navigate(`/products/${product.id}/edit`);
  };

  const renderReservationButton = () => {
    if (isSeller) {
      if (isProductBought) {
        return (
            <button className="botonManual" onClick={handleBuy}>
               <img className='logoManual' src={receipt} alt="logoComprobante"/>
              <p>Ver comprobante de venta</p>
            </button>
        );
      } else {
        return null;
      }
    }

    if (isProductBought) {
      return isBuyer ? (
        <button className="botonManual" onClick={handleBuy}>
           <img className='logoManual' src={receipt} alt="logoComprobante"/>
          <p>Ver comprobante de compra</p>
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

  const renderEditButton = () => {
    // Solo mostrar el botón si es el vendedor y el producto no está vendido
    if (isSeller && !isProductBought) {
      return (
        <button 
          className="botonManual" 
          onClick={handleEdit}
        >
          <img className='logoManual' src={editar} alt="logoEditar"/>
          <p>Editar publicación</p>
        </button>
      );
    }
    return null;
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
      ) : esTutorialVisible ? (
        // Si el tutorial es un video de YouTube, usa iframe
        // Si proviene de otra fuente, usa embed
        <div className="manual">
          <button className="botonManual" onClick={() => setEsTutorialVisible(false)} type="button">
            <img src={returnIcon} className='logoManual' alt="volverAProducto"/>
            <p>Volver al producto</p>
          </button>
          {product.Juegos.tutorial_url.includes('youtube.com') || product.Juegos.tutorial_url.includes('youtu.be') ? (
            <iframe 
              className="tutorial-video"
              src={getYoutubeEmbedUrl(product.Juegos.tutorial_url)}
              title="Tutorial de juego"
              frameBorder="0" //es para sacarle un borde blanco chiquito que se le genera
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          ) : (
            <embed src={product.Juegos.tutorial_url} />
          )}
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
                {product.Juegos.tutorial_url ? (
                  <button className="botonManual" onClick={() => setEsTutorialVisible(true)} type="button">
                    <img className='logoManual' src={tutorial} alt="logoTutorial"/>
                    <p>Ver tutorial</p>
                  </button>
                ) : (
                  <button className="botonManual" disabled>
                    <img className='logoManual' src={tutorial} alt="logoTutorial"/>
                    <p>Tutorial no disponible</p>
                  </button>
                )}
                {renderEditButton()}
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