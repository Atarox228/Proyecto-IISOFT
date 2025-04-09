import './ProductCard.css'
import category from '../../assets/category.png'
import uno from '../../assets/uno.png'

const ProductCard = ({product}) => {
    return (<>
            <div className='productcard-wrapper'> 
                <div className='card'>
                <div className='card-header'>
                    <p>{product.name}</p>    
                    <img src={category} className='category-icon'/> 
                </div>               
                <img src={product.image_url} alt="product image" className='card-image'/>

                <div className='card-characteristics'></div>
               <div className='card-detail'>
               <p>{product.localization}</p>
               </div>
               <div className='card-detail'>
               <p>{product.age}</p>
               </div>
               <div className='card-detail'>
               <p>{product.duration}</p>
               </div>
               <div className='card-detail'>
               <p>{product.players}</p>
               </div>
               <div className='card-price'>
                <h1>{product.price}</h1>
               </div>
               
               
               
               </div>        
            </div>
         </>)
}

export default ProductCard;