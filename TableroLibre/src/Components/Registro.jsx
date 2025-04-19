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
    const [Loading, setLoading] = useState(false);

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
        if (checkDatabase) {
            try {
            // Primero verificamos en la tabla de autenticación
            const { data, error } = await supabase.auth.admin.listUsers({
                filter: {
                email: email
                }
            });
            
            // Si encontramos usuarios con ese email, está en uso
            if (data && data.users && data.users.length > 0) {
                setEmailError('Este correo electrónico ya está registrado');
                return false;
            }
            
            const { data: profileData, error: profileError } = await supabase
                .from('perfiles')
                .select('email')
                .eq('email', email)
                .single();
                
            if (profileData) {
                setEmailError('Este correo electrónico ya está registrado');
                return false;
            }
            } catch (error) {
            console.error("Error al verificar email:", error);
            }
        }
        
        setEmailError('');
        return true;
    };

    const validateUsername = async (checkDatabase = false) => {
        if (!username) {
            setUsernameError('El nombre de usuario es obligatorio');
            return false;
        } else if (username.length <= 5 && username.length >= 15) {
            setUsernameError('El usuario no contiene la cantidad minima/maxima de caracteres');
            return false;
        }
        // Verificar si el username ya existe en la base de datos
        if (checkDatabase) {
            try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('username') 
                .eq('username', username)
                .single();
                
            if (data) {
                setUsernameError('El nombre de usuario ya a sido registrado');
                return false;
            }
            } catch (error) {
            console.error("Error al verificar username:", error);
            }
        }
        
        setUsernameError('');
        return true;
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        } else if (password.length < 8 || password.length > 16) {
            setPasswordError('La contraseña debe tener entre 8 y 16 caracteres');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setFormError('');

            const isPasswordValid = validatePassword(password);

            const isUsernameValid = validateUsername(true);
            const isEmailValid = validateEmail(true);
            

            if (!isUsernameValid || !isPasswordValid || !isEmailValid) {
                setLoading(false);
                return;
            }
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                },
            });

            if (error) {
                if(error.message.includes('email')){
                    setEmailError(error.message);
                } else if (error.message.includes('username')){
                    setUsernameError(error.message);
                } else{
                    setFormError(error.message);
                }
                setLoading(false);
                return;
            }

            const { error: profileError } = await supabase
                .from('perfiles')
                .insert([{
                    email,
                    username,
                    password
                }]);
            
            if (profileError) {
                setFormError(profileError.message);
                setLoading(false);
                return;
            }

            alert('Registro exitoso');
            navigate('/Login');
            
        } catch (error) {
            setFormError('Error en el registro. Intente nuevamente.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Validadores para eventos onBlur (cuando el usuario sale del campo)
    const handleEmailBlur = () => validateEmail(false);
    const handleUsernameBlur = () => validateUsername(false);
    const handlePasswordBlur = () => validatePassword();

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
                        onBlur={handleEmailBlur}
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
                        onBlur={handleUsernameBlur}
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
                        onBlur={handlePasswordBlur}
                        className={passwordError ? 'input-error' : ''}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    
                    {formError && <p className="form-error">{formError}</p>}
                    
                    <button 
                        type="submit" 
                        className="create-account-btn"
                        disabled={Loading}
                    >
                        {Loading ? 'Procesando...' : 'Crear cuenta'}
                    </button>
                </form>
                
                <p className="login-link">
                ¿Ya estas registrado? <a href="/Login">ingresa acá</a>
                </p>
            </div>
        </div>
    );
};

export default RegistroPage;