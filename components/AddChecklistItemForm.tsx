import React, { useState } from 'react';
import type { ChecklistItem } from '../types';
import Card from './Card';

interface AddChecklistItemFormProps {
    // FIX: The `id` property is generated in the parent component, so it should be omitted from the type here.
    // The properties 'completed' and 'ignored' are from an old data model and are no longer in use.
    onAddItem: (newItem: Omit<ChecklistItem, 'id'>) => void;
}

const AddChecklistItemForm: React.FC<AddChecklistItemFormProps> = ({ onAddItem }) => {
    const [security, setSecurity] = useState('');
    const [priority, setPriority] = useState<'Essential' | 'Optional' | 'Advanced' | 'Basic'>('Optional');
    const [details, setDetails] = useState('');
    const [clause, setClause] = useState('');
    const [scope, setScope] = useState('');
    const [criticality, setCriticality] = useState('');
    const [impact, setImpact] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!security.trim() || !details.trim()) {
            alert('Please fill out all fields.');
            return;
        }

        // FIX: Added missing 'status' and 'evidence' properties to align with the ChecklistItem type.
        // Also updated the newItem type to Omit<ChecklistItem, 'id'>.
        const newItem: Omit<ChecklistItem, 'id'> = {
            security,
            priority,
            details,
            status: 'Not Audited',
            evidence: '',
        };

        if (clause.trim()) {
            newItem.clause = clause.trim();
        }

        const scopeNum = parseFloat(scope);
        if (!isNaN(scopeNum)) newItem.scope = scopeNum;

        const criticalityNum = parseFloat(criticality);
        if (!isNaN(criticalityNum)) newItem.criticality = criticalityNum;

        const impactNum = parseFloat(impact);
        if (!isNaN(impactNum)) newItem.impact = impactNum;
        
        onAddItem(newItem);
        
        // Reset form
        setSecurity('');
        setPriority('Optional');
        setDetails('');
        setClause('');
        setScope('');
        setCriticality('');
        setImpact('');
    };

    return (
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">Add New Checklist Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="security" className="block text-sm font-medium text-gray-400">Advice</label>
                    <input
                        type="text"
                        id="security"
                        value={security}
                        onChange={(e) => setSecurity(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g., Use a Hardware Token"
                    />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-400">Priority Level</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        <option>Essential</option>
                        <option>Optional</option>
                        <option>Advanced</option>
                        <option>Basic</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="clause" className="block text-sm font-medium text-gray-400">Clause / Reference (Optional)</label>
                    <input
                        type="text"
                        id="clause"
                        value={clause}
                        onChange={(e) => setClause(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g., Clause 4.1 · Understanding the context"
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="scope" className="block text-sm font-medium text-gray-400">Scope (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="scope"
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="1.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="criticality" className="block text-sm font-medium text-gray-400">Criticality (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="criticality"
                            value={criticality}
                            onChange={(e) => setCriticality(e.target.value)}
                             className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="1.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="impact" className="block text-sm font-medium text-gray-400">Impact (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="impact"
                            value={impact}
                            onChange={(e) => setImpact(e.target.value)}
                             className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="4.00"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-400">Details</label>
                    <textarea
                        id="details"
                        rows={4}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Provide a detailed explanation and any relevant links using markdown format..."
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                        Add Item
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddChecklistItemForm;