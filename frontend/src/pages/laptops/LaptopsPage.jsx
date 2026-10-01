import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLaptops, createLaptop, updateLaptop, deleteLaptop } from '../../api/laptops';
import { getUsuarios } from '../../api/usuarios';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { estadoGarantia } from '../../utils/garantia';
import { Plus, Pencil, Trash2, Search, RefreshCw, SlidersHorizontal } from 'lucide-react';

const EMPTY = {
  usu_id_laptop: '', serial: '', marca: '', modelo: '', cpu: '',
  gpu: '', ram: '', disco: '', pantalla: '', no_factura: '',
  fecha_compra: '', hostname: '', garantia_hasta: '', activa: true,
};

const FILTROS_VACIOS = { marca: '', ram: '', disco: '', cpu: '', estado: '' };

export default function LaptopsPage() {
  const { canCreateLaptop, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [laptops,     setLaptops]     = useState([]);
  const [usuarios,    setUsuarios]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [modal,       setModal]       = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [filtros,     setFiltros]     = useState(FILTROS_VACIOS);
  const [showFiltros, setShowFiltros] = useState(false);

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
      garantia_hasta: l.garantia_hasta ?? '',
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
        garantia_hasta: form.garantia_hasta || null,
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

  // Valores únicos para los selects
  const marcasUnicas = [...new Set(laptops.map(l => l.marca).filter(Boolean))];
  const ramsUnicas   = [...new Set(laptops.map(l => l.ram).filter(Boolean))];
  const discosUnicos = [...new Set(laptops.map(l => l.disco).filter(Boolean))];
  const cpusUnicos   = [...new Set(laptops.map(l => l.cpu).filter(Boolean))];

  const hayFiltros = Object.values(filtros).some(v => v !== '');

  const filtered = laptops.filter(l => {
    const matchSearch = [l.hostname, l.serial, l.marca, l.modelo]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchMarca = !filtros.marca || l.marca?.toLowerCase().includes(filtros.marca.toLowerCase());
    const matchRam   = !filtros.ram   || l.ram?.toLowerCase().includes(filtros.ram.toLowerCase());
    const matchDisco = !filtros.disco || l.disco?.toLowerCase().includes(filtros.disco.toLowerCase());
    const matchCpu   = !filtros.cpu   || l.cpu?.toLowerCase().includes(filtros.cpu.toLowerCase());
    const matchEstado = !filtros.estado || (filtros.estado === 'activa') === l.activa;
    return matchSearch && matchMarca && matchRam && matchDisco && matchCpu && matchEstado;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Inventario</p>
          <h1 className="text-white text-2xl font-black">Laptops</h1>
          <p className="text-muted text-sm mt-1">{laptops.length} equipos registrados · {laptops.filter(l => l.activa).length} activos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          {canCreateLaptop && <Button icon={Plus} onClick={openCreate}>Nueva Laptop</Button>}
        </div>
      </div>

      {/* Search + Filtros */}
      <div className="space-y-3">
        <Card className="flex items-center gap-3 py-3">
          <Search size={16} className="text-muted shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por hostname, serial, marca, modelo..."
            className="flex-1 bg-transparent text-white placeholder-muted outline-none text-sm"
          />
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showFiltros || hayFiltros
                ? 'bg-primary text-black'
                : 'bg-elevated text-secondary hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtros {hayFiltros && `(${Object.values(filtros).filter(v => v).length})`}
          </button>
        </Card>

        {showFiltros && (
          <Card className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-secondary uppercase tracking-wide">Estado</label>
                <select
                  value={filtros.estado}
                  onChange={e => setFiltros({...filtros, estado: e.target.value})}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-all"
                >
                  <option value="">Todas</option>
                  <option value="activa">Activas</option>
                  <option value="inactiva">Inactivas</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-secondary uppercase tracking-wide">Marca</label>
                <select
                  value={filtros.marca}
                  onChange={e => setFiltros({...filtros, marca: e.target.value})}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-all"
                >
                  <option value="">Todas</option>
                  {marcasUnicas.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-secondary uppercase tracking-wide">RAM</label>
                <select
                  value={filtros.ram}
                  onChange={e => setFiltros({...filtros, ram: e.target.value})}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-all"
                >
                  <option value="">Todas</option>
                  {ramsUnicas.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-secondary uppercase tracking-wide">Disco</label>
                <select
                  value={filtros.disco}
                  onChange={e => setFiltros({...filtros, disco: e.target.value})}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-all"
                >
                  <option value="">Todos</option>
                  {discosUnicos.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-secondary uppercase tracking-wide">Procesador</label>
                <select
                  value={filtros.cpu}
                  onChange={e => setFiltros({...filtros, cpu: e.target.value})}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-all"
                >
                  <option value="">Todos</option>
                  {cpusUnicos.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {hayFiltros && (
              <button
                onClick={() => setFiltros(FILTROS_VACIOS)}
                className="text-xs text-danger hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </Card>
        )}
      </div>

      {/* Contador */}
      <p className="text-muted text-xs">
        Mostrando <span className="text-white font-semibold">{filtered.length}</span> de {laptops.length} equipos
      </p>

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
              <Th>CPU</Th>
              <Th>RAM / Disco</Th>
              <Th>Usuario asignado</Th>
              <Th>Fecha compra</Th>
              <Th>Garantía</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={10} className="text-center text-muted py-10">No hay laptops que coincidan</Td></Tr>
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
                <Td className="text-xs">{l.cpu || '—'}</Td>
                <Td>
                  <p className="text-xs">{l.ram}</p>
                  <p className="text-xs text-muted">{l.disco}</p>
                </Td>
                <Td>{getUsuarioNombre(l.usu_id_laptop)}</Td>
                <Td className="text-xs">{l.fecha_compra || '—'}</Td>
                <Td>
                  <Badge value={estadoGarantia(l)} />
                  {l.garantia_hasta && <p className="text-xs text-muted mt-1">hasta {l.garantia_hasta}</p>}
                </Td>
                <Td><Badge value={l.activa ? 'activa' : 'inactiva'} /></Td>
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
            <Input label="Hostname"    value={form.hostname}    onChange={e => setForm({...form, hostname:    e.target.value})} placeholder="PC-001" />
            <Input label="Serial"      value={form.serial}      onChange={e => setForm({...form, serial:      e.target.value})} placeholder="SN123456" />
            <Input label="Marca"       value={form.marca}       onChange={e => setForm({...form, marca:       e.target.value})} placeholder="Dell" />
            <Input label="Modelo"      value={form.modelo}      onChange={e => setForm({...form, modelo:      e.target.value})} placeholder="Latitude 5520" />
            <Input label="CPU"         value={form.cpu}         onChange={e => setForm({...form, cpu:         e.target.value})} placeholder="Intel Core i7" />
            <Input label="GPU"         value={form.gpu}         onChange={e => setForm({...form, gpu:         e.target.value})} placeholder="Intel Iris Xe" />
            <Input label="RAM"         value={form.ram}         onChange={e => setForm({...form, ram:         e.target.value})} placeholder="16GB DDR4" />
            <Input label="Disco"       value={form.disco}       onChange={e => setForm({...form, disco:       e.target.value})} placeholder="512GB SSD" />
            <Input label="Pantalla"    value={form.pantalla}    onChange={e => setForm({...form, pantalla:    e.target.value})} placeholder='15.6" FHD' />
            <Input label="No. Factura" value={form.no_factura}  onChange={e => setForm({...form, no_factura:  e.target.value})} placeholder="FAC-001" />
            <Input label="Fecha Compra" type="date" value={form.fecha_compra} onChange={e => setForm({...form, fecha_compra: e.target.value})} />
            <Input label="Garantía hasta" type="date" value={form.garantia_hasta} onChange={e => setForm({...form, garantia_hasta: e.target.value})} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Estado</label>
              <select
                value={form.activa ? 'true' : 'false'}
                onChange={e => setForm({...form, activa: e.target.value === 'true'})}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
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