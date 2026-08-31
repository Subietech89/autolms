import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await pb.collection('users').authWithPassword(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
