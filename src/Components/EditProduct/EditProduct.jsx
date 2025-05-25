import './EditProduct.css'
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../db/queries.jsx";
import Loading from "../Loading/Loading.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const EditProduct = () => {
  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(id);
        
        // Verificar que el usuario sea el vendedor del producto
        if (productData.seller_username !== user?.username) {
          navigate('/'); // Redirigir si no es el vendedor
          return;
        }
        
        setProduct(productData);
        setPrecio(productData.price.toString());
        setUbicacion(productData.location);
        setDescripcion(productData.description);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
        navigate('/');
      }
    };
    
    if (user) {
      loadProduct();
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productBody = {
      id: parseInt(id),
      location: ubicacion,
      price: parseFloat(precio),
      description: descripcion
    };

    try {
      await updateProduct(productBody);
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h3>Editar publicación</h3>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <p>Juego:</p>
            <input
              value={product.Juegos.name}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          
          <div className='form-item'>
            <p>Precio:</p>
            <input
              placeholder="Ingresá el precio del producto"
              value={precio}
              onChange={(e) => {
                if (e.target.value === "" || /^\d+(\.\d+)?$/.test(e.target.value)) {
                  setPrecio(e.target.value);
                }
              }}
              required
            />
          </div>

          <div className='form-item'>
            <p>Ubicación:</p>
            <input
              placeholder="Ingresá la ubicación del producto"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>

          <div className='textarea-container'>
            <p>Descripción:</p>
            <textarea
              className="lined-textarea"
              placeholder="Ingresá la descripción del producto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={6}
              required
            />
          </div>
          
          <div className="button-container">
            <button className="cancel-button" type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="create-button" type="submit">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;