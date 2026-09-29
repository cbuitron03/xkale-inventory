import clsx from 'clsx';

const config = {
  active:       { label: 'Activo',     cls: 'bg-success-bg text-success' },
  low_stock:    { label: 'Stock Bajo', cls: 'bg-warning-bg text-warning' },
  out_of_stock: { label: 'Sin Stock',  cls: 'bg-danger-bg  text-danger'  },
  abierto:      { label: 'Abierto',    cls: 'bg-info-bg    text-info'    },
  cerrado:      { label: 'Cerrado',    cls: 'bg-success-bg text-success' },
  en_proceso:   { label: 'En Proceso', cls: 'bg-warning-bg text-warning' },
  admin:        { label: 'Admin',      cls: 'bg-primary-glow text-primary' },
  tecnico:      { label: 'Técnico',    cls: 'bg-info-bg    text-info'    },
  inventario:   { label: 'Inventario', cls: 'bg-elevated   text-secondary'},
  vigente:      { label: 'Vigente',    cls: 'bg-success-bg text-success' },
  expirada:     { label: 'Expirada',   cls: 'bg-danger-bg  text-danger'  },
  sin_garantia: { label: 'Sin garantía', cls: 'bg-elevated text-muted'    },
};

export default function Badge({ value, className }) {
  const cfg = config[value] || { label: value, cls: 'bg-elevated text-secondary' };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', cfg.cls, className)}>
      {cfg.label}
    </span>
  );
}
