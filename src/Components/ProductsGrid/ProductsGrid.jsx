import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductsGrid.css'
import {useNavigate} from "react-router-dom";

const ProductsGrid = ({products}) => {

    const navigate = useNavigate();

    return (
        <div className='productsgrid-wrapper'>         
          {products &&
          products.map((product) => (
                <ProductCard key={product.id} product={product}
                           onClick={() => {
                               console.log("Producto clickeado:", product);
                               navigate(`products/${product.id}`);
                           }}
              />
          ))
          }
        </div>
    )
}

export default ProductsGrid;