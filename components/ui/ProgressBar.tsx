
import React from 'react';

interface ProgressBarProps {
    value: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
    const cappedValue = Math.min(100, Math.max(0, value));

    return (
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden relative">
            <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500 ease-out flex items-center justify-center"
                style={{ width: `${cappedValue}%` }}
            >
                <span className="text-white font-bold text-xs">{cappedValue}%</span>
            </div>
        </div>
    );
};

export default ProgressBar;
