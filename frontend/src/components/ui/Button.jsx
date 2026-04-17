import clsx from 'clsx';

const variants = {
  primary: 'bg-primary text-black hover:bg-primary-light',
  outline: 'border border-primary text-primary hover:bg-primary-glow',
  danger:  'border border-danger text-danger hover:bg-danger-bg',
  ghost:   'text-secondary hover:text-primary hover:bg-elevated',
};

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, loading, disabled, className, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variants[variant],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? <span className="animate-spin">⟳</span> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
