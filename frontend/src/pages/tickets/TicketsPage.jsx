import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../../api/tickets';
import { getLaptops } from '../../api/laptops';
import { getTecnicos } from '../../api/tecnicos';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ESTADOS_TICKET } from '../../utils/etiquetas';
import { Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle, Clock, CheckCircle, List } from 'lucide-react';

const EMPTY = {
  tec_id: '', lap_id: '', incidencia: '', descripcion: '',
  estado: 'abierto', fecha_inicio: '', fecha_cierre: '', solucion: '',
};


const ESTADO_CONFIG = {
  all:        { label: 'Todos',      icon: List,          color: 'text-secondary',  bg: 'bg-elevated' },
  abierto:    { label: 'Abiertos',   icon: AlertTriangle, color: 'text-danger',     bg: 'bg-danger-bg' },
  en_proceso: { label: 'En Proceso', icon: Clock,         color: 'text-warning',    bg: 'bg-warning-bg' },
  cerrado:    { label: 'Cerrados',   icon: CheckCircle,   color: 'text-success',    bg: 'bg-success-bg' },
};

export default function TicketsPage() {
  const { canCreateTicket, isAdmin } = useAuth();
  const [tickets,       setTickets]      = useState([]);
  const [laptops,       setLaptops]      = useState([]);
  const [tecnicos,      setTecnicos]     = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [search,        setSearch]       = useState('');
  const [estadoFiltro,  setEstadoFiltro] = useState('all');
  const [modal,         setModal]        = useState(false);
  const [editing,       setEditing]      = useState(null);
  const [form,          setForm]         = useState(EMPTY);
  const [saving,        setSaving]       = useState(false);
  const [deleting,      setDeleting]     = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getTickets(), getLaptops(), getTecnicos()])
      .then(([t, l, tc]) => { setTickets(t); setLaptops(l); setTecnicos(tc); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (t) => {
    setEditing(t);
    setForm({
      ...t,
      tec_id:       t.tec_id       ?? '',
      lap_id:       t.lap_id       ?? '',
      fecha_inicio: t.fecha_inicio ?? '',
      fecha_cierre: t.fecha_cierre ?? '',
      solucion:     t.solucion     ?? '',
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tec_id:       form.tec_id      ? Number(form.tec_id)  : null,
        lap_id:       form.lap_id      ? Number(form.lap_id)  : null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_cierre: form.fecha_cierre || null,
      };
      if (editing) await updateTicket(editing.id_ticket, payload);
      else         await createTicket(payload);
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ticket?')) return;
    setDeleting(id);
    try { await deleteTicket(id); load(); }
    finally { setDeleting(null); }
  };

  const getLaptopHostname = (id) => laptops.find(l => l.id_laptop === id)?.hostname || `#${id}`;
  const getTecnicoNombre  = (id) => {
    const t = tecnicos.find(t => t.id_tecnico === id);
    return t ? t.tecnico_nombre : '—';
  };

  // Conteos por estado
  const counts = {
    all:        tickets.length,
    abierto:    tickets.filter(t => t.estado === 'abierto').length,
    en_proceso: tickets.filter(t => t.estado === 'en_proceso').length,
    cerrado:    tickets.filter(t => t.estado === 'cerrado').length,
  };

  const filtered = tickets.filter(t => {
    const matchSearch = [t.incidencia, t.descripcion, t.estado]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchEstado = estadoFiltro === 'all' || t.estado === estadoFiltro;
    return matchSearch && matchEstado;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Soporte</p>
          <h1 className="text-white text-2xl font-black">Tickets</h1>
          <p className="text-muted text-sm mt-1">{tickets.length} tickets registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={load}>Actualizar</Button>
          {canCreateTicket && <Button icon={Plus} onClick={openCreate}>Nuevo Ticket</Button>}
        </div>
      </div>

      {/* Filtros de estado — pills */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => {
          const Icon    = cfg.icon;
          const active  = estadoFiltro === key;
          return (
            <button
              key={key}
              onClick={() => setEstadoFiltro(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                active
                  ? `${cfg.bg} ${cfg.color} border-current border-opacity-40`
                  : 'bg-card text-secondary border-border hover:text-white hover:bg-elevated'
              }`}
            >
              <Icon size={14} />
              {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-black bg-opacity-20' : 'bg-elevated'}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <Card className="flex items-center gap-3 py-3">
        <Search size={16} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por incidencia, descripción..."
          className="flex-1 bg-transparent text-white placeholder-muted outline-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-muted hover:text-white text-xs">
            Limpiar
          </button>
        )}
      </Card>

      {/* Contador */}
      <p className="text-muted text-xs">
        Mostrando <span className="text-white font-semibold">{filtered.length}</span> de {tickets.length} tickets
      </p>

      {/* Table */}
      {loading ? (
        <p className="text-muted text-sm text-center py-10">Cargando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Incidencia</Th>
              <Th>Laptop</Th>
              <Th>Técnico</Th>
              <Th>Estado</Th>
              <Th>Fecha inicio</Th>
              <Th>Fecha cierre</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={8} className="text-center text-muted py-10">No hay tickets que coincidan</Td></Tr>
            ) : filtered.map(t => (
              <Tr key={t.id_ticket}>
                <Td className="text-muted font-mono text-xs">#{t.id_ticket}</Td>
                <Td>
                  <p className="text-white font-medium">{t.incidencia || '—'}</p>
                  <p className="text-muted text-xs truncate max-w-xs">{t.descripcion}</p>
                </Td>
                <Td className="font-mono text-primary text-xs">{getLaptopHostname(t.lap_id)}</Td>
                <Td>{getTecnicoNombre(t.tec_id)}</Td>
                <Td><Badge value={t.estado || 'abierto'} /></Td>
                <Td className="text-xs">{t.fecha_inicio || '—'}</Td>
                <Td className="text-xs">{t.fecha_cierre || '—'}</Td>
                <Td>
                  <div className="flex gap-2">
                    {canCreateTicket && (
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-bg transition-all">
                        <Pencil size={14} />
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(t.id_ticket)} disabled={deleting === t.id_ticket} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-all">
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
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Ticket' : 'Nuevo Ticket'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Laptop</label>
              <select
                value={form.lap_id}
                onChange={e => setForm({...form, lap_id: e.target.value})}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
              >
                <option value="">Seleccionar laptop</option>
                {laptops.map(l => (
                  <option key={l.id_laptop} value={l.id_laptop}>
                    {l.hostname} — {l.marca} {l.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Técnico</label>
              <select
                value={form.tec_id}
                onChange={e => setForm({...form, tec_id: e.target.value})}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
              >
                <option value="">Seleccionar técnico</option>
                {tecnicos.map(t => (
                  <option key={t.id_tecnico} value={t.id_tecnico}>
                    {t.tecnico_nombre} — {t.tecnico_correo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Input label="Incidencia" value={form.incidencia} onChange={e => setForm({...form, incidencia: e.target.value})} placeholder="Descripción breve del problema" required />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Descripción detallada</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm({...form, descripcion: e.target.value})}
                placeholder="Detalle el problema..."
                rows={3}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted outline-none focus:border-primary transition-all resize-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Estado</label>
              <select
                value={form.estado}
                onChange={e => setForm({...form, estado: e.target.value})}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
              >
                {ESTADOS_TICKET.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <Input label="Fecha Inicio" type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} />
            <Input label="Fecha Cierre" type="date" value={form.fecha_cierre} onChange={e => setForm({...form, fecha_cierre: e.target.value})} />
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">Solución</label>
              <textarea
                value={form.solucion}
                onChange={e => setForm({...form, solucion: e.target.value})}
                placeholder="Describe la solución aplicada..."
                rows={3}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear ticket'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}