import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from "../supabase-client.js";
import './Estilos/Login.css';

const LoginPage = () => {
  // Estados para los campos del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para manejo de errores
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Validación del nombre de usuario
  const validateUsername = () => {
    if (!username) {
      setUsernameError('El nombre de usuario es obligatorio');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // Validación de la contraseña
  const validatePassword = () => {
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    
    if (!isUsernameValid || !isPasswordValid) {
      return;
    }
    
    try {
      setLoading(true);
      setFormError('');
      
      // Primero, necesitamos obtener el email asociado con el username
      // ya que Supabase Auth requiere email para login, no username
      const { data: userData, error: userError } = await supabase
        .from('perfiles')
        .select('email')
        .eq('username', username)
        .single();
      
      if (userError || !userData) {
        setFormError('Usuario no encontrado');
        setLoading(false);
        return;
      }
      
      // Iniciar sesión con Supabase usando el email obtenido
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password
      });
      
      if (error) {
        setFormError('Credenciales inválidas');
      } else {
        // Guardamos el token en localStorage (Supabase lo hace automáticamente)
        // Pero podemos acceder a él si lo necesitamos
        const token = data.session.access_token;
        
        // Opcional: guardar el token explícitamente si necesitas usarlo
        localStorage.setItem('supabase_token', token);
        
        // Redireccionar a la página principal o dashboard
        navigate('/Home');
      }
    } catch (error) {
      setFormError('Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo.');
      console.error(error);
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
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Ingresá nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={validateUsername}
              className={usernameError ? 'input-error' : ''}
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
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
          ¿No estas registrado? <a href="/Registro">registrate acá</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;