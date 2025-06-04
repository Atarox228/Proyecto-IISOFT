import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#044070', fontSize: '2.5rem', marginBottom: '20px' }}>
        404 - Página no encontrada
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <button className="create-account-btn" style={{ 
          backgroundColor: '#fbf1e0',
          color: '#024d82',
          padding: '10px 20px',
          border: '2px solid #024d82',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          width: '300px'
        }}>
          Volver a la página principal
        </button>
      </Link>
    </div>
  );
};

export default NotFound;