
import React, { useMemo } from 'react';
import Card from './Card';
import type { Category } from '../types';

const FindingsCard: React.FC<{ categories: Category[] }> = ({ categories }) => {
    const keyFindings = useMemo(() => {
        return categories
            .flatMap(c => c.items)
            .filter(item => item.status === 'Non-Conformant')
            .sort((a, b) => {
                const weightA = (a.criticality || 1) * (a.impact || 1);
                const weightB = (b.criticality || 1) * (b.impact || 1);
                return weightB - weightA;
            })
            .slice(0, 6);
    }, [categories]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-purple-400 mb-4">Key Findings (Non-Conformities)</h2>
      {keyFindings.length > 0 ? (
        <ul className="space-y-4">
          {keyFindings.map(item => (
            <li key={item.id} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-white pr-4">{item.security}</p>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-rose-500/20 text-rose-300">
                        Non-Conformant
                    </span>
                </div>
                <p className="text-sm text-gray-400 mt-1 italic">"{item.details}"</p>
                 {item.evidence && (
                    <div className="mt-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded-md border border-gray-700">
                        <span className="font-semibold text-gray-400">Auditor Notes:</span> {item.evidence}
                    </div>
                 )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center py-4">No non-conformities found. All applicable controls are conformant.</p>
      )}
    </Card>
  );
};

export default FindingsCard;
