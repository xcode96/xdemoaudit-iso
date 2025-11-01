
import React from 'react';
import Card from './Card';
import type { Category } from '../types';

interface BarChartListCardProps {
    categories: Category[];
    baseline: { overall: number; themes: Record<string, number> } | null;
    onCategoryClick: (id: string) => void;
}

const BarChartListCard: React.FC<BarChartListCardProps> = ({ categories, baseline, onCategoryClick }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-purple-400 mb-4">Theme Conformance</h2>
      <ul className="space-y-4">
        {categories.map(category => {
            if(category.items.length === 0) return null;

            const auditableItems = category.items.filter(
                item => item.status !== 'Not Applicable' &&
                        typeof item.scope === 'number' && 
                        typeof item.criticality === 'number' && 
                        typeof item.impact === 'number'
            );

            const totalPossibleWeight = auditableItems.reduce((sum, item) => {
                return sum + (item.scope! * item.criticality! * item.impact!);
            }, 0);

            const conformantWeight = auditableItems.reduce((sum, item) => {
                if (item.status === 'Conformant') {
                    return sum + (item.scope! * item.criticality! * item.impact!);
                }
                return sum;
            }, 0);

            const conformance = totalPossibleWeight > 0 ? Math.round((conformantWeight / totalPossibleWeight) * 100) : 0;
            const auditedCount = category.items.filter(i => i.status !== 'Not Audited').length;
            const baselineScore = baseline?.themes[category.id];

            return (
                <li key={category.id} onClick={() => onCategoryClick(category.id)} className="cursor-pointer hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center space-x-2">
                            <category.icon className="w-5 h-5 flex-shrink-0" style={{ color: category.color }} />
                            <span className="text-md font-medium text-gray-300">{category.title}</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                          {typeof baselineScore === 'number' && (
                            <span className="text-sm font-bold text-gray-500">{baselineScore}%</span>
                          )}
                          <span className="font-bold text-lg" style={{color: category.color}}>{conformance}%</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                            className="h-2 rounded-full" 
                            style={{ 
                                width: `${conformance}%`,
                                backgroundColor: category.color,
                            }}
                        ></div>
                    </div>
                     <p className="text-right text-xs text-gray-500 mt-1">{auditedCount}/{category.total} audited</p>
                </li>
            );
        })}
      </ul>
    </Card>
  );
};

export default BarChartListCard;
