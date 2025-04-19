import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from "../supabase-client.js";
import './Estilos/Login.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Puede ser email o username
  const [password, setPassword] = useState('');
  
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateIdentifier = () => {
    if (!identifier) {
      setIdentifierError('El usuario o email es obligatorio');
      return false;
    }
    setIdentifierError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Evitar múltiples envíos
    if (loading) return;
    
    // Validar campos
    const isIdentifierValid = validateIdentifier();
    const isPasswordValid = validatePassword();
    
    if (!isIdentifierValid || !isPasswordValid) {
      return;
    }
    
    try {
      setLoading(true);
      setFormError('');
      
      // Verificar si es email o username
      const isEmail = identifier.includes('@');
      let email = identifier;
      
      // Si es username, buscar el email asociado
      if (!isEmail) {
        const { data: userData, error: userError } = await supabase
          .from('perfiles')
          .select('email')
          .eq('username', identifier)
          .single();
        
        if (userError || !userData) {
          setFormError('Usuario no encontrado');
          return;
        }
        
        email = userData.email;
      }
      
      // Iniciar sesión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password
      });
      
      if (error) {
        console.error("Error de inicio de sesión:", error);
        setFormError('Credenciales inválidas');
        return;
      }
      
      // Si el inicio de sesión es exitoso
      // Redirigir al usuario a la página principal
      navigate('/');
      
    } catch (error) {
      console.error("Error general:", error);
      setFormError('Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title">Iniciar sesión</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">Usuario o Email</label>
            <input
              type="text"
              id="identifier"
              placeholder="Ingresá tu usuario o email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onBlur={validateIdentifier}
              className={identifierError ? 'input-error' : ''}
            />
            {identifierError && <p className="error-message">{identifierError}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresá contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          
          {formError && <p className="form-error">{formError}</p>}
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="register-link">
          ¿No estas registrado? <a href="/registro">registrate acá</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;