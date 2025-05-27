import './Reserve.css'
import { useAuth } from "../context/AuthContext.jsx";
import NotFound from '../NotFound.jsx';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, reserveProduct, getReceiptFrom, cancelReserve, confirmSale, uploadFile, savePaymentUrl} from "../../db/queries.jsx";
import Loading from '../Loading/Loading.jsx';

const Reserve = () => {
    const { isAuthenticated, user } = useAuth();      
    const { id } = useParams();      

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reserveMessage, setReserveMessage] = useState("");
    const [cancelled, setCancelled] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [justBought, setJustBought] = useState(false);
    const [payment, setPayment] = useState('Efectivo'); 
    const [delivery, setDelivery] = useState('Retiro por domicilio del vendedor'); 
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [paymentURL, setPaymentURL] = useState('');
    const [receiptButtonClicked, setReceiptButtonClicked] = useState(false);
    
    const navigate = useNavigate();
    
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
        if (!product || !user) return;
        
        if ((product.id_buyer === user.id || product.seller_username === user.username) && !receipt) {
            getReceiptFrom({ productId: product.id }).then((receiptData) => {
                setReceipt(receiptData);
                if (receiptData.payment_url) {
                    setUploadSuccess(true);
                    setPaymentURL(receiptData.payment_url);
                }
            });
        }
    }, [product, user, receipt]);

    const handleReserve = async () => {
        try {
            const result = await reserveProduct({ 
                idProducto: product.id, 
                idUsuarioReserva: user.id, 
                metodoPago: payment, 
                metodoEntrega: delivery 
            });
            
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
        } catch (error) {
            console.error("Error al reservar:", error);
            setReserveMessage("Error al procesar la reserva");
        }
    };

    const handleCancelReserve = async () => {
        if (!user?.id || !product?.id) {
            console.error("Faltan datos para cancelar la reserva");
            return;
        }
        
        try {
            await cancelReserve({ id_product: product.id });
            setCancelled(true);
            
            setTimeout(() => {
                navigate(`/products/${product.id}`);
            }, 3000);
            
            setTimeout(() => {
                getProductById(id).then((data) => setProduct(data));
            }, 3000);
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
        }
    };

    const handleConfirmSale = async () => {
        if (!user?.id || !product?.id) {
            console.error("Faltan datos para confirmar la entrega");
            return;
        }
        
        try {
            await confirmSale({ idProducto: product.id });
            setCancelled(true);
            
            setTimeout(() => {
                navigate("/");
            }, 3000);
            
            setTimeout(() => {
                getProductById(id).then((data) => setProduct(data));
            }, 3000);
        } catch (error) {
            console.error("Error al confirmar la venta:", error);
        }
    };

    const handleFileClick = () => {
        document.getElementById('file-upload').click();
    };
    
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        console.log("Archivo seleccionado:", selectedFile);
        
        // Validar formato (JPG/JPEG)
        const fileType = selectedFile.type;
        if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
            setFileError("Por favor, suba una imagen en formato JPG o JPEG");
            setUploadSuccess(false);
            return;
        }
        
        // Validar tamaño (menor a 1MB)
        const fileSize = selectedFile.size / 1024 / 1024; // Convertir a MB
        if (fileSize > 1) {
            setFileError("La imagen debe pesar menos de 1 MB");
            setUploadSuccess(false);
            return;
        }
        
        // Si pasa las validaciones, limpiar el error
        setFileError("");
        setFile(selectedFile);
    
        try {
            const publicUrl = await uploadFile({ file: selectedFile });
            if (publicUrl) {
                setReceipt((prev) => ({
                    ...prev,
                    payment_url: publicUrl
                }));
                
                await savePaymentUrl({ receiptId: receipt.id, publicUrl: publicUrl });
                setUploadSuccess(true);
            }
        } catch (err) {
            console.error("Error subiendo o guardando URL:", err);
            setFileError("Error al subir la imagen. Inténtelo de nuevo.");
        }
    };

    // Botón que permite ver el comprobante si existe y sino no hace nada.
    const seeReceiptButton = () => {
        if (paymentURL !== '') {
            return (
                <>
                    <button className="button" onClick={() => setReceiptButtonClicked(true)}>
                        Ver comprobante de transferencia
                    </button>
                </>
            )
        }
        return (
            <>
                <p className="reserve-message">Comprobante no disponible</p>
            </>
        )
    }

    const renderPaymentDetails = () => {
        if (!receipt || receipt.payment_method === 'Efectivo') {
            return null;
        }
        
        return (
            <>
                <div className='receipt-item'>
                    <p>CBU:</p>
                    <p>{receipt.seller_cbu}</p>
                </div>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {fileError && <p className="reserve-message">{fileError}</p>}
                {!uploadSuccess   ? (
                    <button className='button' onClick={handleFileClick}>
                        Subir comprobante de transferencia
                    </button>
                ) : (
                    <p className='successful-load'>Imagen subida exitosamente</p>
                )}
            </>
        );
    };

    if (!isAuthenticated) {
        return <NotFound />;
    }

    if (loading) {
        return <Loading />;
    }
    
    if (error || !product) {
        return <NotFound />;
    }

    const isSeller = product.seller_username === user?.username;
    const isReserved = product.id_buyer !== null;
    const isNotTheBuyer = product.id_buyer !== user?.id;

    // 1. Si es el vendedor y no está reservado
    if (isSeller && !isReserved) {
        return <NotFound />;
    }
    
    // 2. Si es el vendedor y está reservado
    if (isSeller && isReserved) {
        return (
            <div className='reserve-wrapper'>
                { receiptButtonClicked ? (
                    <div className="containerReceiptImage">
                        <button className="button" onClick={() => setReceiptButtonClicked(false)} type="button">
                            Volver
                        </button>
                        <img
                            src={paymentURL}
                            alt="Comprobante de transferencia"
                            className="receiptImage"
                        />
                    </div>
                ) : (
                    <div className='reserved-window'>
                        <h1>Comprobante</h1>
                        {receipt ? (
                            <>
                                <p>Mail interesado: {receipt.buyer_email}</p>
                                <p>Nombre del producto: {receipt.product_name}</p>
                                <p>
                                    <a
                                        href={`/products/${product.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver producto asociado
                                    </a>
                                </p>

                                <p>Número de pedido: #{receipt.id}</p>

                                {seeReceiptButton()}
                                {cancelled ? (
                                    <p className="reserve-message">Entrega confirmada</p>
                                ) : (
                                    <button className='button' onClick={handleConfirmSale}>
                                        Confirmar entrega
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>Cargando comprobante...</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
    
    // 3. Si está reservado y no es el comprador
    if (isReserved && isNotTheBuyer) {
        return <NotFound />;
    }
    
    // 4. Si no está reservado
    if (!isReserved) {
        return (
            <div className='reserve-wrapper'>
                <div className='reserve-window'>
                    <h1>Reservar</h1>
                    <p>Seleccionar método de pago:</p>
                    <div className='radio-wrapper'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="Efectivo" 
                            checked={payment === 'Efectivo'} 
                            onChange={(e) => setPayment(e.target.value)}
                        />
                        <p>Efectivo</p>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="Transferencia" 
                            checked={payment === 'Transferencia'} 
                            onChange={(e) => setPayment(e.target.value)}
                        />
                        <p>Transferencia</p>
                    </div>
                    <p>Método de envío:</p>
                    <div className='radio-wrapper'>
                        <input 
                            type="radio" 
                            name="delivery" 
                            value="Retiro por domicilio del vendedor" 
                            checked={delivery === 'Retiro por domicilio del vendedor'} 
                            onChange={(e) => setDelivery(e.target.value)}
                        />
                        <p>Retiro por domicilio del vendedor</p>
                    </div>
                    {reserveMessage && <p className="reserve-message">{reserveMessage}</p>}
                    <button className='button' onClick={handleReserve}>
                        Confirmar reserva
                    </button>
                </div>
            </div>
        );
    }
    
    // 5. Si está reservado y es el comprador
    return (
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
                            <p>{receipt.address}</p>
                        </div>
                        <div className='receipt-item'>
                            <p>Monto a pagar:</p>
                            <p>${receipt.price}</p>
                        </div>
                        <div className='receipt-item'>
                            <p>Método de pago:</p>
                            <p>{receipt.payment_method}</p>
                        </div>
                        {renderPaymentDetails()}
                        {cancelled ? (
                            <p className="reserve-message">La reserva fue cancelada</p>
                        ) : (
                            <button className='button' onClick={handleCancelReserve}>
                                Cancelar reserva
                            </button>
                        )}
                    </>
                ) : (
                    <p>Cargando comprobante...</p>
                )}
            </div>
        </div>
    );
};

export default Reserve;