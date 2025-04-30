import { useState } from 'react';
import './SearchBar.css';
import diceIcon from '../../assets/dices-icon.png';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Llamar a la función de búsqueda pasada como prop
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <div className="search-container">
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-field">
          <input 
            type="text" 
            placeholder="Buscar juego..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Buscar</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;