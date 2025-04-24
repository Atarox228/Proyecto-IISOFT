import './Reserve.css'
import { useAuth } from "../context/AuthContext";
import NotFound from '../NotFound';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, reserveProduct, getSellerInformation } from "../../db/queries.jsx";

const Reserve = () => {
    const { isAuthenticated, user } = useAuth();      
    const { id } = useParams();      

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [seller, setSeller] = useState(null);
    const [reserveMessage, setReserveMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getProductById(id)
          .then(async (data) => {
            if (data) {
              setProduct(data);
              const sellerInfo = await getSellerInformation({ userVendedor: data.seller_username });
              setSeller(sellerInfo);
            } else {
              setError(true);
            }
          })
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      }, [id]);



      const handleReserve = async () => {
        const result = await reserveProduct({ idProducto: product.id, idUsuarioReserva: user.id });
        setReserveMessage(result.message);
      
        if (result.success) {
          const updatedProduct = await getProductById(id);
          setProduct(updatedProduct);
        } else {
            setTimeout(() => {
                navigate("/");
              }, 3000);
        }
      };

    if (loading) return <p>Cargando...</p>;
    if (error || !product) return <NotFound />;

    const isSeller = () => product.seller_username === user.username;

    const isReserved = () => product.id_buyer !== null;

    const isNotTheBuyer = () => product.id_buyer !== user.id;

    

    return (
        <>
            {isAuthenticated && (isSeller() || (isReserved() && isNotTheBuyer())) ? (
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
                            <h1>Reservado</h1>
                            <p>¡Gracias por confirmar tu reserva!</p>
                            <p>mail vendedor: {seller.email}</p>
                            <p>Ubicación de retiro: {product.location}</p>
                            <p>precio: ${product.price}</p>                            
                        </div>
                    </div>
                )
            )}
        </>
    );
}

export default Reserve;