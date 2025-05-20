import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import './Estilos/Registro.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    let location = useLocation();

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateUsername = () => {
        if (!username) {
            setUsernameError('El nombre de usuario es obligatorio');
            return false;
        }
        setUsernameError('');
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

    const handleLocation = () => {
        if (location.state?.id) {
            let id = location.state?.id
            navigate('/Registro', { state: { id: id } });;  
          } else {
            navigate("/Registro");     
          }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setFormError('');

            const isUsernameValid = validateUsername();
            const isPasswordValid = validatePassword();

            if (!isUsernameValid || !isPasswordValid) {
                setLoading(false);
                return;
            }

            // Utilizar el método login del AuthContext
            const { success, error } = await login(username, password);

            if (!success) {
                setFormError(error || 'Usuario o contraseña incorrectos');
                setLoading(false);
                return;
            }

            if (location.state?.id) {
                navigate(`/products/${location.state?.id}`);
                window.location.reload();
              } else {
                navigate("/");         
                window.location.reload();  
              }
            
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setFormError('Error al iniciar sesión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-form-container">
                <h1 className="registro-title">Iniciar sesión</h1>
                
                <form onSubmit={handleSubmit} className="registro-form">
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
                        className="create-account-btn"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Ingresar'}
                    </button>
                </form>
                
                <p className="login-link">
                    ¿No estas registrado? <a onClick={handleLocation}>registrate acá</a>
                </p>
            </div>
        </div>
    );
};

export default Login;