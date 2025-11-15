export default function MobileBackground() {
  return (
    <div className="absolute inset-0 lg:hidden overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30" />
    </div>
  );
}
