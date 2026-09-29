import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLaptopDetalle } from '../../api/laptops';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { estadoGarantia } from '../../utils/garantia';
import {
  ArrowLeft, Laptop, User, Cpu, HardDrive,
  Monitor, Calendar, Hash, Ticket, Wrench,
  CheckCircle, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function LaptopDetail() {
  const { hostname }  = useParams();
  const navigate      = useNavigate();
  const { canCreateTicket } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getLaptopDetalle(hostname)
      .then(setData)
      .catch(() => setError('No se encontró la laptop'))
      .finally(() => setLoading(false));
  }, [hostname]);

  if (loading) return <div className="flex items-center justify-center h-full text-muted">Cargando...</div>;
  if (error)   return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-danger">{error}</p>
      <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/laptops')}>Volver</Button>
    </div>
  );

  const ticketsAbiertos  = data.tickets?.filter(t => t.estado === 'abierto').length   || 0;
  const ticketsEnProceso = data.tickets?.filter(t => t.estado === 'en_proceso').length || 0;
  const ticketsCerrados  = data.tickets?.filter(t => t.estado === 'cerrado').length   || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/laptops')} className="p-2 rounded-lg text-muted hover:text-white hover:bg-elevated transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Inventario</p>
          <h1 className="text-white text-2xl font-black font-mono">{data.hostname || 'Sin hostname'}</h1>
          <p className="text-muted text-sm mt-1">{data.marca} {data.modelo}</p>
        </div>
        {canCreateTicket && (
          <Button icon={Ticket} onClick={() => navigate('/tickets')}>
            Nuevo Ticket
          </Button>
        )}
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-danger-bg flex items-center justify-center">
            <AlertTriangle size={18} className="text-danger" />
          </div>
          <div>
            <p className="text-2xl font-black text-danger">{ticketsAbiertos}</p>
            <p className="text-muted text-xs">Abiertos</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning-bg flex items-center justify-center">
            <Clock size={18} className="text-warning" />
          </div>
          <div>
            <p className="text-2xl font-black text-warning">{ticketsEnProceso}</p>
            <p className="text-muted text-xs">En Proceso</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center">
            <CheckCircle size={18} className="text-success" />
          </div>
          <div>
            <p className="text-2xl font-black text-success">{ticketsCerrados}</p>
            <p className="text-muted text-xs">Cerrados</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Laptop size={16} className="text-primary" /> Especificaciones
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <SpecRow icon={Hash}      label="Serial"    value={data.serial} />
              <SpecRow icon={Cpu}       label="CPU"       value={data.cpu} />
              <SpecRow icon={Monitor}   label="GPU"       value={data.gpu} />
              <SpecRow icon={Monitor}   label="RAM"       value={data.ram} />
              <SpecRow icon={HardDrive} label="Disco"     value={data.disco} />
              <SpecRow icon={Monitor}   label="Pantalla"  value={data.pantalla} />
              <SpecRow icon={Hash}      label="Factura"   value={data.no_factura} />
              <SpecRow icon={Calendar}  label="Compra"    value={data.fecha_compra} />
              <SpecRow icon={ShieldCheck} label="Garantía" value={
                <span className="flex items-center gap-2">
                  <Badge value={estadoGarantia(data)} />
                  {data.garantia_hasta && <span className="text-xs text-muted">hasta {data.garantia_hasta}</span>}
                </span>
              } />
            </div>
          </Card>

          {/* Tickets */}
          <Card>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Ticket size={16} className="text-primary" />
              Historial de Tickets
              <span className="ml-auto text-xs text-muted font-normal">{data.tickets?.length || 0} tickets</span>
            </h2>
            {data.tickets?.length === 0 ? (
              <p className="text-muted text-sm text-center py-6">Sin tickets registrados</p>
            ) : (
              <div className="space-y-2">
                {[...data.tickets].reverse().map(t => (
                  <div key={t.id_ticket} className="flex items-start justify-between p-3 bg-elevated rounded-lg gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-muted font-mono text-xs">#{t.id_ticket}</span>
                        <Badge value={t.estado || 'abierto'} />
                      </div>
                      <p className="text-white text-sm font-medium truncate">{t.incidencia || '—'}</p>
                      {t.solucion && (
                        <p className="text-muted text-xs mt-1 truncate">✓ {t.solucion}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-muted text-xs">{t.fecha_inicio || '—'}</p>
                      {t.fecha_cierre && <p className="text-success text-xs">{t.fecha_cierre}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Usuario asignado */}
          <Card>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" /> Usuario Asignado
            </h2>
            {data.usuario ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-glow border border-primary border-opacity-30 flex items-center justify-center shrink-0">
                  <span className="text-primary font-black text-lg uppercase">{data.usuario.nombre?.[0]}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{data.usuario.nombre} {data.usuario.apellido}</p>
                  <p className="text-muted text-xs mt-0.5">{data.usuario.correo}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted text-sm">Sin usuario asignado</p>
            )}
          </Card>

          {/* Resumen */}
          <Card>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Wrench size={16} className="text-primary" /> Resumen
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted text-sm">Total tickets</span>
                <span className="text-white font-semibold">{data.tickets?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Último ticket</span>
                <span className="text-white font-semibold text-xs">
                  {data.tickets?.length ? data.tickets[data.tickets.length - 1].fecha_inicio || '—' : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Estado actual</span>
                <Badge value={ticketsAbiertos > 0 ? 'abierto' : 'cerrado'} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-elevated rounded-lg">
      <Icon size={14} className="text-muted shrink-0" />
      <div className="min-w-0">
        <p className="text-muted text-xs">{label}</p>
        <p className="text-white text-sm font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}
