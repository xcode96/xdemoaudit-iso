
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProgressCard from './components/ProgressCard';
import BarChartListCard from './components/BarChartListCard';
import Footer from './components/Footer';
import CategoryDetail from './components/CategoryDetail';
import ClauseDetail from './components/ClauseDetail';
import FindingsCard from './components/FindingsCard';
import CorrectiveActionsCard from './components/CorrectiveActionsCard';
import WeightingModelTable from './components/WeightingModelTable';
import LoginModal from './components/LoginModal';
import EditCategoryModal from './components/EditCategoryModal';
import EditChecklistItemModal from './components/EditChecklistItemModal';
import AddCategoryForm from './components/AddCategoryForm';
import ImportExportControls from './components/ImportExportControls';
import GitHubSync from './components/GitHubSync';
import Card from './components/Card';
import ExportCard from './components/ExportCard';
import LearningHub from './components/LearningHub';
import { processRawCategories, sanitizeCategoriesForStorage } from './constants';
import type { Category, ChecklistItem, RawCategory, AuditStatus, LearningHubItem } from './types';
import { ICON_MAP, ShieldIcon } from './components/icons';
import { learningHubData as defaultLearningData } from './components/learningHubData';
import LearningItemModal from './components/LearningItemModal';


type Baseline = {
  overall: number;
  themes: Record<string, number>;
};

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [learningData, setLearningData] = useState<LearningHubItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<{item: ChecklistItem, categoryId: string} | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'learningHub'>('dashboard');
  const [learningItemForModal, setLearningItemForModal] = useState<LearningHubItem | 'new' | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);


  // Load initial data and admin status
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('isoAuditState');
      if (savedState) {
        const parsedState: RawCategory[] = JSON.parse(savedState);
        setCategories(processRawCategories(parsedState));
      } else {
         fetch('/checklist.json')
          .then(res => res.json())
          .then((data: RawCategory[]) => {
            setCategories(processRawCategories(data));
          });
      }
      const savedLearningData = localStorage.getItem('isoLearningHubData');
      if (savedLearningData) {
        setLearningData(JSON.parse(savedLearningData));
      } else {
        setLearningData(defaultLearningData);
      }
      const savedBaseline = localStorage.getItem('isoAuditBaseline');
      if (savedBaseline) {
        setBaseline(JSON.parse(savedBaseline));
      }
      const savedAdminStatus = localStorage.getItem('isoAuditAdmin');
      if (savedAdminStatus === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Could not parse state from localStorage, loading default.", error);
       fetch('/checklist.json')
          .then(res => res.json())
          .then((data: RawCategory[]) => {
            setCategories(processRawCategories(data));
          });
      setLearningData(defaultLearningData);
    } finally {
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!isLoading) {
        try {
            const storableCategories = sanitizeCategoriesForStorage(categories);
            localStorage.setItem('isoAuditState', JSON.stringify(storableCategories));
            localStorage.setItem('isoLearningHubData', JSON.stringify(learningData));
            if(baseline) {
                localStorage.setItem('isoAuditBaseline', JSON.stringify(baseline));
            }
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }
  }, [categories, learningData, baseline, isLoading]);

  const handleLogin = (password: string): boolean => {
    if (password === 'password') {
      setIsAdmin(true);
      localStorage.setItem('isoAuditAdmin', 'true');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isoAuditAdmin');
  };
  
  const handleUpdateItem = (categoryId: string, updatedItem: ChecklistItem) => {
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          const newItems = category.items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          );
          const notApplicableCount = newItems.filter(item => item.status === 'Not Applicable').length;
          
          return { 
            ...category, 
            items: newItems,
            conformant: newItems.filter(item => item.status === 'Conformant').length,
            nonConformant: newItems.filter(item => item.status === 'Non-Conformant').length,
            totalAuditable: newItems.length - notApplicableCount
          };
        }
        return category;
      })
    );
  };
  
  const handleResetProgress = (categoryId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          const newItems = category.items.map(item => ({...item, status: 'Not Audited' as AuditStatus, evidence: '' }));
          return { 
              ...category, 
              items: newItems, 
              conformant: 0,
              nonConformant: 0,
              totalAuditable: newItems.length,
            };
        }
        return category;
      })
    );
  };

  const handleResetBaseline = () => {
    const allItems = categories.flatMap(c => c.items);
    
    const auditableItems = allItems.filter(item => 
        item.status !== 'Not Applicable' &&
        typeof item.scope === 'number' && 
        typeof item.criticality === 'number' && 
        typeof item.impact === 'number'
    );

    const totalPossibleWeight = auditableItems.reduce((sum, item) => sum + (item.scope! * item.criticality! * item.impact!), 0);
    const conformantWeight = auditableItems.reduce((sum, item) => item.status === 'Conformant' ? sum + (item.scope! * item.criticality! * item.impact!) : sum, 0);
    const overall = totalPossibleWeight > 0 ? Math.round((conformantWeight / totalPossibleWeight) * 100) : 0;

    const themes: Record<string, number> = {};
    categories.forEach(category => {
      const catAuditableItems = category.items.filter(item => 
        item.status !== 'Not Applicable' &&
        typeof item.scope === 'number' && 
        typeof item.criticality === 'number' && 
        typeof item.impact === 'number'
      );
      const catTotalWeight = catAuditableItems.reduce((sum, item) => sum + (item.scope! * item.criticality! * item.impact!), 0);
      const catConformantWeight = catAuditableItems.reduce((sum, item) => item.status === 'Conformant' ? sum + (item.scope! * item.criticality! * item.impact!) : sum, 0);
      themes[category.id] = catTotalWeight > 0 ? Math.round((catConformantWeight / catTotalWeight) * 100) : 0;
    });

    setBaseline({ overall, themes });
    alert('Baseline has been updated to the current audit progress.');
  };

  // --- Admin CRUD Functions ---
  const handleAddCategory = (newCategoryData: Omit<Category, 'id' | 'total' | 'items' | 'icon'>) => {
    const newCategory: Category = {
      ...newCategoryData,
      id: `cat-${Date.now()}`,
      items: [],
      icon: ICON_MAP[newCategoryData.iconName] || ShieldIcon,
      total: 0,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    setEditingCategory(null);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this entire category and all its items? This action cannot be undone.')) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        setSelectedCategoryId(null);
    }
  };

  const handleAddItem = (categoryId: string, newItemData: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = {
      ...newItemData,
      id: `item-${Date.now()}`
    };
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = [...cat.items, newItem];
        return {
          ...cat,
          items: updatedItems,
          total: updatedItems.length,
          totalAuditable: updatedItems.filter(i => i.status !== 'Not Applicable').length,
        };
      }
      return cat;
    }));
  };
  
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this checklist item?')) {
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                const updatedItems = cat.items.filter(item => item.id !== itemId);
                 return {
                    ...cat,
                    items: updatedItems,
                    total: updatedItems.length,
                    conformant: updatedItems.filter(i => i.status === 'Conformant').length,
                    nonConformant: updatedItems.filter(i => i.status === 'Non-Conformant').length,
                    totalAuditable: updatedItems.filter(i => i.status !== 'Not Applicable').length,
                };
            }
            return cat;
        }));
    }
  };

  const handleImportData = (data: RawCategory[]) => {
    setCategories(processRawCategories(data));
    alert('Data imported successfully!');
  };

  // --- Learning Hub CRUD ---
  const handleSaveLearningItem = (item: LearningHubItem) => {
    const isEditing = learningData.some(i => i.id === item.id);

    if (isEditing) {
      setLearningData(prev => prev.map(i => (i.id === item.id ? item : i)));
    } else {
      if (learningData.some(i => i.id.toLowerCase() === item.id.toLowerCase())) {
        alert('An item with this ID already exists. Please use a unique ID.');
        return;
      }
      setLearningData(prev => [...prev, item].sort((a,b) => a.id.localeCompare(b.id)));
    }
    setLearningItemForModal(null);
  };

  const handleDeleteLearningItem = (itemId: string) => {
    if (window.confirm(`Are you sure you want to delete the guidance for "${itemId}"? This cannot be undone.`)) {
      setLearningData(prev => prev.filter(i => i.id !== itemId));
    }
  };
  
  const handleClauseClick = (clauseId: string) => {
    setSelectedClauseId(clauseId);
  };
  
  const handleBackFromClause = () => {
    setSelectedClauseId(null);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-[#1a1e26] text-white">Loading...</div>;
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-[#1a1e26] text-gray-300 font-sans">
      <Header 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogout={handleLogout}
        onNavigateToLearningHub={() => setCurrentView('learningHub')}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'learningHub' ? (
          <LearningHub 
            onBack={() => setCurrentView('dashboard')}
            learningData={learningData}
            isAdmin={isAdmin}
            onAddItem={() => setLearningItemForModal('new')}
            onEditItem={(item) => setLearningItemForModal(item)}
            onDeleteItem={handleDeleteLearningItem}
          />
        ) : selectedClauseId ? (
          <ClauseDetail
            clauseId={selectedClauseId}
            onBack={handleBackFromClause}
            categories={categories}
            learningData={learningData}
          />
        ) : selectedCategory ? (
          <CategoryDetail
            category={selectedCategory}
            onBack={() => setSelectedCategoryId(null)}
            onUpdateItem={(item) => handleUpdateItem(selectedCategory.id, item)}
            onResetProgress={handleResetProgress}
            isAdmin={isAdmin}
            onEditCategory={() => setEditingCategory(selectedCategory)}
            onDeleteCategory={handleDeleteCategory}
            onAddItem={(newItem) => handleAddItem(selectedCategory.id, newItem)}
            onEditItem={(item) => setEditingItem({ item, categoryId: selectedCategory.id })}
            onDeleteItem={(itemId) => handleDeleteItem(selectedCategory.id, itemId)}
            onClauseClick={handleClauseClick}
          />
        ) : (
          <>
            <Hero />
             <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProgressCard categories={categories} baseline={baseline} onResetBaseline={handleResetBaseline} />
                    <BarChartListCard categories={categories} baseline={baseline} onCategoryClick={(id) => setSelectedCategoryId(id)} />
                </div>
                <div className="lg:col-span-3 space-y-8">
                    <FindingsCard categories={categories} />
                    <CorrectiveActionsCard categories={categories} />
                    <ExportCard categories={categories} baseline={baseline} />
                </div>
            </div>
            
            {isAdmin && (
               <div className="mt-8">
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Admin Tools</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <AddCategoryForm onAddCategory={handleAddCategory} />
                      <div className="space-y-8">
                        <ImportExportControls categories={categories} onImport={handleImportData} />
                        <GitHubSync categories={categories} onImport={handleImportData} />
                      </div>
                    </div>
                </Card>
              </div>
            )}

            <div className="mt-8">
              <WeightingModelTable categories={categories} />
            </div>
          </>
        )}
      </main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      {editingCategory && (
        <EditCategoryModal 
            isOpen={!!editingCategory} 
            onClose={() => setEditingCategory(null)} 
            category={editingCategory}
            onSave={handleUpdateCategory} 
        />
      )}
      {editingItem && (
        <EditChecklistItemModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            item={editingItem.item}
            categoryId={editingItem.categoryId}
            onSave={(catId, item) => {
                handleUpdateItem(catId, item);
                setEditingItem(null);
            }}
        />
      )}
      <LearningItemModal
        isOpen={!!learningItemForModal}
        onClose={() => setLearningItemForModal(null)}
        onSave={handleSaveLearningItem}
        itemToEdit={learningItemForModal !== 'new' ? learningItemForModal : undefined}
      />
    </div>
  );
};

export default App;
