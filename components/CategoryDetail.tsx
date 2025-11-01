
import React, { useState, useMemo } from 'react';
import type { Category, ChecklistItem, AuditStatus } from '../types';
import Card from './Card';
import ChecklistItemRow from './ChecklistItemRow';
import FilterPanel from './FilterPanel';
import AddChecklistItemForm from './AddChecklistItemForm';

interface CategoryDetailProps {
  category: Category;
  onBack: () => void;
  onUpdateItem: (updatedItem: ChecklistItem) => void;
  onResetProgress: (categoryId: string) => void;
  isAdmin: boolean;
  onEditCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onAddItem: (newItem: Omit<ChecklistItem, 'id'>) => void;
  onEditItem: (item: ChecklistItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);


const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
    category, onBack, onUpdateItem, onResetProgress, isAdmin, onEditCategory, onDeleteCategory, onAddItem, onEditItem, onDeleteItem
}) => {
    const { id, title, longDescription, items, icon: Icon, color, conformant, totalAuditable } = category;
    
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all');
    const [priorityFilters, setPriorityFilters] = useState<ChecklistItem['priority'][]>([]);

    const percentage = totalAuditable > 0 ? Math.round((conformant / totalAuditable) * 100) : 0;

    const filteredItems = useMemo(() => {
        return items
            .filter(item => { // Status filter
                if (statusFilter === 'all') return true;
                return item.status === statusFilter;
            })
            .filter(item => { // Priority filter
                if (priorityFilters.length === 0) return true;
                return priorityFilters.includes(item.priority);
            })
            .filter(item => { // Search term filter
                if (!searchTerm.trim()) return true;
                const lowerSearchTerm = searchTerm.toLowerCase();
                return item.security.toLowerCase().includes(lowerSearchTerm) ||
                       item.details.toLowerCase().includes(lowerSearchTerm) ||
                       (item.clause && item.clause.toLowerCase().includes(lowerSearchTerm));
            });
    }, [items, statusFilter, priorityFilters, searchTerm]);
    
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriorityFilters([]);
    };

    return (
        <div>
             <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Audit Dashboard</span>
            </button>
            <Card>
                <div className="p-2 sm:p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                            <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}20`}}>
                                <Icon className="w-10 h-10" style={{color: color}} />
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <h1 className="text-3xl font-bold text-white">{title}</h1>
                                <p className="text-gray-400 mt-1">{longDescription}</p>
                            </div>
                        </div>
                         {isAdmin && (
                            <div className="flex space-x-2 flex-shrink-0 ml-4">
                                <button onClick={onEditCategory} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => onDeleteCategory(id)} className="p-2 text-gray-400 hover:text-rose-400 bg-gray-700 hover:bg-rose-500/20 rounded-md transition-colors"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-400">
                             <p>{conformant} of {totalAuditable} auditable controls are conformant ({percentage}%). <span className="hidden sm:inline">Showing {filteredItems.length} of {items.length} total controls.</span></p>
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                                <button onClick={resetFilters} className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-semibold transition-colors">
                                    <XIcon className="w-3 h-3"/>
                                    <span>RESET FILTERS</span>
                                </button>
                                <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-semibold transition-colors">
                                    <FilterIcon className="w-3 h-3"/>
                                    <span>{isFilterVisible ? 'HIDE FILTERS' : 'SHOW FILTERS'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                        </div>
                    </div>
                    
                    {isFilterVisible && (
                        <FilterPanel 
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            priorityFilters={priorityFilters}
                            onPriorityFilterChange={setPriorityFilters}
                        />
                    )}

                    {isAdmin && (
                        <div className="mt-8">
                            <AddChecklistItemForm onAddItem={onAddItem} />
                        </div>
                    )}

                    <div className="mt-8">
                         <div className="hidden sm:grid grid-cols-[minmax(200px,1.5fr)_minmax(120px,auto)_minmax(250px,2fr)_minmax(100px,auto)] gap-4 px-4 py-2 border-b border-gray-700 text-xs text-gray-500 font-bold uppercase tracking-wider">
                           <div>Control</div>
                           <div>Status</div>
                           <div>Evidence & Notes</div>
                           {isAdmin && <div>Actions</div>}
                        </div>
                        <div>
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <ChecklistItemRow 
                                        key={item.id} 
                                        item={item}
                                        onUpdateItem={onUpdateItem}
                                        isAdmin={isAdmin}
                                        onEdit={() => onEditItem(item)}
                                        onDelete={() => onDeleteItem(item.id)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">No items match your filters.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CategoryDetail;
