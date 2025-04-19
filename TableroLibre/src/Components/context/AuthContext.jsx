import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../../supabase-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Comprobar sesión actual con Supabase
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session) {
        // Si hay sesión activa, obtenemos el perfil completo
        const { data: profileData } = await supabase
          .from('perfiles')
          .select('*')
          .eq('email', sessionData.session.user.email)
          .single();
          
        if (profileData) {
          setUser(profileData);
          localStorage.setItem('user', JSON.stringify(profileData));
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Suscripción a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Al iniciar sesión, obtenemos el perfil
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (profileData) {
            setUser(profileData);
            localStorage.setItem('user', JSON.stringify(profileData));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (username, password) => {
    try {
      // Primero verificamos el usuario en la tabla perfiles
      const { data: profileData, error: profileError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
        
      if (profileError || !profileData) {
        throw new Error('Usuario o contraseña incorrectos');
      }
      
      // Si encontramos el perfil, intentamos iniciar sesión con Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: password
      });
      
      if (authError) {
        // Si falla el login con Supabase Auth, usamos solo el perfil
        console.warn("Error en Supabase Auth, usando solo perfil:", authError.message);
      }
      
      // Guardamos el usuario en el estado y localStorage
      setUser(profileData);
      localStorage.setItem('user', JSON.stringify(profileData));
      
      return { success: true, user: profileData };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, username, password) => {
    try {
      // Verificamos si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('perfiles')
        .select('*')
        .or(`email.eq.${email},username.eq.${username}`)
        .single();
        
      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error('Este correo electrónico ya está registrado');
        }
        if (existingUser.username === username) {
          throw new Error('Este nombre de usuario ya está registrado');
        }
      }
      
      // Registramos en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (authError) throw authError;
      
      // Registramos en la tabla perfiles
      const { error: profileError } = await supabase
        .from('perfiles')
        .insert([{
          email,
          username,
          password
        }]);
        
      if (profileError) throw profileError;
      
      return { success: true };
    } catch (error) {
      console.error("Error al registrar:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};