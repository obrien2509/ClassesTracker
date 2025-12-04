
import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    variant: 'primary' | 'success' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, variant }) => {
    const variantClasses = {
        primary: 'from-blue-400 to-purple-500',
        success: 'from-green-400 to-teal-500',
        warning: 'from-yellow-400 to-orange-500',
        info: 'from-cyan-400 to-sky-500'
    };
    
    return (
        <div className={`bg-gradient-to-br ${variantClasses[variant]} text-white p-5 rounded-lg shadow-lg`}>
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            <div className="text-4xl font-bold">{value}</div>
        </div>
    );
};

export default StatCard;
