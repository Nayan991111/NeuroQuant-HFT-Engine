import React, { useEffect, useState } from 'react';

const SystemHealth: React.FC = () => {
    const [status, setStatus] = useState({
        api: 'unknown',
        db: 'unknown',
        ai: 'unknown'
    });

    // We will poll the backend health endpoint (we need to create this next)
    const checkHealth = async () => {
        try {
            // Check API & DB
            const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                setStatus(prev => ({ ...prev, api: 'online', db: data.db_status }));
            } else {
                setStatus(prev => ({ ...prev, api: 'offline', db: 'offline' }));
            }
        } catch (e) {
            setStatus(prev => ({ ...prev, api: 'offline', db: 'offline' }));
        }

        // For AI, we infer status if we are receiving trades (simulated for now)
        // In a real app, we'd ping a specific AI health endpoint
        setStatus(prev => ({ ...prev, ai: 'active' })); 
    };

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const getBadgeColor = (state: string) => {
        if (state === 'online' || state === 'connected' || state === 'active') return 'bg-green-500';
        if (state === 'offline' || state === 'disconnected') return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex items-center justify-between text-sm">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider">System Status</h3>
            <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${getBadgeColor(status.api)}`}></span>
                    <span className="text-gray-300">Backend API</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${getBadgeColor(status.db)}`}></span>
                    <span className="text-gray-300">Database</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${getBadgeColor(status.ai)} animate-pulse`}></span>
                    <span className="text-gray-300">AI Engine</span>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;