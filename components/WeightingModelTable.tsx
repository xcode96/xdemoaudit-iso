
import React from 'react';
import Card from './Card';
import type { Category, AuditStatus } from '../types';

interface WeightingModelTableProps {
  categories: Category[];
}

const getStatusClasses = (status: AuditStatus) => {
    switch (status) {
        case 'Conformant': return 'bg-green-500/20 text-green-400';
        case 'Non-Conformant': return 'bg-rose-500/20 text-rose-400';
        case 'Observation': return 'bg-yellow-500/20 text-yellow-400';
        case 'Not Applicable': return 'bg-gray-500/20 text-gray-300 opacity-70';
        case 'Not Audited':
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const WeightingModelTable: React.FC<WeightingModelTableProps> = ({ categories }) => {
  const allItems = categories.flatMap(category => 
    category.items.map(item => ({ ...item, theme: category.title }))
  );

  return (
    <Card className="overflow-x-auto">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Weighting Model</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Control</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Clause</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Theme</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Criticality</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Impact</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Scope</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Effective Weight</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-white">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-[#2d3748]">
          {allItems.map((item) => {
             const hasWeight = typeof item.scope === 'number' && typeof item.criticality === 'number' && typeof item.impact === 'number';
             const effectiveWeight = hasWeight ? (item.scope! * item.criticality! * item.impact!).toFixed(2) : 'N/A';
             
            return (
                <tr key={item.id} className={item.status === 'Not Applicable' ? 'opacity-50' : ''}>
                    <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{item.security}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{item.clause || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{item.theme}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{item.criticality?.toFixed(2) || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{item.impact?.toFixed(2) || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{item.scope?.toFixed(2) || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-white">{effectiveWeight}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-left">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>
                            {item.status}
                        </span>
                    </td>
                </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default WeightingModelTable;
