/**
 * Design System Constants
 * Centralized design tokens for consistent styling across the application
 */

// Spacing Scale (in Tailwind units)
export const SPACING = {
    xs: '2',    // 0.5rem / 8px
    sm: '4',    // 1rem / 16px
    md: '6',    // 1.5rem / 24px
    lg: '8',    // 2rem / 32px
    xl: '12',   // 3rem / 48px
    '2xl': '16' // 4rem / 64px
};

// Typography Scale
export const TYPOGRAPHY = {
    // Headings
    h1: 'text-4xl md:text-5xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-bold',
    h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-semibold',
    h6: 'text-base md:text-lg font-semibold',

    // Body text
    body: 'text-base',
    bodyLarge: 'text-lg',
    bodySmall: 'text-sm',
    caption: 'text-xs',

    // Special
    lead: 'text-xl text-gray-600',
    muted: 'text-sm text-gray-500'
};

// Container Widths
export const CONTAINERS = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
    custom: 'container mx-auto px-4 sm:px-6 lg:px-8'
};

// Border Radius
export const RADIUS = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
};

// Shadows
export const SHADOWS = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    card: 'shadow-card',
    hover: 'shadow-hover'
};

// Z-Index Scale
export const Z_INDEX = {
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70
};

// Breakpoints (for reference in JS)
export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
};

// Animation Durations
export const DURATION = {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms'
};

// Common Transitions
export const TRANSITIONS = {
    default: 'transition-all duration-200',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-300',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200'
};

// Status Colors
export const STATUS_COLORS = {
    success: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        hover: 'hover:bg-green-200'
    },
    warning: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-200'
    },
    error: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        hover: 'hover:bg-red-200'
    },
    info: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-200'
    },
    primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-800',
        border: 'border-primary-200',
        hover: 'hover:bg-primary-200'
    }
};

// Common Class Combinations
export const COMMON_CLASSES = {
    // Cards
    card: 'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
    cardHover: 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow',

    // Inputs
    input: 'w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    inputError: 'w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent',

    // Buttons
    btnPrimary: 'px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors',
    btnSecondary: 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
    btnOutline: 'px-4 py-2 border-2 border-primary-600 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors',

    // Flex layouts
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexCol: 'flex flex-col',

    // Grid layouts
    gridCols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    gridCols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    gridCols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
};
