import { useState, useEffect } from 'react';
import { getLaptops, createLaptop, updateLaptop, deleteLaptop } from '../../api/laptops';
import { getUsuarios } from '../../api/usuarios';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Laptop, RefreshCw } from 'lucide-react';

const EMPTY = {
  usu_id_laptop: '', serial: '', marca: '', modelo: '', cpu: '',
  gpu: '', ram: '', disco: '', pantalla: '', no_factura: '',
  fecha_compra: '', hostname: '',
};

export default function LaptopsPage() {
  const { canCreateLaptop, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [laptops,   setLaptops]   = useState([]);
  const [usuarios,  setUsuarios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getLaptops(), getUsuarios()])
      .then(([l, u]) => { setLaptops(l); setUsuarios(u); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (l) => {
    setEditing(l);
    setForm({
      ...l,
      usu_id_laptop: l.usu_id_laptop ?? '',
      fecha_compra:  l.fecha_compra  ?? '',
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        usu_id_laptop: form.usu_id_laptop ? Number(form.usu_id_laptop) : null,
        fecha_compra:  form.fecha_compra  || null,
      };
      if (editing) await updateLaptop(editing.id_laptop, payload);
      else         await createLaptop(payload);
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta laptop?')) return;
    setDeleting(id);
    try { await deleteLaptop(id); load(); }
    finally { setDeleting(null); }
  };

  const getUsuarioNombre = (id) => {
    const u = usuarios.find(u => u.id_usuario === id);
    return u ? `${u.nombre} ${u.apellido}` : '—';
  };

  const filtered = laptops.filter(l =>
    [l.hostname, l.serial, l.marca, l.modelo, l.hostname]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Inventario</p>
          <h1 className="text-white text-2xl font-black">Laptops</h1>
          <p className="text-muted text-sm mt-1">{laptops.length} equipos registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          {canCreateLaptop && <Button icon={Plus} onClick={openCreate}>Nueva Laptop</Button>}
        </div>
      </div>

      {/* Search */}
      <Card className="flex items-center gap-3 py-3">
        <Search size={16} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por hostname, serial, marca, modelo..."
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
              <Th>Hostname</Th>
              <Th>Serial</Th>
              <Th>Marca / Modelo</Th>
              <Th>RAM / Disco</Th>
              <Th>Usuario asignado</Th>
              <Th>Fecha compra</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={7} className="text-center text-muted py-10">No hay laptops registradas</Td></Tr>
            ) : filtered.map(l => (
              <Tr key={l.id_laptop}>
                <Td>
                  <button
                    onClick={() => navigate(`/laptops/${l.hostname}`)}
                    className="font-mono text-primary font-semibold hover:underline"
                  >
                    {l.hostname || '—'}
                  </button>
                </Td>
                <Td className="font-mono text-xs">{l.serial || '—'}</Td>
                <Td>
                  <p className="text-white font-medium">{l.marca}</p>
                  <p className="text-muted text-xs">{l.modelo}</p>
                </Td>
                <Td>
                  <p className="text-xs">{l.ram}</p>
                  <p className="text-xs text-muted">{l.disco}</p>
                </Td>
                <Td>{getUsuarioNombre(l.usu_id_laptop)}</Td>
                <Td className="text-xs">{l.fecha_compra || '—'}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-bg transition-all">
                      <Pencil size={14} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(l.id_laptop)} disabled={deleting === l.id_laptop} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-all">
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
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Laptop' : 'Nueva Laptop'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Hostname" value={form.hostname} onChange={e => setForm({...form, hostname: e.target.value})} placeholder="PC-001" />
            <Input label="Serial" value={form.serial} onChange={e => setForm({...form, serial: e.target.value})} placeholder="SN123456" />
            <Input label="Marca" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} placeholder="Dell" />
            <Input label="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} placeholder="Latitude 5520" />
            <Input label="CPU" value={form.cpu} onChange={e => setForm({...form, cpu: e.target.value})} placeholder="Intel Core i7" />
            <Input label="GPU" value={form.gpu} onChange={e => setForm({...form, gpu: e.target.value})} placeholder="Intel Iris Xe" />
            <Input label="RAM" value={form.ram} onChange={e => setForm({...form, ram: e.target.value})} placeholder="16GB DDR4" />
            <Input label="Disco" value={form.disco} onChange={e => setForm({...form, disco: e.target.value})} placeholder="512GB SSD" />
            <Input label="Pantalla" value={form.pantalla} onChange={e => setForm({...form, pantalla: e.target.value})} placeholder='15.6" FHD' />
            <Input label="No. Factura" value={form.no_factura} onChange={e => setForm({...form, no_factura: e.target.value})} placeholder="FAC-001" />
            <Input label="Fecha Compra" type="date" value={form.fecha_compra} onChange={e => setForm({...form, fecha_compra: e.target.value})} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Usuario Asignado</label>
              <select
                value={form.usu_id_laptop}
                onChange={e => setForm({...form, usu_id_laptop: e.target.value})}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
              >
                <option value="">Sin asignar</option>
                {usuarios.map(u => (
                  <option key={u.id_usuario} value={u.id_usuario}>
                    {u.nombre} {u.apellido} — {u.correo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear laptop'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
// navegación agregada via patch
