import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';

// Lazy pages
import { lazy, Suspense } from 'react';
const DashboardPage  = lazy(() => import('./pages/dashboard/DashboardPage'));
const LaptopsPage    = lazy(() => import('./pages/laptops/LaptopsPage'));
const TicketsPage    = lazy(() => import('./pages/tickets/TicketsPage'));
const UsuariosPage   = lazy(() => import('./pages/usuarios/UsuariosPage'));
const TecnicosPage   = lazy(() => import('./pages/tecnicos/TecnicosPage'));
const AuthUsersPage  = lazy(() => import('./pages/auth/AuthUsersPage'));

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-muted">Cargando...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Suspense fallback={<Loader />}><DashboardPage /></Suspense>} />
        <Route path="laptops"    element={<Suspense fallback={<Loader />}><LaptopsPage /></Suspense>} />
        <Route path="tickets"    element={<Suspense fallback={<Loader />}><TicketsPage /></Suspense>} />
        <Route path="usuarios"   element={
          <ProtectedRoute roles={['admin','inventario']}>
            <Suspense fallback={<Loader />}><UsuariosPage /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="tecnicos"   element={
          <ProtectedRoute roles={['admin']}>
            <Suspense fallback={<Loader />}><TecnicosPage /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="auth-users" element={
          <ProtectedRoute roles={['admin']}>
            <Suspense fallback={<Loader />}><AuthUsersPage /></Suspense>
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full text-muted text-sm">
      Cargando...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
