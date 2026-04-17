import clsx from 'clsx';

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={clsx('w-full text-sm', className)}>{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-elevated border-b border-border">
      {children}
    </thead>
  );
}

export function Th({ children, className }) {
  return (
    <th className={clsx('px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function Tr({ children, className, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={clsx('bg-card hover:bg-elevated transition-colors', onClick && 'cursor-pointer', className)}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }) {
  return <td className={clsx('px-4 py-3 text-secondary', className)}>{children}</td>;
}
