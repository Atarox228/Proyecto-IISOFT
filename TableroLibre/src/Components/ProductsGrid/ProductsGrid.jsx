import ProductCard from '../ProductCard/ProductCard';
import './ProductsGrid.css'

const ProductsGrid = ({products}) => {
    return (
        <div className='productsgrid-wrapper'>         
          {products &&
          products.map((product,index) => (            
              <ProductCard key={product.id + index} product={product}/> 
            
          ))
          
          }
               
        </div>
    )
}

export default ProductsGrid;