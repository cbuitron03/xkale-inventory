import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Laptop, Ticket, Users,
  Wrench, ShieldCheck, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard, roles: ['admin','tecnico','inventario'] },
  { to: '/laptops',    label: 'Laptops',    icon: Laptop,          roles: ['admin','tecnico','inventario'] },
  { to: '/tickets',    label: 'Tickets',    icon: Ticket,          roles: ['admin','tecnico','inventario'] },
  { to: '/usuarios',   label: 'Usuarios',   icon: Users,           roles: ['admin','inventario'] },
  { to: '/tecnicos',   label: 'Técnicos',   icon: Wrench,          roles: ['admin'] },
  { to: '/auth-users', label: 'Accesos',    icon: ShieldCheck,     roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = navItems.filter(i => i.roles.includes(user?.rol));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <span className="text-primary font-black text-xl tracking-widest">XKALE™</span>
        <p className="text-muted text-xs mt-0.5 tracking-wider uppercase">Inventory System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filtered.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-primary-glow text-primary border border-primary border-opacity-30'
                : 'text-secondary hover:text-white hover:bg-elevated'
            )}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-elevated">
          <div className="w-8 h-8 rounded-full bg-primary-glow border border-primary border-opacity-30 flex items-center justify-center">
            <span className="text-primary text-xs font-bold uppercase">{user?.username?.[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.username}</p>
            <p className="text-muted text-xs capitalize">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-danger hover:bg-danger-bg transition-all"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border rounded-lg p-2 text-secondary"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-40 w-64 bg-dark border-r border-border transition-transform duration-200 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-dark border-r border-border h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
