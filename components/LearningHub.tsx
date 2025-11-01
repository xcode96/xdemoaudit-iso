
import React, { useState, useMemo } from 'react';
import Card from './Card';
import type { LearningHubItem } from '../types';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

interface LearningHubProps {
  onBack: () => void;
  learningData: LearningHubItem[];
  isAdmin: boolean;
  onAddItem: () => void;
  onEditItem: (item: LearningHubItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ onBack, learningData, isAdmin, onAddItem, onEditItem, onDeleteItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return learningData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return learningData.filter(item => 
        item.id.toLowerCase().includes(lowercasedFilter) ||
        item.what.toLowerCase().includes(lowercasedFilter) ||
        item.why.toLowerCase().includes(lowercasedFilter) ||
        item.how.toLowerCase().includes(lowercasedFilter)
    );
  }, [learningData, searchTerm]);

  return (
    <div>
      <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 font-semibold">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Audit Dashboard</span>
      </button>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Learning Hub</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          Plain-English guidance explaining what each clause or control means, why it matters and how to uplift maturity.
        </p>
      </div>

      <div className="my-6 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-[65px] bg-[#1a1e26]/80 backdrop-blur-md py-4 z-10">
        <div className="w-full sm:w-auto sm:flex-1">
          <input 
              type="text" 
              placeholder="Search guidance by keyword, clause, or control..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#2d3748] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        {isAdmin && (
            <button onClick={onAddItem} className="w-full sm:w-auto flex-shrink-0 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                Add New Guidance
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.length > 0 ? filteredData.map(item => (
          <Card key={item.id} className="flex flex-col relative group">
            {isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditItem(item)} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"><PencilIcon className="w-4 h-4"/></button>
                    <button onClick={() => onDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-rose-400 bg-gray-700 hover:bg-rose-500/20 rounded-md transition-colors"><TrashIcon className="w-4 h-4"/></button>
                </div>
            )}
            <h3 className="text-lg font-bold text-purple-400 mb-3 border-b border-gray-700 pb-2 pr-20">{item.id}</h3>
            <div className="space-y-4 text-sm flex-grow flex flex-col justify-between">
              <div>
                <p className="font-semibold text-gray-200 uppercase tracking-wide text-xs">What</p>
                <p className="text-gray-300 mt-1">{item.what}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-200 uppercase tracking-wide text-xs">Why</p>
                <p className="text-gray-300 mt-1">{item.why}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-200 uppercase tracking-wide text-xs">How</p>
                <p className="text-gray-300 mt-1">{item.how}</p>
              </div>
            </div>
          </Card>
        )) : (
          <div className="lg:col-span-2 text-center py-12 text-gray-500">
            <p>No guidance found matching your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;
