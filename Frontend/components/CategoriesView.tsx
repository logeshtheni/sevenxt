
import React, { useState, useRef, useEffect } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Zap, Smartphone, Plus, Search, X, MoreVertical, Trash2, Edit2, Layers, AlertTriangle } from 'lucide-react';
import { MOCK_CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategoryItemProps {
  category: Category;
  level?: number;
  expandedCategories: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onAddSub: (parentId: string) => void;
  onDelete: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  level = 0, 
  expandedCategories, 
  onToggleExpand,
  onAddSub,
  onDelete,
  openMenuId,
  setOpenMenuId
}) => {
  const hasChildren = category.subCategories && category.subCategories.length > 0;
  const isExpanded = expandedCategories[category.id];
  const isMenuOpen = openMenuId === category.id;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, setOpenMenuId]);

  // Optimized padding for nested levels
  const paddingLeft = level * 14 + 12;

  return (
    <div className="select-none relative">
      <div 
        className={`
          flex items-center justify-between py-3 pr-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors group
          ${level > 0 ? 'bg-gray-50/30' : 'bg-white'}
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={(e) => {
            if (hasChildren) onToggleExpand(category.id);
        }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="shrink-0 w-5 flex justify-center">
            {hasChildren ? (
                <button 
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand(category.id);
                    }}
                >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
            ) : (
                <span className="w-5" /> 
            )}
          </div>
          
          <div className={`shrink-0 p-1.5 rounded-md ${category.type === 'Electronics' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
             {level === 0 ? (
               category.type === 'Electronics' ? <Smartphone size={16} /> : <Zap size={16} />
             ) : (
               isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
             )}
          </div>
          
          <div className="min-w-0 flex-1 pr-2">
              <div className="text-sm font-medium text-gray-900 truncate">{category.name}</div>
              {category.description && level === 0 && (
                  <div className="text-xs text-gray-500 hidden sm:block truncate">{category.description}</div>
              )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
           {category.itemCount > 0 && (
               <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap hidden xs:inline-block">
                  {category.itemCount} items
               </span>
           )}

           {/* 3 Dots Action Menu */}
           <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    setOpenMenuId(isMenuOpen ? null : category.id); 
                }}
                className={`p-1.5 rounded-md transition-colors ${isMenuOpen ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <MoreVertical size={16} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddSub(category.id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={14} /> Add Subcategory
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); alert("Edit functionality coming soon"); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <Edit2 size={14} /> Edit
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(category.id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Recursive Children Rendering */}
      {hasChildren && isExpanded && (
        <div className="border-l border-gray-200 ml-[22px] animate-in slide-in-from-top-1 duration-200">
          {category.subCategories?.map(sub => (
            <CategoryItem 
              key={sub.id} 
              category={sub} 
              level={level + 1} 
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              onAddSub={onAddSub}
              onDelete={onDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [activeType, setActiveType] = useState<'All' | 'Electronics' | 'Electrical'>('All');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    type: 'Electronics', 
    description: '' 
  });

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open modal for root category
  const openAddRootModal = () => {
      setTargetParentId(null);
      setNewCategory({ name: '', type: 'Electronics', description: '' });
      setShowAddModal(true);
  };

  // Open modal for sub category
  const openAddSubModal = (parentId: string) => {
      setTargetParentId(parentId);
      // Try to find parent to inherit type
      const parentType = findCategoryType(categories, parentId) || 'Electronics';
      setNewCategory({ name: '', type: parentType as any, description: '' });
      setShowAddModal(true);
      // Auto expand the parent
      setExpandedCategories(prev => ({...prev, [parentId]: true}));
  };

  const handleSaveCategory = () => {
    if (!newCategory.name.trim()) {
      alert("Category name is required");
      return;
    }

    const categoryToAdd: Category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name,
      type: newCategory.type as 'Electronics' | 'Electrical',
      itemCount: 0,
      description: newCategory.description,
      subCategories: []
    };

    if (targetParentId) {
        // Add as subcategory
        setCategories(prev => addNodeToTree(prev, targetParentId, categoryToAdd));
    } else {
        // Add as root category
        setCategories([...categories, categoryToAdd]);
    }

    setShowAddModal(false);
    setTargetParentId(null);
    setNewCategory({ name: '', type: 'Electronics', description: '' });
  };

  const confirmDeleteCategory = (id: string) => {
      setCategoryToDelete(id);
      setShowDeleteModal(true);
  };

  const executeDelete = () => {
      if (categoryToDelete) {
          setCategories(prev => deleteNodeFromTree(prev, categoryToDelete));
      }
      setShowDeleteModal(false);
      setCategoryToDelete(null);
  };

  // --- Helper Functions for Tree Manipulation ---

  const findCategoryType = (nodes: Category[], id: string): string | null => {
      for (const node of nodes) {
          if (node.id === id) return node.type;
          if (node.subCategories) {
              const found = findCategoryType(node.subCategories, id);
              if (found) return found;
          }
      }
      return null;
  };

  const addNodeToTree = (nodes: Category[], parentId: string, newNode: Category): Category[] => {
      return nodes.map(node => {
          if (node.id === parentId) {
              return { ...node, subCategories: [...(node.subCategories || []), newNode] };
          }
          if (node.subCategories) {
              return { ...node, subCategories: addNodeToTree(node.subCategories, parentId, newNode) };
          }
          return node;
      });
  };

  const deleteNodeFromTree = (nodes: Category[], id: string): Category[] => {
      return nodes
        .filter(node => node.id !== id)
        .map(node => {
            if (node.subCategories) {
                return { ...node, subCategories: deleteNodeFromTree(node.subCategories, id) };
            }
            return node;
        });
  };

  const filteredCategories = categories.filter(cat => {
    const matchesType = activeType === 'All' || cat.type === activeType;
    // Simple top-level search for now
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
            <p className="text-gray-500 mt-1">Manage product hierarchies and classifications</p>
            </div>
            <button 
              onClick={openAddRootModal}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm w-full sm:w-auto justify-center"
            >
                <Plus size={16} />
                Add Root Category
            </button>
        </div>
      </div>

      {/* --- CATEGORIES VIEW --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['All', 'Electronics', 'Electrical'].map((type) => (
                  <button
                      key={type}
                      onClick={() => setActiveType(type as any)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                          activeType === type 
                          ? 'bg-gray-900 text-white shadow' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                      {type}
                  </button>
              ))}
          </div>
          <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                  type="text" 
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Category Structure</span>
              <span className="mr-8">Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
              {filteredCategories.map(category => (
                  <CategoryItem 
                    key={category.id} 
                    category={category} 
                    expandedCategories={expandedCategories}
                    onToggleExpand={toggleExpand}
                    onAddSub={openAddSubModal}
                    onDelete={confirmDeleteCategory}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                  />
              ))}
              {filteredCategories.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                      No categories found matching your filters.
                  </div>
              )}
          </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  {targetParentId ? <Layers size={18} className="text-gray-500"/> : <Plus size={18} className="text-gray-500"/>}
                  {targetParentId ? 'Add Subcategory' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  placeholder={targetParentId ? "e.g. Android Phones" : "e.g. Smart Watches"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 bg-white"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                  disabled={!!targetParentId} // Disable type change if adding subcategory (inherit parent)
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Electrical">Electrical</option>
                </select>
                {targetParentId && <p className="text-xs text-gray-400 mt-1">Inherited from parent category.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Short description of the category..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none text-gray-900"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
                >
                  {targetParentId ? 'Add Subcategory' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Delete Category?
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete this category? This action will remove all subcategories and cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeDelete}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
