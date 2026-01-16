import React from 'react';

export default function WelcomeBanner({
    title,
    subtitle,
    variant = 'simple',
    className = ''
}) {
    if (variant === 'decorative') {
        return (
            <div className={`relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white shadow-xl ${className}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
                    <p className="text-primary-100 text-lg">{subtitle}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white shadow-lg ${className}`}>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-primary-100 text-lg">{subtitle}</p>
        </div>
    );
}
