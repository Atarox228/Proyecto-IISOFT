import { useEffect, useState } from 'react';
import './SearchBar.css';
import diceIcon from '../../assets/dices-icon.png';
import {cantidadJugadoresUnicas} from "../../db/queries.jsx";
import supabase from '../../supabase-client.js';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState('');
  //Aca agrego un options para tomar lo de la base de datos
  const [playersOptions, setPlayersOptions] = useState([]);

  // Opciones para los selectores
  const categoryOptions = [
    { value: '', label: 'Todas' },
    { value: 'cartas', label: 'Cartas' },
    { value: 'dados', label: 'Dados' },
    { value: 'tablero', label: 'Tablero' }
  ];

  const durationOptions = [
    { value: '', label: 'Todas' },
    { value: '15_', label: "0-15'" },
    { value: '15-45', label: "15'-45'" },
    { value: '45+', label: "45'+" }
  ];

  const ageOptions = [
    { value: '', label: 'Todas' },
    { value: '8_', label: '0-8' },
    { value: '8-16', label: '8-16' },
    { value: '16+', label: '16+' }
  ];
  
  // PARA EL FILTRADO DE CANTIDA DE JUGADORES NECESITE SI O SI CONECTAR CON SUPABASE POR LO TANTO queries
  useEffect(() => {
    const fetchCantJugadores = async () => {
      const data = await cantidadJugadoresUnicas();

      const options = data.map(num => ({
        value: num,
        label: `${num}`
      }));

      setPlayersOptions([{ value: '', label: 'Todos' }, ...options]);
    };
    
    fetchCantJugadores();
  }, []);


  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tipo de filtros (Se pueden agregar los demas)
    const searchParams = {
      query: searchQuery,
      category: selectedCategory,
      duration: selectedDuration,
      age: selectedAge,
      players: selectedPlayers
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
            <label>Duración:</label>
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

          <div className="filter-group"> 
            <label>Edad:</label>
            <select 
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
            >
              {ageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group"> 
            <label>Jugadores:</label>
            <select 
              value={selectedPlayers}
              onChange={(e) => setSelectedPlayers(e.target.value)}
            >
              {playersOptions.map(option => (
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