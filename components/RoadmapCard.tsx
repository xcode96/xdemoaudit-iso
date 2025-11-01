import React, { useMemo } from 'react';
import Card from './Card';
import type { Category, ChecklistItem } from '../types';

interface RoadmapCardProps {
  categories: Category[];
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ categories }) => {
    const roadmapItems = useMemo(() => {
        // FIX: 'completed' and 'ignored' are from an old data model.
        // Roadmap items should be quick wins that are not yet conformant and are applicable.
        return categories
            .flatMap(c => c.items)
            .filter(item => item.winType === 'Quick Win' && item.status !== 'Conformant' && item.status !== 'Not Applicable');
    }, [categories]);

    const hasAnyQuickWins = useMemo(() => {
        return categories.flatMap(c => c.items).some(item => item.winType === 'Quick Win');
    }, [categories]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-purple-400 mb-4">Prioritised Roadmap</h2>
       {roadmapItems.length > 0 ? (
        <ul className="space-y-4">
          {roadmapItems.map(item => (
            <li key={item.id} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-white">{item.security}</p>
                <p className="text-sm text-gray-400 mt-1">{item.details}</p>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    <span>
                        <span className="font-semibold">Effort:</span> {item.effortTech} tech · {item.effortPeople} people · {item.effortWeeks}
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
            {hasAnyQuickWins ? 'All "Quick Win" items have been completed!' : 'No "Quick Win" items found in the checklist.'}
        </p>
      )}
    </Card>
  );
};

export default RoadmapCard;