import { BRAND } from '@/config/brand';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={cn('max-w-3xl', alignCls, className)}>
      {eyebrow && (
        <div className="text-primary-700 font-semibold tracking-wide uppercase text-xs">{eyebrow}</div>
      )}
      <h2 className="mt-1 text-2xl md:text-3xl font-heading font-bold text-neutral-900">{title}</h2>
      {subtitle && <p className="mt-2 text-neutral-700">{subtitle}</p>}
    </div>
  );
}
