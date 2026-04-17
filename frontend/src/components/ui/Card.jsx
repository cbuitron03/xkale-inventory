import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div className={clsx('bg-card border border-border rounded-xl p-4', className)} {...props}>
      {children}
    </div>
  );
}
