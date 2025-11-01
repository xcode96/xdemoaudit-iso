import React, { useState } from 'react';
import type { Category, IconName } from '../types';
import { ICON_MAP } from './icons';
import Card from './Card';

interface AddCategoryFormProps {
    // FIX: The 'completed' property is from an old data model. It has been removed from Omit.
    // The parent component will handle id, total, items, and icon.
    onAddCategory: (newCategoryData: Omit<Category, 'id' | 'total' | 'items' | 'icon'>) => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onAddCategory }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [color, setColor] = useState('#facc15');
    const [iconName, setIconName] = useState<IconName>('KeyIcon');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !longDescription.trim()) {
            alert('Please fill out all fields.');
            return;
        }

        // FIX: Added missing properties to match the Omit<Category, ...> type.
        // A new category starts with 0 counts.
        onAddCategory({ 
            title, 
            description, 
            longDescription, 
            color, 
            iconName, 
            conformant: 0, 
            nonConformant: 0, 
            totalAuditable: 0 
        });

        // Reset form
        setTitle('');
        setDescription('');
        setLongDescription('');
        setColor('#facc15');
        setIconName('KeyIcon');
    };

    return (
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">Add New Category</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="cat-title" className="block text-sm font-medium text-gray-400">Title</label>
                    <input
                        type="text"
                        id="cat-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g., Cloud Security"
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="cat-description" className="block text-sm font-medium text-gray-400">Short Description</label>
                    <input
                        type="text"
                        id="cat-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="A brief summary for the category card"
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="cat-long-description" className="block text-sm font-medium text-gray-400">Long Description</label>
                    <textarea
                        id="cat-long-description"
                        rows={3}
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        className="mt-1 block w-full bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="A more detailed description for the category detail page"
                    />
                </div>
                <div>
                    <label htmlFor="cat-icon" className="block text-sm font-medium text-gray-400">Icon</label>
                    <select
                        id="cat-icon"
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
                    <label htmlFor="cat-color" className="block text-sm font-medium text-gray-400">Color</label>
                    <input
                        type="color"
                        id="cat-color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1 block w-full h-10 bg-[#1a1e26] border border-gray-600 rounded-md shadow-sm p-1"
                    />
                </div>
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                        Add Category
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddCategoryForm;