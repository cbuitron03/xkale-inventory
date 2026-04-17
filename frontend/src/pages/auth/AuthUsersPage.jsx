import { useState, useEffect } from 'react';
import { getUsers, registerUser, changePassword, toggleUser } from '../../api/auth';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, KeyRound, Power, RefreshCw, ShieldCheck } from 'lucide-react';

const EMPTY_USER = { username: '', email: '', password: '', rol: 'inventario' };
const ROLES = ['admin', 'tecnico', 'inventario'];

export default function AuthUsersPage() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modalNew, setModalNew] = useState(false);
  const [modalPwd, setModalPwd] = useState(null);
  const [form,     setForm]     = useState(EMPTY_USER);
  const [newPwd,   setNewPwd]   = useState('');
  const [saving,   setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    getUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await registerUser(form);
      setModalNew(false);
      setForm(EMPTY_USER);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await changePassword({ username: modalPwd, new_password: newPwd });
      setModalPwd(null);
      setNewPwd('');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (username) => {
    if (!confirm(`¿Cambiar estado del usuario "${username}"?`)) return;
    await toggleUser(username);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Administración</p>
          <h1 className="text-white text-2xl font-black">Gestión de Accesos</h1>
          <p className="text-muted text-sm mt-1">{users.length} usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          <Button icon={Plus} onClick={() => { setForm(EMPTY_USER); setModalNew(true); }}>Nuevo Acceso</Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-muted text-sm text-center py-10">Cargando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Usuario</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th>Creado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(u => (
              <Tr key={u.id_auth}>
                <Td className="text-muted font-mono text-xs">#{u.id_auth}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-glow border border-primary border-opacity-30 flex items-center justify-center shrink-0">
                      <ShieldCheck size={14} className="text-primary" />
                    </div>
                    <p className="text-white font-medium">{u.username}</p>
                  </div>
                </Td>
                <Td className="text-secondary text-sm">{u.email || '—'}</Td>
                <Td><Badge value={u.rol} /></Td>
                <Td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${u.activo ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </Td>
                <Td className="text-xs text-muted">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('es-EC') : '—'}
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setModalPwd(u.username); setNewPwd(''); }}
                      className="p-1.5 rounded-lg text-muted hover:text-warning hover:bg-warning-bg transition-all"
                      title="Cambiar contraseña"
                    >
                      <KeyRound size={14} />
                    </button>
                    <button
                      onClick={() => handleToggle(u.username)}
                      className={`p-1.5 rounded-lg transition-all ${u.activo ? 'text-muted hover:text-danger hover:bg-danger-bg' : 'text-muted hover:text-success hover:bg-success-bg'}`}
                      title={u.activo ? 'Desactivar' : 'Activar'}
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal Nuevo Usuario */}
      <Modal open={modalNew} onClose={() => setModalNew(false)} title="Nuevo Acceso al Sistema" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="usuario_xkale" required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="usuario@xkale.com" />
          <Input label="Contraseña" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary uppercase tracking-wide">Rol</label>
            <select
              value={form.rol}
              onChange={e => setForm({...form, rol: e.target.value})}
              className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalNew(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear acceso</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal open={!!modalPwd} onClose={() => setModalPwd(null)} title={`Cambiar contraseña — ${modalPwd}`} size="sm">
        <form onSubmit={handleChangePwd} className="space-y-4">
          <Input label="Nueva contraseña" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalPwd(null)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Cambiar contraseña</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
