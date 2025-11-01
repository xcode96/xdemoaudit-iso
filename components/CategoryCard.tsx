import React from 'react';
import Card from './Card';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick: (id: string) => void;
}

const SmallCircularProgress: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#4a5568" strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
        {percentage}%
      </span>
    </div>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  // FIX: Destructure conformant and totalAuditable from category. The properties 'completed' and logic for 'ignored' items
  // were from an old data model and caused type errors.
  const { id, title, description, icon: Icon, color, conformant, totalAuditable } = category;
  const progress = totalAuditable > 0 ? Math.round((conformant / totalAuditable) * 100) : 0;

  return (
    <div onClick={() => onClick(id)} className="cursor-pointer h-full">
        <Card className="flex flex-col h-full hover:bg-[#3c465b] transition-colors duration-300 transform hover:-translate-y-1">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20`}}>
                    <Icon className="w-8 h-8" style={{color: color}} />
                </div>
                <SmallCircularProgress percentage={progress} color={color} />
            </div>
            <h3 className="mt-4 text-lg font-bold" style={{ color: color }}>{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="mt-4">
            {/* FIX: Updated display to show conformant vs total auditable items. */}
            <p className="text-sm font-semibold" style={{color: color}}>{conformant}/{totalAuditable} Conformant</p>
        </div>
        </Card>
    </div>
  );
};

export default CategoryCard;