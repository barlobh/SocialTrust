import React, { useState, useEffect } from 'react';
import { Users, TrendingUp } from 'lucide-react';

const LiveActivityWidget = () => {
    const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState(0);

    const sampleActivities = [
        { name: "Tech Startup in SF", action: "generated widget", time: "2m ago" },
        { name: "Marketing Agency", action: "got trust score", time: "4m ago" },
        { name: "E-commerce Store", action: "started free trial", time: "7m ago" },
        { name: "SaaS Company", action: "generated widget", time: "9m ago" },
        { name: "Local Business", action: "got trust score", time: "12m ago" },
        { name: "Consulting Firm", action: "started free trial", time: "15m ago" },
    ];

    useEffect(() => {
        setActivities(sampleActivities);
        const interval = setInterval(() => {
            setCurrentActivity((prev) => (prev + 1) % sampleActivities.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    if (activities.length === 0) return null;

    const activity = activities[currentActivity];

    return (
        <div className="fixed bottom-4 left-4 z-50 ">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-500/20 max-w-xs animate-slide-up">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{activity.name}</div>
                        <div className="text-xs text-gray-300">{activity.action} • {activity.time}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveActivityWidget;
