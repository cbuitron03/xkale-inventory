import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await loginApi(username, password);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify({ username: data.username, rol: data.rol }));
    setUser({ username: data.username, rol: data.rol });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin         = user?.rol === 'admin';
  const isTecnico       = user?.rol === 'tecnico';
  const isInventario    = user?.rol === 'inventario';
  const canManageUsers  = isAdmin;
  const canCreateTicket = isAdmin || isTecnico;
  const canCreateLaptop = isAdmin || isInventario;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isTecnico, isInventario, canManageUsers, canCreateTicket, canCreateLaptop }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
