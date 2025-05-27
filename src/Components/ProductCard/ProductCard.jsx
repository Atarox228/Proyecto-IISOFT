import { useEffect, useState } from 'react';
import './ProductCard.css';
import cards from '../../assets/cards-icon.png';
import dices from '../../assets/dices-icon.png';
import board from '../../assets/board-icon.png';
import reverse from '../../assets/card-reverse.png';
import location from '../../assets/location.png';
import age from '../../assets/age.png';
import duration from '../../assets/duration.png';
import players from '../../assets/players.png';


const ProductCard = ({ product, onClick }) => {
  const [girada, setGirada] = useState(false);  
  const [visible, setVisible] = useState(false);

  const categoryIcons = {
    cartas: cards,
    dados: dices,
    tablero: board,
  };

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setGirada(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="productcard-wrapper" onClick={onClick}>
    <div className="card-container">
      <div className={`card-inner ${girada ? 'girada' : ''}`}>
        <div className="card-front">
          <div className="card">
            <div className="card-header">
              <h3>{product.Juegos.name}</h3>
              <img src={categoryIcons[product.Juegos.category]} className="category-icon" />
            </div>
            <img src={product.Juegos.image_url} alt="product image" className="card-image" />
            <div className="card-characteristics">
              <div className="card-detail">
                <img src={location} className="detail-icon" />
                <p>{product.location}</p>
              </div>
              <div className="card-detail">
                <img src={age} className="detail-icon" />
                <p>{product.Juegos.age}+</p>
              </div>
              <div className="card-detail">
                <img src={duration} className="detail-icon" />
                <p>{product.Juegos.duration}'</p>
              </div>
              <div className="card-detail">
                <img src={players} className="detail-icon" />
                <p>{product.Juegos.players}</p>
              </div>
            </div>
            {product.id_buyer ? (
              <div className="card-footer card-status">
                <h1>RESERVADO</h1>
              </div>
            ) : (
              <div className="card-footer card-price">
                <h1>$ {product.price}</h1>
              </div>
            )}
          </div>
        </div>

        <div className="card-back">
          <div className="card back-face">
            
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );

};

export default ProductCard;
