
import React from 'react';
import CategoryCard from './CategoryCard';
import type { Category } from '../types';

interface CategoryGridProps {
    categories: Category[];
    onCategoryClick: (id: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategoryClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} onClick={onCategoryClick} />
      ))}
    </div>
  );
};

export default CategoryGrid;
