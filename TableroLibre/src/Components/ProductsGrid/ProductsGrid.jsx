import ProductCard from '../ProductCard/ProductCard';
import './ProductsGrid.css'
import {useNavigate} from "react-router";

const ProductsGrid = ({products}) => {

    const navigate = useNavigate();

    return (
        <div className='productsgrid-wrapper'>         
          {products &&
          products.map((product,index) => (            
              <ProductCard key={index} product={product}
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