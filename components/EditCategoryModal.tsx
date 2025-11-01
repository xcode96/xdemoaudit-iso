
import React, { useState, useEffect } from 'react';
import type { Category, IconName } from '../types';
import { ICON_MAP } from './icons';
import Card from './Card';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSave: (updatedCategory: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, category, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [color, setColor] = useState('#facc15');
    const [iconName, setIconName] = useState<IconName>('KeyIcon');

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setDescription(category.description);
      setLongDescription(category.longDescription);
      setColor(category.color);
      setIconName(category.iconName);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCategory = { 
        ...category, 
        title, 
        description, 
        longDescription, 
        color, 
        iconName,
        icon: ICON_MAP[iconName as IconName]
    };
    onSave(updatedCategory);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">Edit Category</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                    <label htmlFor="edit-cat-title" className="block text-sm font-medium text-gray-400">Title</label>
                    <input
                        type="text"
                        id="edit-cat-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="edit-cat-description" className="block text-sm font-medium text-gray-400">Short Description</label>
                    <input
                        type="text"
                        id="edit-cat-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="edit-cat-long-description" className="block text-sm font-medium text-gray-400">Long Description</label>
                    <textarea
                        id="edit-cat-long-description"
                        rows={3}
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="edit-cat-icon" className="block text-sm font-medium text-gray-400">Icon</label>
                    <select
                        id="edit-cat-icon"
                        value={iconName}
                        onChange={(e) => setIconName(e.target.value as IconName)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        {Object.keys(ICON_MAP).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="edit-cat-color" className="block text-sm font-medium text-gray-400">Color</label>
                    <input
                        type="color"
                        id="edit-cat-color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1 block w-full h-10 bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm p-1"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3">
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

export default EditCategoryModal;
