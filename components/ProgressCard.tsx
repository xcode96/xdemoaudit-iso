
import React from 'react';
import Card from './Card';
import type { Category } from '../types';

interface ProgressCardProps {
  categories: Category[];
  baseline: { overall: number; themes: Record<string, number> } | null;
  onResetBaseline: () => void;
}

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" />
    </svg>
);


const ProgressCard: React.FC<ProgressCardProps> = ({ categories, baseline, onResetBaseline }) => {
  const allItems = categories.flatMap(c => c.items);
  
  const auditableItems = allItems.filter(
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

  const overallConformance = totalPossibleWeight > 0 ? Math.round((conformantWeight / totalPossibleWeight) * 100) : 0;
  
  const auditedItems = allItems.filter(item => item.status !== 'Not Audited').length;
  const totalItems = allItems.length;

  return (
    <Card className="flex flex-col space-y-4 justify-between">
      <div>
        <h2 className="text-xl font-bold text-purple-400 text-center">Overall Conformance</h2>
        <p className="text-gray-400 text-sm text-center">Weighted score based on conformant controls.</p>
      </div>
      
      <div className="flex items-center justify-center space-x-4 my-4">
          {baseline && (
            <div className="text-center">
                <p className="text-sm text-gray-400">Baseline</p>
                <p className="text-2xl font-bold text-gray-500">{baseline.overall}%</p>
            </div>
          )}
          <div className="text-7xl font-bold text-white">
            {overallConformance}<span className="text-4xl text-gray-500">%</span>
          </div>
      </div>

      <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${overallConformance}%` }}></div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-300">
          Controls Audited: {auditedItems} of {totalItems}
        </p>
        <button onClick={onResetBaseline} className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md">
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset baseline</span>
        </button>
      </div>
    </Card>
  );
};

export default ProgressCard;
