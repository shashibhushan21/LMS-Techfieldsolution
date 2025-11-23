function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Card({ className, children }) {
  return (
    <div className={cn('bg-white border border-neutral-200 rounded-xl shadow-soft', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('px-5 pt-5 pb-5', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold text-neutral-900', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-neutral-600 mt-1', className)}>{children}</p>;
}

export function CardContent({ className, children }) {
  return <div className={cn('px-5 pb-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn('px-5 pb-5 pt-3 border-t border-neutral-100', className)}>{children}</div>;
}

export default Card;
