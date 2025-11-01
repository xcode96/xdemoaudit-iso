import React from 'react';
import Card from './Card';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface RadarChartCardProps {
    data: { subject: string; value: number }[];
}

const RadarChartCard: React.FC<RadarChartCardProps> = ({ data }) => {
    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <defs>
                            <radialGradient id="radarGradient">
                                <stop offset="5%" stopColor="#facc15" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0.6}/>
                            </radialGradient>
                        </defs>
                        <PolarGrid stroke="#4a5568" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                        <Radar 
                            name="Progress" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            fill="url(#radarGradient)" 
                            fillOpacity={0.7} 
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-400">Advanced</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-gray-400">Optional</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-gray-400">Essential</span>
                </div>
            </div>
        </Card>
    );
};

export default RadarChartCard;