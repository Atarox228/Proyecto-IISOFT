import './Reserve.css'
import { useAuth } from "../context/AuthContext";
import NotFound from '../NotFound';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, reserveProduct, getReceiptFrom, cancelReserve, confirmSale, uploadFile, savePaymentUrl} from "../../db/queries.jsx";

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
    const [payment, setPayment] = useState('Efectivo'); 
    const [delivery, setDelivery] = useState('Retiro por domicilio del vendedor'); 
    const [file, setfile] = useState(null);
    
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
        const result = await reserveProduct({ idProducto: product.id, idUsuarioReserva: user.id, metodoPago: payment, metodoEntrega:delivery });
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


    const paymentRender = () => {
      if (receipt.payment_method !== 'Efectivo') {
        const handleFileClick = () => {
          document.getElementById('file-upload').click();
        };
    
        const handleFileChange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            console.log("Archivo seleccionado:", file);
            setfile(file);
        
            try {
              const publicUrl = await uploadFile({ file });
              if (publicUrl) {
                setReceipt((prev) => ({
                  ...prev,
                  payment_url: publicUrl
                }));


                
        
                await savePaymentUrl({receiptId: receipt.id, publicUrl: publicUrl});
              }
            } catch (err) {
              console.error("Error subiendo o guardando URL:", err);
            }
          }
        };
    
        return (
          <>
            <div className='receipt-item'>
              <p>CBU:</p>
              <p>{receipt.seller_cbu}</p>
            </div>
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {!file ? (
            <button className='button' onClick={handleFileClick}>
            Subir comprobante de transferencia
          </button>
            ) :(
              <p className='successful-load'>Comprobante cargado</p>
            )}

          </>
        );
      }

    };

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
                    <p>Seleccionar método de pago:</p>
                    <div className='radio-wrapper'>
                    <input type="radio" name="payment" value="Efectivo"  checked={payment === 'Efectivo'} onChange={(e) => setPayment(e.target.value)}/>
                    <p>Efectivo</p>
                    <input type="radio" name="payment" value="Transferencia" checked={payment === 'Transferencia'} onChange={(e) => setPayment(e.target.value)}/>
                    <p>Transferencia</p>
                    </div>
                    <p>Método de envío:</p>
                    <div className='radio-wrapper'>
                    <input type="radio" name ="delivery" value="Retiro" checked={delivery === 'Retiro por domicilio del vendedor'}  onChange={(e) => setDelivery(e.target.value)}/>
                    <p>Retiro por domicilio del vendedor</p>
                    </div>
                    {reserveMessage && <p className="reserve-message">{reserveMessage}</p>}
                    <button className='button' onClick={handleReserve}>Confirmar reserva</button>
                  </div>
                </div>
              ) : (
                <div className='reserve-wrapper'>
                  <div className='reserved-window'>
                    <h3>Comprobante</h3>               
                    {receipt ? (
                      <>
                      {justBought && <p>¡Gracias por confirmar la reserva!</p>}
                      <div className='receipt-item'>
                      <p>Número de pedido: </p>
                      <p>#{receipt.id}</p>
                      </div>
                      <div className='receipt-item'>
                      <p>Email del vendedor:</p>
                      <p>{receipt.seller_email}</p>                        
                      </div>

                      <div className='receipt-item'>
                        <p>Método de entrega:</p>
                        <p>{receipt.delivery_method}</p>
                      </div>
                      <div className='receipt-item'>
                      <p>Ubicación de retiro:</p>
                      <p> {receipt.address}</p>
                      </div>
                      <div className='receipt-item'>
                        <p>Monto a pagar:</p>
                        <p>${receipt.price}</p>
                      </div>
                      <div className='receipt-item'>
                        <p>Método de pago:</p>
                        <p>{receipt.payment_method}</p>
                      </div>
                      {paymentRender()}

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
