import React from 'react';

const Avatar = ({ name = 'User', src, size = 'md', className = '' }) => {
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const colorClasses = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500'
  ];

  // Generate consistent color based on name
  const getColorClass = (fullName) => {
    if (!fullName) return colorClasses[0];
    const charSum = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorClasses[charSum % colorClasses.length];
  };

  const initials = getInitials(name);
  const colorClass = getColorClass(name);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.classList.add(colorClass);
            e.target.parentElement.innerHTML = `<span class="flex items-center justify-center w-full h-full text-white font-semibold">${initials}</span>`;
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
