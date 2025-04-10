import './ProductCard.css'
import cards from '../../assets/cards.png'
import location from '../../assets/location.png'
import age from '../../assets/age.png'
import duration from '../../assets/duration.png'
import players from '../../assets/players.png'


const ProductCard = ({product}) => {
    return (<>
            <div className='productcard-wrapper'> 
                <div className='card'>
                <div className='card-header'>
                    <p>{product.name}</p>    
                    <img src={cards} className='category-icon'/> 
                </div>               
                <img src={product.image_url} alt="product image" className='card-image'/>

                <div className='card-characteristics'></div>
               <div className='card-detail'>
                <img src={location} className='detail-icon'/>
                <p>{product.localization}</p>
               </div>
               <div className='card-detail'>
                <img src={age} className='detail-icon'/>
               <p>{product.age}</p>
               </div>
               <div className='card-detail'>
                <img src={duration} className='detail-icon'/>
               <p>{product.duration}</p>
               </div>
               <div className='card-detail'>
                <img src={players} className='detail-icon'/>
               <p>{product.players}</p>
               </div>
               <div className='card-price'>
                <h1>$ {product.price}</h1>
               </div>
               
               
               
               </div>        
            </div>
         </>)
}

export default ProductCard;