import './Reserve.css'
import { useAuth } from "../context/AuthContext";
import NotFound from '../NotFound';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, reserveProduct, getReceiptFrom, cancelReserve, confirmSale} from "../../db/queries.jsx";

const Reserve = () => {
    const { isAuthenticated, user } = useAuth();      
    const { id } = useParams();      

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reserveMessage, setReserveMessage] = useState("");
    const [cancelled, setCancelled] = useState(false)
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [justBought, setJustBought] = useState(false)

    
    useEffect(() => {
        setLoading(true);
        getProductById(id)
          .then(async (data) => {
            if (data) {
              setProduct(data);
            } else {
              setError(true);
            }
          })
          .catch(() => setError(true))
          .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (product && product.id_buyer === user.id && !receipt) {
            getReceiptFrom({ productId: product.id }).then((receiptData) => {
                setReceipt(receiptData);
            });
        }

        if (product && product.seller_username ===  user.username && !receipt) {
          getReceiptFrom({ productId: product.id }).then((receiptData) => {  
              setReceipt(receiptData);
          });
      } 
    }, [product, user.id, receipt]);

    const handleReserve = async () => {
        const result = await reserveProduct({ idProducto: product.id, idUsuarioReserva: user.id });
        setReserveMessage(result.message);      
        if (result.success) {
          const receiptData = await getReceiptFrom({ productId: product.id });
          setReceipt(receiptData);
          const updatedProduct = await getProductById(id);
          setProduct(updatedProduct);
          setJustBought(true);
        } else {
            setTimeout(() => {
                navigate("/");
              }, 3000);
        }
    };

    const handleCancelReserve = async () => {
        if (user?.id && product?.id) {
            await cancelReserve({ id_product: product.id });
            
            setCancelled(true);
            setTimeout(() => {
                navigate(`/products/${product.id}`); // Redirigir al producto después de 3 segundos
            }, 3000);
        } else {
            console.error("Faltan datos para cancelar la reserva");
        }
        setTimeout(() => {
          getProductById(id).then((data) => setProduct(data));
      }, 3000);
    };

    const handleConfirmSale = async () => {
      if (user?.id && product?.id) {
          await confirmSale({ idProducto : product.id });
          setCancelled(true);
          setTimeout(() => {
              navigate("/");
          }, 3000);
      } else {
          console.error("Faltan datos para confirmar la entrega");
      }
      setTimeout(() => {
        getProductById(id).then((data) => setProduct(data));
    }, 3000);
  };

    if (loading) return <p>Cargando...</p>;
    if (error || !product) return <NotFound />;

    const isSeller = () => product.seller_username === user.username;

    const isReserved = () => product.id_buyer !== null;

    const isNotTheBuyer = () => product.id_buyer !== user.id;

    return (
      <>
        {isAuthenticated && (
          isSeller() ? (
            !isReserved() ? (
              <NotFound />
            ) : (
              <div className='reserve-wrapper'>
                  <div className='reserved-window'>
                    <h1>Comprobante</h1>               
                    {receipt ? (
                      <>
                        <p>Mail interesado: {receipt.buyer_email}</p>
                        <p>Nombre del producto: {receipt.product_name}</p>
                        <p>
                          <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">
                            Ver producto asociado
                          </a>
                        </p>
                        <p>Número de pedido: #{receipt.id}</p>
                        {cancelled ? (
                          <p className="reserve-message">Entrega confirmada</p>
                        ) : (
                          <button className='button' onClick={handleConfirmSale}>Confirmar entrega</button>
                        )}
                      </>
                    ) : (
                      <p>Cargando comprobante...</p>
                    )}

                  </div>
                </div>
            )
          ) : ( 
            isReserved() && isNotTheBuyer() ? (
              <NotFound />
            ) : (
              !isReserved() ? (
                <div className='reserve-wrapper'>
                  <div className='reserve-window'>
                    <h1>Reservar</h1>
                    <p>¿Estás seguro que querés reservar el producto?</p>
                    {reserveMessage && <p className="reserve-message">{reserveMessage}</p>}
                    <button className='button' onClick={handleReserve}>Reservar</button>
                  </div>
                </div>
              ) : (
                <div className='reserve-wrapper'>
                  <div className='reserved-window'>
                    <h1>Comprobante</h1>               
                    {receipt ? (
                      <>
                      {justBought && <p>¡Gracias por confirmar la reserva!</p>}
                        <p>Mail vendedor: {receipt.seller_email}</p>
                        <p>Ubicación de retiro: {receipt.address}</p>
                        <p>Precio: ${receipt.price}</p>
                        <p>Número de pedido: #{receipt.id}</p>
                        {cancelled ? (
                          <p className="reserve-message">La reserva fue cancelada</p>
                        ) : (
                          <button className='button' onClick={handleCancelReserve}>Cancelar reserva</button>
                        )}
                      </>
                    ) : (
                      <p>Cargando comprobante...</p>
                    )}

                  </div>
                </div>
              )
            )
          )
        )}
      </>
    );
}

export default Reserve;
