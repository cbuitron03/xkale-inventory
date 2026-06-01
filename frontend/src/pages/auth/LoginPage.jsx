import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #6AE000 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/xkale_logo.png" alt="Xkale" className="w-48 h-auto mx-auto mb-3" />
          <p className="text-muted text-sm tracking-wider uppercase">Inventory System</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-1">Iniciar sesión</h2>
          <p className="text-muted text-sm mb-6">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="flex items-center gap-2 bg-danger-bg border border-danger border-opacity-30 rounded-lg px-3 py-2.5 mb-4">
              <AlertCircle size={16} className="text-danger shrink-0" />
              <span className="text-danger text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="Tu Usuario"
                  required
                  className="w-full bg-elevated border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-elevated border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-black font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          © 2026 Xkale™ · Sistema de Inventario IT
        </p>
      </div>
    </div>
  );
}