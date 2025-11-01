
import React, { useMemo } from 'react';
import Card from './Card';
import type { Category } from '../types';

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Non-Conformant': return 'bg-rose-500/20 text-rose-300';
    case 'Observation': return 'bg-yellow-500/20 text-yellow-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const CorrectiveActionsCard: React.FC<{ categories: Category[] }> = ({ categories }) => {
    const actionItems = useMemo(() => {
        return categories
            .flatMap(c => c.items)
            .filter(item => item.status === 'Non-Conformant' || item.status === 'Observation')
            .sort((a, b) => {
                 const weightA = (a.criticality || 1) * (a.impact || 1);
                const weightB = (b.criticality || 1) * (b.impact || 1);
                return weightB - weightA;
            });
    }, [categories]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-purple-400 mb-4">Corrective Action Plan</h2>
       {actionItems.length > 0 ? (
        <ul className="space-y-4">
          {actionItems.map(item => (
            <li key={item.id} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-white pr-2">{item.security}</p>
                     <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusClasses(item.status)}`}>
                        {item.status}
                    </span>
                </div>

                <p className="text-sm text-gray-400 mt-1"><strong>Recommendation:</strong> {item.details}</p>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    <span>
                        <span className="font-semibold">Est. Effort:</span> {item.effortTech} tech · {item.effortPeople} people · {item.effortWeeks}
                    </span>
                     {item.dependencies && (
                        <span className="font-semibold text-rose-400">Dependencies: {item.dependencies}</span>
                     )}
                </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center py-4">
            No items requiring corrective action.
        </p>
      )}
    </Card>
  );
};

export default CorrectiveActionsCard;
