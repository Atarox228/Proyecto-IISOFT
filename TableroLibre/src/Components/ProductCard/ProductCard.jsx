import './ProductCard.css'
import category from '../../assets/category.png'
import uno from '../../assets/uno.png'

const ProductCard = () => {
    return (<>
            <div className='productcard-wrapper'> 
                <div className='card'>
                <div className='card-header'>
                    <p>NOMBRE</p>    
                    <img src={category} className='category-icon'/> 
                </div>               
                <img src={uno} className='card-image'/>

                <div className='card-characteristics'></div>
               <div className='card-detail'>
               <p>LOCALIZACION</p>
               </div>
               <div className='card-detail'>
               <p>EDAD</p>
               </div>
               <div className='card-detail'>
               <p>DURACION</p>
               </div>
               <div className='card-detail'>
               <p>JUGADORES</p>
               </div>
               <div className='card-price'>
                <h1>$999</h1>
               </div>
               
               
               
               </div>        
            </div>
         </>)
}

export default ProductCard;