import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { studentService } from '@/api/dataService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Safety timeout: Never stay stuck for more than 5 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoadingAuth(false);
    }, 5000);

    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(user);
          setIsAuthenticated(true);
          const studentData = await studentService.getByUserId(user.id);
          setStudent(studentData);
        }
      } catch (err) {
        console.error('Auth boot error:', err);
      } finally {
        setIsLoadingAuth(false);
        clearTimeout(safetyTimeout);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);

        if (currentUser) {
          try {
            const studentData = await studentService.getByUserId(currentUser.id);
            setStudent(studentData);
          } catch (err) {
            console.error('Auth change student fetch error:', err);
          }
        } else {
          setStudent(null);
        }

        setIsLoadingAuth(false);
        clearTimeout(safetyTimeout);
      }
    );

    return () => {
      subscription?.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setAuthError({ type: 'login_error', message: err.message });
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    try {
      setAuthError(null);
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      if (authError) throw authError;

      // Student record will be created automatically by the auth state change listener
      return authData;
    } catch (err) {
      setAuthError({ type: 'signup_error', message: err.message });
      throw err;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setStudent(null);
      setIsAuthenticated(false);
    } catch (err) {
      setAuthError({ type: 'logout_error', message: err.message });
      throw err;
    }
  };

  const navigateToLogin = () => {
    // For now, just clear auth state
    // You can implement a custom login page later
    setAuthError({ type: 'auth_required', message: 'Please log in to continue' });
  };

  const checkAppState = async () => {
    // Compatibility method for existing code
    // In Supabase, this is handled by the auth state listener
    return;
  };

  const appPublicSettings = null; // Not needed with Supabase

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        login,
        signup,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
