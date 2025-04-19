import React from 'react';
import { Link } from 'react-router';

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
          backgroundColor: '#0099ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Volver a la página principal
        </button>
      </Link>
    </div>
  );
};

export default NotFound;