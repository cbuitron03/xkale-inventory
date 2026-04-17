import { useEffect, useState } from 'react';
import { getLaptops } from '../../api/laptops';
import { getTickets } from '../../api/tickets';
import { getUsuarios } from '../../api/usuarios';
import { getTecnicos } from '../../api/tecnicos';
import { Laptop, Ticket, Users, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function DashboardPage() {
  const [laptops,   setLaptops]   = useState([]);
  const [tickets,   setTickets]   = useState([]);
  const [usuarios,  setUsuarios]  = useState([]);
  const [tecnicos,  setTecnicos]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getLaptops(), getTickets(), getUsuarios(), getTecnicos()])
      .then(([l, t, u, tc]) => { setLaptops(l); setTickets(t); setUsuarios(u); setTecnicos(tc); })
      .finally(() => setLoading(false));
  }, []);

  const ticketsAbiertos   = tickets.filter(t => t.estado === 'abierto').length;
  const ticketsEnProceso  = tickets.filter(t => t.estado === 'en_proceso').length;
  const ticketsCerrados   = tickets.filter(t => t.estado === 'cerrado').length;
  const recentTickets     = [...tickets].reverse().slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-muted">Cargando...</div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">XKALE™</p>
        <h1 className="text-white text-2xl font-black">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Resumen general del sistema</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Laptop}  label="Laptops"   value={laptops.length}  color="text-primary"  bg="bg-success-bg" />
        <KpiCard icon={Users}   label="Usuarios"  value={usuarios.length} color="text-info"     bg="bg-info-bg" />
        <KpiCard icon={Wrench}  label="Técnicos"  value={tecnicos.length} color="text-warning"  bg="bg-warning-bg" />
        <KpiCard icon={Ticket}  label="Tickets"   value={tickets.length}  color="text-secondary" bg="bg-elevated" />
      </div>

      {/* Tickets Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-danger-bg flex items-center justify-center">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div>
            <p className="text-2xl font-black text-danger">{ticketsAbiertos}</p>
            <p className="text-muted text-xs">Tickets Abiertos</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-warning-bg flex items-center justify-center">
            <Clock size={20} className="text-warning" />
          </div>
          <div>
            <p className="text-2xl font-black text-warning">{ticketsEnProceso}</p>
            <p className="text-muted text-xs">En Proceso</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center">
            <CheckCircle size={20} className="text-success" />
          </div>
          <div>
            <p className="text-2xl font-black text-success">{ticketsCerrados}</p>
            <p className="text-muted text-xs">Cerrados</p>
          </div>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <h2 className="text-white font-bold mb-4">Tickets Recientes</h2>
        {recentTickets.length === 0 ? (
          <p className="text-muted text-sm text-center py-6">No hay tickets registrados</p>
        ) : (
          <div className="space-y-2">
            {recentTickets.map(t => (
              <div key={t.id_ticket} className="flex items-center justify-between p-3 bg-elevated rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{t.incidencia || 'Sin título'}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {t.fecha_inicio || 'Sin fecha'} · Laptop #{t.lap_id}
                  </p>
                </div>
                <Badge value={t.estado || 'abierto'} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        <p className="text-muted text-xs">{label}</p>
      </div>
    </Card>
  );
}
