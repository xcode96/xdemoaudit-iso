
import React from 'react';
import Card from './Card';
import type { Category, RawCategory } from '../types';
import { sanitizeCategoriesForStorage } from '../constants';

interface ImportExportControlsProps {
  categories: Category[];
  onImport: (data: RawCategory[]) => void;
}

const ImportExportControls: React.FC<ImportExportControlsProps> = ({ categories, onImport }) => {

  const handleExport = () => {
    try {
      const storableData = sanitizeCategoriesForStorage(categories);
      const dataStr = JSON.stringify(storableData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'digital-defense-backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Could not export data. See console for details.");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not valid text.');
        }
        const parsedData = JSON.parse(text);

        // Basic validation for RawCategory structure
        if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].id && parsedData[0].title && Array.isArray(parsedData[0].items)) {
           if (window.confirm('Are you sure you want to import this data? This will overwrite your current checklist.')) {
             onImport(parsedData);
           }
        } else {
          alert('Invalid file format. Please import a valid checklist backup file.');
        }
      } catch (error) {
        console.error("Error importing data:", error);
        alert('Failed to import data. The file might be corrupted or in the wrong format.');
      }
    };
    reader.onerror = () => {
        alert('Error reading the file.');
    }
    reader.readAsText(file);
    // Reset input value to allow importing the same file again
    event.target.value = '';
  };

  const triggerImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => handleImport(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Manage Data</h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleExport}
          className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          Export Data
        </button>
        <button
          onClick={triggerImport}
          className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
        >
          Import Data
        </button>
      </div>
    </Card>
  );
};

export default ImportExportControls;
