
import React, { useState, useEffect } from 'react';
import type { LearningHubItem } from '../types';
import Card from './Card';

interface LearningItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: LearningHubItem) => void;
  itemToEdit?: LearningHubItem | null;
}

const LearningItemModal: React.FC<LearningItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const [id, setId] = useState('');
    const [what, setWhat] = useState('');
    const [why, setWhy] = useState('');
    const [how, setHow] = useState('');

    const isEditMode = !!itemToEdit;

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setId(itemToEdit.id);
                setWhat(itemToEdit.what);
                setWhy(itemToEdit.why);
                setHow(itemToEdit.how);
            } else {
                setId('');
                setWhat('');
                setWhy('');
                setHow('');
            }
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id.trim() || !what.trim() || !why.trim() || !how.trim()) {
            alert('All fields are required.');
            return;
        }
        onSave({ id, what, why, how });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">{isEditMode ? 'Edit' : 'Add'} Guidance</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="learning-id" className="block text-sm font-medium text-gray-400">ID (Clause / Annex)</label>
                            <input
                                type="text"
                                id="learning-id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                disabled={isEditMode}
                                className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:opacity-50"
                                placeholder="e.g., Annex A.5 or Clause 4.1"
                            />
                        </div>
                        <div>
                            <label htmlFor="learning-what" className="block text-sm font-medium text-gray-400">What</label>
                            <textarea
                                id="learning-what"
                                value={what}
                                onChange={(e) => setWhat(e.target.value)}
                                rows={2}
                                className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Explain what the control or clause is."
                            />
                        </div>
                        <div>
                            <label htmlFor="learning-why" className="block text-sm font-medium text-gray-400">Why</label>
                            <textarea
                                id="learning-why"
                                value={why}
                                onChange={(e) => setWhy(e.target.value)}
                                rows={2}
                                className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Explain why it matters."
                            />
                        </div>
                        <div>
                            <label htmlFor="learning-how" className="block text-sm font-medium text-gray-400">How</label>
                            <textarea
                                id="learning-how"
                                value={how}
                                onChange={(e) => setHow(e.target.value)}
                                rows={2}
                                className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Explain how to implement or improve it."
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LearningItemModal;
