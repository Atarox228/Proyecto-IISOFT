import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductsGrid.css'
import {useNavigate} from "react-router-dom";

const ProductsGrid = ({products, isResultEmpty}) => {

    const navigate = useNavigate();

    return (
        <div className='productsgrid-wrapper'>
            {isResultEmpty ? (
                <>
                    <h1 className="emptyResults">No se ha encontrado ningún resultado</h1>
                </>
            ) : (
                <>
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
                </>
            )}

        </div>
    )
}

export default ProductsGrid;