import { useState } from 'react';
import './SearchBar.css';
import diceIcon from '../../assets/dices-icon.png';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  // Opciones para los selectores
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'cartas', label: 'Cartas' },
    { value: 'dados', label: 'Dados' },
    { value: 'tablero', label: 'Tablero' }
  ];

  const durationOptions = [
    { value: '', label: 'Cualquier duración' },
    { value: '15_', label: 'Menor a 15 minutos' },
    { value: '15-45', label: 'De 15 a 45 minutos' },
    { value: '45+', label: 'Mayor a 45 minutos' }
  ];

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tipo de filtros (Se pueden agregar los demas)
    const searchParams = {
      query: searchQuery,
      category: selectedCategory,
      duration: selectedDuration
    };
    // Llamar a la función de búsqueda pasada como prop
    if (onSearch) onSearch(searchParams);
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
        
        <div className="search-filters">
          <div className="filter-group">
            <label>Categoría:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group"> 
            <label>Duración de juego:</label>
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;