
import React from 'react';
import type { ChecklistItem, AuditStatus } from '../types';

type Priority = ChecklistItem['priority'];

interface FilterPanelProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    statusFilter: AuditStatus | 'all';
    onStatusFilterChange: (status: AuditStatus | 'all') => void;
    priorityFilters: Priority[];
    onPriorityFilterChange: (priorities: Priority[]) => void;
}

const priorities: Priority[] = ['Essential', 'Optional', 'Advanced', 'Basic'];
const statuses: (AuditStatus | 'all')[] = ['all', 'Not Audited', 'Conformant', 'Non-Conformant', 'Observation', 'Not Applicable'];


const FilterPanel: React.FC<FilterPanelProps> = ({
    searchTerm, onSearchTermChange, statusFilter, onStatusFilterChange, priorityFilters, onPriorityFilterChange
}) => {
    
    const handlePriorityChange = (priority: Priority) => {
        const newPriorities = priorityFilters.includes(priority)
            ? priorityFilters.filter(p => p !== priority)
            : [...priorityFilters, priority];
        onPriorityFilterChange(newPriorities);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg my-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="md:col-span-3">
                    <label htmlFor="search-filter" className="block text-sm font-medium text-gray-400">Search by Keyword or Clause</label>
                    <input 
                        type="text" 
                        id="search-filter"
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Search control, details, or clause (e.g., A.15.1.1)..."
                    />
                </div>

                {/* Status */}
                <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Audit Status</h4>
                    <div className="space-y-2">
                        {statuses.map(status => (
                            <div key={status} className="flex items-center">
                                <input
                                    id={`status-${status}`}
                                    name="status"
                                    type="radio"
                                    checked={statusFilter === status}
                                    onChange={() => onStatusFilterChange(status)}
                                    className="h-4 w-4 text-purple-600 border-gray-500 bg-gray-700 focus:ring-purple-500 cursor-pointer"
                                />
                                <label htmlFor={`status-${status}`} className="ml-3 block text-sm font-medium text-gray-300 capitalize cursor-pointer">{status.replace('-', ' ')}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority */}
                <div>
                     <h4 className="text-sm font-medium text-gray-400 mb-2">Control Priority</h4>
                    <div className="space-y-2">
                        {priorities.map(priority => (
                            <div key={priority} className="flex items-center">
                                <input
                                    id={`priority-${priority}`}
                                    name={`priority-${priority}`}
                                    type="checkbox"
                                    checked={priorityFilters.includes(priority)}
                                    onChange={() => handlePriorityChange(priority)}
                                    className="h-4 w-4 rounded text-purple-600 border-gray-500 bg-gray-700 focus:ring-purple-500 cursor-pointer"
                                />
                                <label htmlFor={`priority-${priority}`} className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer">{priority}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
