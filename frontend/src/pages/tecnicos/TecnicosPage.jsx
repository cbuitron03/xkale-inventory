import { useState, useEffect } from 'react';
import { getTecnicos, createTecnico, updateTecnico, deleteTecnico } from '../../api/tecnicos';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Pencil, Trash2, Search, RefreshCw, Mail, Wrench } from 'lucide-react';

const EMPTY = { tecnico_nombre: '', tecnico_correo: '' };

export default function TecnicosPage() {
  const { isAdmin } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    getTecnicos().then(setTecnicos).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (t) => { setEditing(t); setForm({ tecnico_nombre: t.tecnico_nombre, tecnico_correo: t.tecnico_correo }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateTecnico(editing.id_tecnico, form);
      else         await createTecnico(form);
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este técnico?')) return;
    setDeleting(id);
    try { await deleteTecnico(id); load(); }
    finally { setDeleting(null); }
  };

  const filtered = tecnicos.filter(t =>
    [t.tecnico_nombre, t.tecnico_correo]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Soporte</p>
          <h1 className="text-white text-2xl font-black">Técnicos</h1>
          <p className="text-muted text-sm mt-1">{tecnicos.length} técnicos registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          {isAdmin && <Button icon={Plus} onClick={openCreate}>Nuevo Técnico</Button>}
        </div>
      </div>

      {/* Search */}
      <Card className="flex items-center gap-3 py-3">
        <Search size={16} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
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
              <Th>Técnico</Th>
              <Th>Correo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={4} className="text-center text-muted py-10">No hay técnicos registrados</Td></Tr>
            ) : filtered.map(t => (
              <Tr key={t.id_tecnico}>
                <Td className="text-muted font-mono text-xs">#{t.id_tecnico}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning-bg border border-warning border-opacity-30 flex items-center justify-center shrink-0">
                      <Wrench size={14} className="text-warning" />
                    </div>
                    <p className="text-white font-medium">{t.tecnico_nombre}</p>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-muted" />
                    <span className="text-secondary text-sm">{t.tecnico_correo || '—'}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-bg transition-all">
                      <Pencil size={14} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(t.id_tecnico)} disabled={deleting === t.id_tecnico} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-all">
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
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Técnico' : 'Nuevo Técnico'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nombre completo" value={form.tecnico_nombre} onChange={e => setForm({...form, tecnico_nombre: e.target.value})} placeholder="Carlos Rodríguez" required />
          <Input label="Correo" type="email" value={form.tecnico_correo} onChange={e => setForm({...form, tecnico_correo: e.target.value})} placeholder="carlos@xkale.com" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear técnico'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
