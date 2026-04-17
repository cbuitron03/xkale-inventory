import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../api/usuarios';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Pencil, Trash2, Search, RefreshCw, Mail } from 'lucide-react';

const EMPTY = { nombre: '', apellido: '', correo: '' };

export default function UsuariosPage() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    getUsuarios().then(setUsuarios).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (u) => { setEditing(u); setForm({ nombre: u.nombre, apellido: u.apellido, correo: u.correo }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateUsuario(editing.id_usuario, form);
      else         await createUsuario(form);
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    setDeleting(id);
    try { await deleteUsuario(id); load(); }
    finally { setDeleting(null); }
  };

  const filtered = usuarios.filter(u =>
    [u.nombre, u.apellido, u.correo]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Directorio</p>
          <h1 className="text-white text-2xl font-black">Usuarios</h1>
          <p className="text-muted text-sm mt-1">{usuarios.length} usuarios registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          {isAdmin && <Button icon={Plus} onClick={openCreate}>Nuevo Usuario</Button>}
        </div>
      </div>

      {/* Search */}
      <Card className="flex items-center gap-3 py-3">
        <Search size={16} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, apellido o correo..."
          className="flex-1 bg-transparent text-white placeholder-muted outline-none text-sm"
        />
      </Card>

      {/* Table */}
      {loading ? (
        <p className="text-muted text-sm text-center py-10">Cargando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Nombre</Th>
              <Th>Correo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={4} className="text-center text-muted py-10">No hay usuarios registrados</Td></Tr>
            ) : filtered.map(u => (
              <Tr key={u.id_usuario}>
                <Td className="text-muted font-mono text-xs">#{u.id_usuario}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-glow border border-primary border-opacity-30 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold uppercase">{u.nombre?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.nombre} {u.apellido}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-muted" />
                    <span className="text-secondary text-sm">{u.correo || '—'}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-bg transition-all">
                      <Pencil size={14} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(u.id_usuario)} disabled={deleting === u.id_usuario} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Usuario' : 'Nuevo Usuario'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Juan" required />
          <Input label="Apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} placeholder="Pérez" required />
          <Input label="Correo" type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} placeholder="juan@xkale.com" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear usuario'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
