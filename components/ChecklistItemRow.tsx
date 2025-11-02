
import React, { useState, useEffect } from 'react';
import type { ChecklistItem, AuditStatus } from '../types';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onUpdateItem: (updatedItem: ChecklistItem) => void;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClauseClick: (clauseId: string) => void;
}

const getStatusClasses = (status: AuditStatus): { bg: string, text: string, ring: string, selectBg: string } => {
    switch (status) {
        case 'Conformant':
            return { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'focus:ring-green-500', selectBg: 'bg-green-500/20' };
        case 'Non-Conformant':
            return { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'focus:ring-rose-500', selectBg: 'bg-rose-500/20' };
        case 'Observation':
            return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', ring: 'focus:ring-yellow-500', selectBg: 'bg-yellow-500/20' };
        case 'Not Applicable':
            return { bg: 'bg-gray-500/10 opacity-60', text: 'text-gray-400', ring: 'focus:ring-gray-500', selectBg: 'bg-gray-500/20' };
        case 'Not Audited':
        default:
            return { bg: 'bg-transparent', text: 'text-gray-300', ring: 'focus:ring-purple-500', selectBg: 'bg-gray-600/50' };
    }
};

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);


const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({ item, onUpdateItem, isAdmin, onEdit, onDelete, onClauseClick }) => {
    const { id, security, details, status, clause } = item;
    
    const [evidence, setEvidence] = useState(item.evidence);
    const statusClasses = getStatusClasses(status);

    useEffect(() => {
        setEvidence(item.evidence);
    }, [item.evidence]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateItem({ ...item, status: e.target.value as AuditStatus });
    };

    const handleEvidenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEvidence(e.target.value);
    };

    const handleEvidenceBlur = () => {
        if (evidence !== item.evidence) {
            onUpdateItem({ ...item, evidence: evidence });
        }
    };
    
    const formattedDetails = details.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">$1</a>');

    return (
        <div className={`sm:grid ${isAdmin ? 'sm:grid-cols-[minmax(200px,1.5fr)_minmax(120px,auto)_minmax(250px,2fr)_minmax(100px,auto)]' : 'sm:grid-cols-[minmax(200px,1.5fr)_minmax(120px,auto)_minmax(250px,2fr)]'} items-start gap-x-4 gap-y-2 py-4 border-b border-gray-700 ${statusClasses.bg}`}>
            {/* Column 1: Control Details */}
            <div className="px-4 py-2 sm:p-0">
                <p className="font-semibold text-white">{security}</p>
                {clause && (
                    <button 
                        onClick={() => onClauseClick(clause)} 
                        className="text-sm text-purple-400 hover:text-white hover:underline transition-colors text-left mt-1"
                        aria-label={`View details for clause ${clause}`}
                    >
                        {clause}
                    </button>
                )}
                <div className="text-sm text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: formattedDetails }} />
            </div>

            {/* Column 2: Status */}
            <div className="px-4 py-2 sm:p-0 sm:flex sm:items-center sm:h-full">
                <select
                    aria-label={`Set status for ${security}`}
                    value={status}
                    onChange={handleStatusChange}
                    className={`w-full sm:w-auto text-sm font-semibold rounded-md border-0 py-1.5 pl-3 pr-10 focus:ring-2 focus:ring-inset ${statusClasses.text} ${statusClasses.ring} ${statusClasses.selectBg}`}
                >
                    <option value="Not Audited">Not Audited</option>
                    <option value="Conformant">Conformant</option>
                    <option value="Non-Conformant">Non-Conformant</option>
                    <option value="Observation">Observation</option>
                    <option value="Not Applicable">Not Applicable</option>
                </select>
            </div>

            {/* Column 3: Evidence & Notes */}
            <div className="px-4 py-2 sm:p-0 sm:flex sm:items-center sm:h-full">
                <textarea
                    aria-label={`Evidence for ${security}`}
                    value={evidence}
                    onChange={handleEvidenceChange}
                    onBlur={handleEvidenceBlur}
                    rows={3}
                    className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Record evidence and auditor notes here..."
                    disabled={status === 'Not Applicable'}
                />
            </div>
            
            {/* Column 4: Admin Actions */}
            {isAdmin && (
                <div className="px-4 py-2 sm:p-0 sm:flex sm:items-center sm:h-full">
                    <div className="flex space-x-2">
                        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"><PencilIcon className="w-4 h-4"/></button>
                        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-rose-400 bg-gray-700 hover:bg-rose-500/20 rounded-md transition-colors"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChecklistItemRow;
