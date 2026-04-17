import clsx from 'clsx';

export default function Input({ label, error, required, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-secondary uppercase tracking-wide">
          {label}{required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'bg-card border rounded-lg px-3 py-2.5 text-sm text-primary placeholder-muted outline-none transition-all',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
