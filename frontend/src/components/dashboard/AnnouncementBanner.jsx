import { useState, useEffect } from 'react';
import { FiX, FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const AnnouncementBanner = ({ announcements, userRole }) => {
    const [visibleAnnouncements, setVisibleAnnouncements] = useState([]);

    useEffect(() => {
        if (!announcements || announcements.length === 0) return;

        // Filter announcements based on user role and dismissal status
        const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        const filtered = announcements.filter(announcement => {
            // Check if dismissed
            if (dismissed.includes(announcement._id)) return false;

            // Check audience
            const target = announcement.targetAudience || announcement.audience || 'all';
            if (target === 'all') return true;

            // Handle plural forms from backend (interns -> intern, mentors -> mentor)
            const targetRole = target.endsWith('s') ? target.slice(0, -1) : target;
            return targetRole === userRole;
        });

        setVisibleAnnouncements(filtered);
    }, [announcements, userRole]);

    const handleDismiss = (id) => {
        const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        dismissed.push(id);
        localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissed));
        setVisibleAnnouncements(prev => prev.filter(a => a._id !== id));
    };

    if (visibleAnnouncements.length === 0) return null;

    const typeConfig = {
        general: {
            icon: FiInfo,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100'
        },
        update: {
            icon: FiCheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100'
        },
        reminder: {
            icon: FiAlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-600',
            iconBg: 'bg-yellow-100'
        },
        urgent: {
            icon: FiAlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100'
        },
        event: {
            icon: FiInfo, // You might want to import FiCalendar or similar
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-800',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100'
        },
        // Fallback for old types
        info: {
            icon: FiInfo,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100'
        }
    };

    return (
        <div className="space-y-3">
            {visibleAnnouncements.map(announcement => {
                const type = announcement.type || 'general';
                const config = typeConfig[type] || typeConfig.general || typeConfig.info;
                const Icon = config.icon;

                return (
                    <div
                        key={announcement._id}
                        className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg p-4 shadow-sm animate-slide-down`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`${config.iconBg} rounded-lg p-2 flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold ${config.textColor} mb-1`}>
                                    {announcement.title}
                                </h3>
                                <p className={`text-sm ${config.textColor} opacity-90 leading-relaxed`}>
                                    {announcement.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDismiss(announcement._id)}
                                className={`${config.textColor} hover:opacity-70 transition-opacity p-1 rounded flex-shrink-0`}
                                aria-label="Dismiss announcement"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnnouncementBanner;
