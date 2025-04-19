import React, { useState } from 'react';
import supabase from "../supabase-client.js";
import './Estilos/Registro.css';
import { useNavigate } from 'react-router';

const RegistroPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');   
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateEmail = async (checkDatabase = false) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('El email es obligatorio');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Email inválido');
            return false;
        }
        
        // Verificar duplicados solo cuando se envía el formulario para evitar consultas excesivas
        if (checkDatabase) {
            try {
                // Verificar si el email ya existe en la tabla de perfiles
                const { data, error } = await supabase
                    .from('perfiles')
                    .select('email')
                    .eq('email', email)
                    .single();
                    
                if (data) {
                    setEmailError('Este correo electrónico ya está registrado');
                    return false;
                }
            } catch (error) {
                // El error single() cuando no hay coincidencias es esperado, no es un error real
                if (!error.message.includes("No rows found")) {
                    console.error("Error al verificar email:", error);
                }
            }
        }
        
        setEmailError('');
        return true;
    };

    const validateUsername = async (checkDatabase = false) => {
        if (!username) {
            setUsernameError('El nombre de usuario es obligatorio');
            return false;
        } else if (username.length < 5 || username.length > 15) {
            setUsernameError('El usuario debe tener entre 5 y 15 caracteres');
            return false;
        }
        
        // Verificar duplicados solo cuando se envía el formulario
        if (checkDatabase) {
            try {
                const { data, error } = await supabase
                    .from('perfiles')
                    .select('username') 
                    .eq('username', username)
                    .single();
                    
                if (data) {
                    setUsernameError('El nombre de usuario ya ha sido registrado');
                    return false;
                }
            } catch (error) {
                // El error single() cuando no hay coincidencias es esperado
                if (!error.message.includes("No rows found")) {
                    console.error("Error al verificar username:", error);
                }
            }
        }
        
        setUsernameError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        } else if (password.length < 8 || password.length > 16) {
            setPasswordError('La contraseña debe tener entre 8 y 16 caracteres');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Evitar múltiples envíos
        if (loading) return;

        try {
            setLoading(true);
            setFormError('');

            // Validar todos los campos
            const isEmailValid = await validateEmail(true);
            const isUsernameValid = await validateUsername(true);
            const isPasswordValid = validatePassword();

            if (!isEmailValid || !isUsernameValid || !isPasswordValid) {
                return;
            }
            
            // 1. Registrar usuario en la autenticación de Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { 
                        username: username,
                    },
                },
            });

            if (error) {
                console.error("Error en signUp:", error);
                if (error.message.includes('email')) {
                    setEmailError(error.message);
                } else {
                    setFormError(error.message);
                }
                return;
            }

            if (data.user) {
                // 2. Crear perfil asociado al usuario
                const { error: profileError } = await supabase
                    .from('perfiles')
                    .insert([{
                        id: data.user.id,
                        email: email,
                        username: username,
                        created_at: new Date()
                    }]);
                
                if (profileError) {
                    console.error("Error al crear perfil:", profileError);
                    setFormError('Error al crear el perfil. Intente nuevamente.');
                    return;
                }

                // Limpiar el formulario
                setEmail('');
                setUsername('');
                setPassword('');
                
                // Notificar al usuario
                alert('Registro exitoso. Por favor, verifica tu correo electrónico.');
                navigate('/login');
            }
            
        } catch (error) {
            console.error("Error general:", error);
            setFormError('Error en el registro. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-form-container">
                <h1 className="registro-title">Crear cuenta</h1>
                
                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="form-group">
                        <label htmlFor="email">Mail</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Ingresá mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateEmail(false)}
                            className={emailError ? 'input-error' : ''}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingresá nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => validateUsername(false)}
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
                        {loading ? 'Procesando...' : 'Crear cuenta'}
                    </button>
                </form>
                
                <p className="login-link">
                    ¿Ya estas registrado? <a href="/login">ingresa acá</a>
                </p>
            </div>
        </div>
    );
};

export default RegistroPage;