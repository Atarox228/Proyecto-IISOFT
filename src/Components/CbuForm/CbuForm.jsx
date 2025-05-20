import { useState } from 'react';
import './CbuForm.css';

const CbuForm = ({ onCbuSubmit }) => {
  const [cbu, setCbu] = useState('');
  const [error, setError] = useState('');

  // Función para validar el CBU
  const validateCBU = (cbu) => {
    // Validación básica: CBU debe tener 22 dígitos numéricos
    const cbuRegex = /^\d{22}$/;
    return cbuRegex.test(cbu);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!cbu.trim()) {
      return; // El navegador mostrará el mensaje "Rellena este campo"
    }
    
    if (!validateCBU(cbu)) {
      setError('Ingrese un CBU válido');
      return;
    }
    
    // CBU válido, enviamos al componente padre
    setError('');
    onCbuSubmit(cbu);
  };

  return (
    <div className="cbu-form-container">
      <div className="cbu-form">
        <h3>Ingresa tu CBU</h3>
        <p>Para poder recibir pagos por transferencia, necesitamos tu Clave Bancaria Uniforme (CBU).</p>
        <p>Solo deberás ingresarlo una vez.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cbu">CBU (22 dígitos):</label>
            <input
              id="cbu"
              type="text"
              value={cbu}
              onChange={(e) => setCbu(e.target.value)}
              placeholder="Ej: 0000000000000000000000"
              maxLength={22}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="submit-cbu-btn">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default CbuForm;