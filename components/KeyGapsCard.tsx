import React, { useMemo } from 'react';
import Card from './Card';
import type { Category, ChecklistItem } from '../types';

interface KeyGapsCardProps {
  categories: Category[];
}

const getWinTypeClasses = (winType?: string) => {
  switch (winType) {
    case 'Quick Win': return 'bg-emerald-500/20 text-emerald-300';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const KeyGapsCard: React.FC<KeyGapsCardProps> = ({ categories }) => {
    const keyGaps = useMemo(() => {
        const allItems = categories.flatMap(c => c.items);
        // FIX: 'completed' and 'ignored' are from an old data model.
        // A key gap is an item that is not conformant and is applicable to the audit.
        const incompleteItems = allItems.filter(item => 
            item.status !== 'Conformant' && item.status !== 'Not Applicable'
        );
        
        return incompleteItems
            .sort((a, b) => {
                const weightA = (a.criticality || 1) * (a.impact || 1);
                const weightB = (b.criticality || 1) * (b.impact || 1);
                return weightB - weightA;
            })
            .slice(0, 6);
    }, [categories]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-purple-400 mb-4">Key Gaps</h2>
      {keyGaps.length > 0 ? (
        <ul className="space-y-4">
          {keyGaps.map(item => (
            <li key={item.id} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-white pr-4">{item.security}</p>
                    {item.winType && (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getWinTypeClasses(item.winType)}`}>
                            {item.winType}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{item.details}</p>
                 {item.effortTech && (
                    <div className="mt-2 text-xs text-gray-500">
                        <span className="font-semibold">Effort:</span> {item.effortTech} tech · {item.effortPeople} people · {item.effortWeeks}
                    </div>
                 )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center py-4">No gaps found. Great job!</p>
      )}
    </Card>
  );
};

export default KeyGapsCard;